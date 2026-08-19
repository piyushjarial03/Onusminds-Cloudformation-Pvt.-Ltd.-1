from dotenv import load_dotenv
load_dotenv()

import os
import re
import uuid
import asyncio
import ipaddress
import logging
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from datetime import datetime, timezone, timedelta
from typing import Optional, List

import bcrypt
import jwt
import httpx
import requests
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response, UploadFile, File
from fastapi.responses import Response as RawResponse
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

# ---------- Emergent managed email (Resend proxy) ----------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_NOTIFY_EMAIL = os.environ.get("OWNER_NOTIFY_EMAIL")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client_http:
        resp = await client_http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


# ---------- Object storage ----------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "onusminds"
storage_key = None

MIME_TYPES = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp",
}


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------- Auth ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") not in ("admin", "owner", "sr_admin"):
        raise HTTPException(status_code=401, detail="Not authorized")
    return user


async def get_owner(request: Request) -> dict:
    user = await get_current_admin(request)
    if user.get("role") != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")
    return user


async def get_request_manager(request: Request) -> dict:
    user = await get_current_admin(request)
    if user.get("role") not in ("owner", "sr_admin"):
        raise HTTPException(status_code=403, detail="Insufficient access")
    return user


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/auth/login")
async def login(payload: LoginIn, request: Request, response: Response):
    email = payload.email.lower().strip()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier}, {"_id": 0})
    if attempt and attempt.get("count", 0) >= 5:
        locked_since = datetime.fromisoformat(attempt["updated_at"])
        if datetime.now(timezone.utc) - locked_since < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], email)
    response.set_cookie(key="access_token", value=token, httponly=True, secure=True,
                        samesite="none", max_age=43200, path="/")
    return {"id": user["id"], "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin"), "token": token}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"status": "ok"}


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- Leads ----------
class LeadCreate(BaseModel):
    kind: str = "request_work"
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    contact_method: Optional[str] = None
    message: str


@api_router.post("/leads")
async def create_lead(payload: LeadCreate):
    kind = payload.kind if payload.kind in ("request_work", "contact") else "request_work"
    doc = {
        "id": str(uuid.uuid4()),
        "kind": kind,
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "company": payload.company,
        "phone": payload.phone,
        "service": payload.service,
        "contact_method": payload.contact_method,
        "message": payload.message.strip(),
        "read": False,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(doc)
    doc.pop("_id", None)

    if OWNER_NOTIFY_EMAIL:
        try:
            label = "Request Work enquiry" if kind == "request_work" else "Contact Us message"
            rows = "".join(
                f'<tr><td style="padding:6px 12px;color:#888;font-size:13px">{escape(k)}</td>'
                f'<td style="padding:6px 12px;font-size:13px">{escape(v)}</td></tr>'
                for k, v in [("Name", doc["name"]), ("Email", doc["email"]),
                             ("Company", doc.get("company") or "-"),
                             ("Phone", doc.get("phone") or "-"),
                             ("Service", doc.get("service") or "-"),
                             ("Preferred contact", doc.get("contact_method") or "-"),
                             ("Message", doc["message"])]
            )
            html = (f'<table role="presentation" width="100%"><tr><td style="padding:24px;'
                    f'font-family:Arial,sans-serif">'
                    f'<p style="font-size:16px;font-weight:bold">New {escape(label)} on OnusMinds</p>'
                    f'<table role="presentation" style="border-collapse:collapse">{rows}</table>'
                    f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)} website. '
                    f'Reply directly to this email to respond to the sender.</p></td></tr></table>')
            await send_email(to=OWNER_NOTIFY_EMAIL, subject=f"New {label} — {doc['name']}",
                             html=html, reply_to=doc["email"])
        except Exception as e:
            logger.error(f"Lead notification email failed: {e}")
    return {"status": "ok", "id": doc["id"]}


@api_router.get("/admin/leads")
async def list_leads(admin=Depends(get_current_admin)):
    return await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api_router.patch("/admin/leads/{lead_id}")
async def update_lead(lead_id: str, payload: dict, admin=Depends(get_request_manager)):
    update = {}
    if payload.get("status") in ("new", "in_progress", "completed"):
        update["status"] = payload["status"]
        update["read"] = payload["status"] != "new"
    if "read" in payload:
        update["read"] = bool(payload["read"])
    if update:
        await db.leads.update_one({"id": lead_id}, {"$set": update})
    return {"status": "ok"}


@api_router.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, admin=Depends(get_request_manager)):
    await db.leads.delete_one({"id": lead_id})
    return {"status": "ok"}


# ---------- News ----------
class NewsIn(BaseModel):
    title: str
    category: str = "News"
    excerpt: str = ""
    content: str = ""
    image_url: Optional[str] = None
    published: bool = True


def slugify(title: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return s or uuid.uuid4().hex[:8]


@api_router.get("/news")
async def list_news():
    return await db.news.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api_router.get("/news/{slug}")
async def get_news(slug: str):
    doc = await db.news.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    return doc


@api_router.get("/admin/news")
async def admin_list_news(admin=Depends(get_current_admin)):
    return await db.news.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.post("/admin/news")
async def admin_create_news(payload: NewsIn, admin=Depends(get_current_admin)):
    base = slugify(payload.title)
    slug = base
    n = 1
    while await db.news.find_one({"slug": slug}):
        n += 1
        slug = f"{base}-{n}"
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "slug": slug,
                "created_at": datetime.now(timezone.utc).isoformat()})
    await db.news.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/news/{news_id}")
async def admin_update_news(news_id: str, payload: NewsIn, admin=Depends(get_current_admin)):
    existing = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    update = payload.model_dump()
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.news.update_one({"id": news_id}, {"$set": update})
    return {**existing, **update}


@api_router.delete("/admin/news/{news_id}")
async def admin_delete_news(news_id: str, admin=Depends(get_current_admin)):
    await db.news.delete_one({"id": news_id})
    return {"status": "ok"}


# ---------- Uploads & files ----------
@api_router.post("/admin/upload")
async def admin_upload(admin=Depends(get_current_admin), file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "bin"
    if ext not in MIME_TYPES:
        raise HTTPException(status_code=400, detail="Only jpg, png, gif, webp images are allowed")
    data = await file.read()
    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 8MB")
    content_type = file.content_type or MIME_TYPES[ext]
    path = f"{APP_NAME}/news/{uuid.uuid4()}.{ext}"
    result = await asyncio.to_thread(put_object, path, data, content_type)
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = await asyncio.to_thread(get_object, path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    return RawResponse(content=data, media_type=record.get("content_type") or content_type)


# ---------- Site content ----------
DEFAULT_CONTENT = {
    "logo_url": "",
    "hero_eyebrow": "IT Services & Consulting / Digital Marketing",
    "hero_title": "Cloud Infrastructure.\nScale with ease,\nperform with speed.\nBuilt to grow\nwith the cloud.",
    "hero_text": "OnusMinds unites two disciplines under one engagement — the engineers who keep your platform alive, and the marketers who make it matter.",
    "overview_title": "Two disciplines.\nOne engagement.",
    "capabilities_title": "What we do\nexceptionally well",
    "request_title": "Tell us what\nyou're building",
    "request_text": "One form, one business day. A senior engineer or strategist — never a salesperson — replies with a point of view on your problem.",
    "contact_email": "info@onusminds.com",
    "contact_phone": "+91 78077 22158",
    "whatsapp_number": "+91 78077 22158",
    "nav_cta": "Start a conversation",
    "footer_credit": "© 2026 OnusMinds. All rights reserved.",
}


@api_router.get("/content")
async def get_content():
    doc = await db.site_content.find_one({"key": "main"}, {"_id": 0})
    return doc["data"] if doc else DEFAULT_CONTENT


@api_router.put("/admin/content")
async def put_content(payload: dict, admin=Depends(get_owner)):
    clean = {k: str(v) for k, v in payload.items() if k in DEFAULT_CONTENT}
    await db.site_content.update_one({"key": "main"}, {"$set": {"data": clean}}, upsert=True)
    merged = dict(DEFAULT_CONTENT)
    merged.update(clean)
    return merged


# ---------- Services ----------
DEFAULT_SERVICES = [
    {
        "slug": "infrastructure-cloud", "title": "Infrastructure & Cloud", "discipline": "IT Services",
        "tagline": "Platforms engineered to never blink.",
        "short": "Architecture reviews, cloud migration, and cost cleanup for teams running on AWS, Azure, or GCP.",
        "description": [
            "Your infrastructure is the silent partner in every campaign, launch and transaction. We design cloud environments on AWS, Azure and GCP that scale elastically with demand — and fail gracefully when the unexpected happens.",
            "From greenfield architecture to brownfield migration, our engineers work in audited, documented, infrastructure-as-code engagements. Nothing lives in someone's head; everything lives in version control.",
        ],
        "deliverables": ["Cloud architecture & landing zones", "Migration & modernisation programs", "Kubernetes & container orchestration", "Infrastructure as Code (Terraform)", "CI/CD pipeline engineering", "Cost optimisation & FinOps reviews"],
        "outcomes": ["99.95% uptime track record", "Up to 40% cloud cost reduction", "Deploys measured in minutes, not days"],
    },
    {
        "slug": "managed-it-support", "title": "Managed IT Support", "discipline": "IT Services",
        "tagline": "A follow-the-sun safety net for your stack.",
        "short": "Day-to-day helpdesk, endpoint monitoring, and patching so nothing depends on one in-house person.",
        "description": [
            "Downtime doesn't keep office hours, and neither do we. Our managed support practice watches your systems around the clock across three time zones, resolving most incidents before your users ever notice.",
            "Beyond firefighting, we run the unglamorous discipline that prevents fires: patch cadences, backup verification, capacity planning and blameless postmortems that turn every incident into a hardening exercise.",
        ],
        "deliverables": ["24/7 monitoring & alerting", "15-minute critical incident SLA", "Service desk & end-user support", "Patch & vulnerability management", "Backup & disaster recovery drills", "Quarterly service reviews"],
        "outcomes": ["15-min critical response SLA", "Proactive resolution of 80% of incidents", "Blameless postmortem culture"],
    },
    {
        "slug": "seo-content-strategy", "title": "SEO & Content Strategy", "discipline": "Digital Marketing",
        "tagline": "Organic growth, engineered in the codebase.",
        "short": "Technical SEO fixes, keyword mapping, and an editorial calendar built around what your buyers search.",
        "description": [
            "Search performance is won in the codebase as much as in the copy. Our strategists sit inside the engineering sprint — Core Web Vitals, crawl budgets and structured data ship as pull requests, not slide decks.",
            "On top of that technical foundation, we build editorial engines: topic clusters mapped to intent, a publishing cadence your team can actually sustain, and measurement tied to pipeline rather than vanity rankings.",
        ],
        "deliverables": ["Technical SEO audits & fixes", "Keyword & intent mapping", "Editorial calendar & content ops", "Digital PR & link acquisition", "Structured data & schema", "Organic performance dashboards"],
        "outcomes": ["Compounding organic traffic", "Rankings tied to revenue, not vanity", "Content velocity your team can sustain"],
    },
    {
        "slug": "paid-media-performance", "title": "Paid Media & Performance", "discipline": "Digital Marketing",
        "tagline": "Every rupee accountable. Every click measured.",
        "short": "Search and social campaigns managed to a cost-per-lead target, not a vanity impression count.",
        "description": [
            "Paid media should be an investment with a statement, not an expense with a hope. We plan, launch and optimise campaigns across Google, Meta, LinkedIn and programmatic with creative testing built into the operating rhythm.",
            "Attribution is where most agencies go quiet; it's where we start. Server-side tracking, clean UTM governance and weekly budget reallocation mean your spend flows to what actually converts.",
        ],
        "deliverables": ["Paid search & shopping campaigns", "Paid social & programmatic", "Landing page CRO", "Server-side tracking & attribution", "Creative testing frameworks", "Weekly budget reallocation"],
        "outcomes": ["ROAS reported weekly, not monthly", "Creative tested in structured sprints", "Full-funnel attribution clarity"],
    },
]


@api_router.get("/services")
async def list_services():
    return await db.services.find({"visible": True}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/admin/services")
async def admin_list_services(admin=Depends(get_current_admin)):
    return await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.put("/admin/services/bulk")
async def bulk_services(payload: dict, admin=Depends(get_owner)):
    items = payload.get("services", [])
    kept_ids = []
    for i, item in enumerate(items):
        title = (item.get("title") or "").strip()
        if not title:
            continue
        doc = {
            "title": title,
            "discipline": item.get("discipline") or "IT Services",
            "short": item.get("short") or "",
            "tagline": item.get("tagline") or item.get("short") or "",
            "description": item.get("description") or ([item.get("short")] if item.get("short") else []),
            "deliverables": item.get("deliverables") or [],
            "outcomes": item.get("outcomes") or [],
            "visible": bool(item.get("visible", True)),
            "order": i + 1,
        }
        sid = item.get("id")
        existing = await db.services.find_one({"id": sid}) if sid else None
        if existing:
            doc["slug"] = existing.get("slug") or slugify(title)
            await db.services.update_one({"id": sid}, {"$set": doc})
        else:
            sid = str(uuid.uuid4())
            base = slugify(title)
            slug = base
            n = 1
            while await db.services.find_one({"slug": slug}):
                n += 1
                slug = f"{base}-{n}"
            doc.update({"id": sid, "slug": slug})
            await db.services.insert_one(doc)
        kept_ids.append(sid)
    await db.services.delete_many({"id": {"$nin": kept_ids}})
    return await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)


# ---------- Stats & team ----------
@api_router.get("/admin/stats")
async def admin_stats(admin=Depends(get_current_admin)):
    leads = await db.leads.find({}, {"_id": 0, "status": 1}).to_list(5000)
    total = len(leads)
    completed = sum(1 for l in leads if l.get("status") == "completed")
    attention = sum(1 for l in leads if l.get("status", "new") in ("new", "in_progress"))
    active_services = await db.services.count_documents({"visible": True})
    return {"total": total, "attention": attention, "completed": completed, "active_services": active_services}


class TeamCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "admin"


@api_router.get("/admin/team")
async def list_team(admin=Depends(get_owner)):
    return await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(100)


@api_router.post("/admin/team")
async def create_team_member(payload: TeamCreate, admin=Depends(get_owner)):
    email = payload.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": payload.name.strip(),
        "role": payload.role if payload.role in ("admin", "owner", "sr_admin") else "admin",
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    doc.pop("password_hash")
    return doc


@api_router.delete("/admin/team/{user_id}")
async def delete_team_member(user_id: str, admin=Depends(get_owner)):
    if user_id == admin["id"]:
        raise HTTPException(status_code=400, detail="You cannot remove your own account")
    await db.users.delete_one({"id": user_id})
    return {"status": "ok"}


# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"message": "OnusMinds API", "status": "ok"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Seeding ----------
async def seed_admin():
    email = ADMIN_EMAIL.lower()
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": email, "name": "Piyush Jarial",
            "role": "admin", "password_hash": hash_password(ADMIN_PASSWORD),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})


SEED_NEWS = [
    {
        "title": "OnusMinds Launches Unified Cloud + Growth Practice",
        "category": "Announcement",
        "excerpt": "Our new engagement model pairs infrastructure engineers with performance marketers from day one — one team, one roadmap, one outcome.",
        "content": "OnusMinds today announced its unified engagement model, bringing cloud infrastructure and digital marketing under a single statement of work.\n\nToo many companies run technology and growth as separate conversations. We believe they are one conversation: platforms that cannot scale strangle campaigns that succeed, and campaigns without an engineering backbone collapse under their own demand.\n\nThe new practice pairs a senior infrastructure lead with a growth strategist on every engagement, with shared KPIs and a single weekly cadence.",
        "image_url": "https://images.pexels.com/photos/30547584/pexels-photo-30547584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "title": "Inside Our 24/7 Managed Support Operations",
        "category": "Engineering",
        "excerpt": "A look at the follow-the-sun roster, escalation ladders and observability stack that keep client platforms at 99.95% uptime.",
        "content": "Downtime is a marketing problem as much as an engineering one. Every minute a storefront is unreachable, paid media spend evaporates and search rankings wobble.\n\nOur managed support practice runs a follow-the-sun roster across three time zones, with a 15-minute response SLA on critical incidents and a blameless postmortem culture.\n\nThis piece walks through the observability stack, the escalation ladder, and the runbook discipline behind our 99.95% uptime track record.",
        "image_url": "https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "title": "Why We Treat SEO as an Engineering Discipline",
        "category": "Growth",
        "excerpt": "Core Web Vitals, crawl budgets and structured data are engineering problems. Here is how our content strategy team works inside the sprint.",
        "content": "Search performance is won or lost in the codebase. Render blocking scripts, unindexed routes and slow time-to-first-byte undo the best editorial calendar.\n\nAt OnusMinds, content strategists sit inside the engineering sprint. Technical audits ship as pull requests, and every release is measured against organic visibility.\n\nThe result: compounding organic growth that paid media cannot buy and competitors cannot easily copy.",
        "image_url": "https://images.pexels.com/photos/8117436/pexels-photo-8117436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
]


async def seed_news():
    if await db.news.count_documents({}) > 0:
        return
    for i, item in enumerate(SEED_NEWS):
        doc = dict(item)
        doc.update({
            "id": str(uuid.uuid4()),
            "slug": slugify(item["title"]),
            "published": True,
            "created_at": (datetime.now(timezone.utc) - timedelta(days=(len(SEED_NEWS) - i) * 7)).isoformat(),
        })
        await db.news.insert_one(doc)


async def seed_content():
    if not await db.site_content.find_one({"key": "main"}):
        await db.site_content.insert_one({"key": "main", "data": DEFAULT_CONTENT})


async def seed_services():
    if await db.services.count_documents({}) > 0:
        return
    for i, s in enumerate(DEFAULT_SERVICES):
        doc = dict(s)
        doc.update({"id": str(uuid.uuid4()), "visible": True, "order": i + 1,
                    "created_at": datetime.now(timezone.utc).isoformat()})
        await db.services.insert_one(doc)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.news.create_index("slug", unique=True)
    await seed_admin()
    await seed_news()
    await seed_content()
    await seed_services()
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
