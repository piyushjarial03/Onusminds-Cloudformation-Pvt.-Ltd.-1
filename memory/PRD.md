# OnusMinds Corporate Website v2 — PRD

## Original Problem Statement
Expand the OnusMinds one-page site into a full multi-page corporate site using bhagwatiproductsltd.com's information architecture (sticky nav with dropdowns, full-width hero, service grid, multi-column footer), keeping the OnusMinds dark brand identity, hero copy style, services marquee, "Two disciplines. One engagement." approach, Core Capabilities, Request Work form, admin panel, and email/phone/WhatsApp contacts. Old onusminds project untouched. User directive: Awwwards-level craft — kinetic masked hero reveal, numbered manifesto chapters, slow editorial marquee, framer-motion + lenis, parallax hero.

## User Personas
- Prospective client (CTO/founder): browses services, reads approach, submits Request Work
- Prospective client (marketing lead): browses growth services, uses quick Contact form
- Job seeker: Careers page, applies via email
- Reader/press: News & Media articles
- OnusMinds admin: reviews enquiries, publishes news with images

## Architecture
- Frontend: React (JSX), Tailwind, framer-motion (masked reveals, scroll parallax), Lenis smooth scroll, react-router. Dark theme (#050505, accent #0055FF, Outfit + Manrope).
- Backend: FastAPI. Routes all under /api: auth (JWT cookie, bcrypt, brute-force lockout), leads, news CRUD, admin image upload (Emergent object storage), public file serving.
- DB: MongoDB — users, leads, news, files, login_attempts.
- Integrations: Emergent managed Resend (lead notification emails, guardrail-gated), Emergent object storage (news images).

## Implemented (2026-08-19)
- Home: kinetic masked hero + parallax, services marquee, numbered approach chapters, capabilities bento grid, services index list, Request Work form
- Nav: sticky glass header, hover dropdowns (Company/Services/Resources), mobile accordion menu, "Start a conversation" CTA
- Company pages: About, Vision & Mission, Timeline & Milestones, Our Presence (placeholder copy, swappable)
- 6 service detail pages (data-driven): Infrastructure & Cloud, Managed IT Support, SEO & Content Strategy, Paid Media & Performance, IT Services & Consulting, Digital Marketing
- Resources: Careers (values + open roles), News & Media (list + article detail), Contact (Request Work + quick contact form + email/phone/WhatsApp)
- Admin (/admin): JWT login, Enquiries tab (read/unread/delete), News CMS (create/edit/publish/delete + image upload)
- Email notifications on every lead to OWNER_NOTIFY_EMAIL (verified: 202 Accepted)
- Footer: 4-column links + contacts + socials + giant outline CTA

## Verified
- curl: health, lead create (+ email 202), admin login/me, leads list/delete, news create/delete, image upload + public serve (200)
- UI: hero/marquee/capabilities, dropdown nav → service page, news list → article, contact form submit toast, admin login → both tabs

## Placeholders to swap (user action)
- Company/service/careers copy is polished placeholder text

## Updates
- 2026-08-19: Real contacts applied — phone/WhatsApp +91 78077 22158 (wa.me/917807722158), email info@onusminds.com (site + lead notification inbox), LinkedIn icon button in footer linking to linkedin.com/company/onusminds-cloudformation-pvt-ltd, WhatsApp icon button with number
- 2026-08-19: Floating WhatsApp chat button on all pages (bottom-right, expands "Chat with us" on hover, opens wa.me/917807722158); toasts moved to bottom-left
- 2026-08-19: Mobile decongestion pass — reduced section padding on phones (py-16 vs py-28+), smaller hero top offset, 6rem watermark numerals, stacked About stats, compact WhatsApp bubble, hero headline 9vw and footer CTA 11vw so long words never clip; verified zero horizontal overflow at 390px on Home, About, Service, Contact + mobile nav accordion
- 2026-08-19: Visual edits — hero kicker "IT Services & Consulting / Digital Marketing", hero headline changed to "Cloud Infrastructure. Scale with ease, perform with speed. Built to grow with the cloud." (6 short kinetic lines, lg 6vw), hero CTA opens WhatsApp with pre-filled message, "OnusMinds" interleaved in marquee, Quick Message form removed from Contact, Core Capabilities tightened
- 2026-08-19: Service catalog reduced to the 4 real offerings with user's exact copy: Infrastructure & Cloud, Managed IT Support, SEO & Content Strategy, Paid Media & Performance (removed IT Services & Consulting and Digital Marketing); nav, footer, marquee, services index, request form select and capability grid all driven from this list
- 2026-08-19: Request Work form redesigned to reference layout — labeled fields (Name, Company name, Email, Phone number, Service required, Tell us about your requirement, Preferred contact method: Either/Email/Phone/WhatsApp), bordered panel, "Submit request" button, security note; budget field removed; leads + email template + admin list now carry phone & contact_method
- KNOWN ISSUE: email notifications to info@onusminds.com rejected by mail service ("Undeliverable recipient" — mailbox unverifiable). Leads still save to DB/admin. Needs a working inbox address.
- 2026-08-19: Full admin panel v2 (dark theme, sidebar): Dashboard (stat cards + recent requests), Site editor (logo upload, all hero/overview/capabilities/request/contact/nav/footer text, services list editor with add/remove/visible + Publish), Requests (inbox + detail modal + New/In Progress/Completed statuses), Team access (list/create/remove admin accounts), News & Media CMS. Site now reads content + services from DB via SiteContext (public /api/content + /api/services), so publishing in the editor updates the live site instantly
- 2026-08-19: Admin login changed to piyushjarial0307@gmail.com (owner role); old admin@onusminds.com removed; backend accepts owner+admin roles; form service options now static list: IT Services & Consulting, Digital Marketing, Website Development, Branding, Other

## Backlog
- P0: Swap real copy/contacts; confirm notification inbox
- P1: Case studies / client logos section; news categories + search
- P2: Leads analytics dashboard; blog tags; SEO meta per page; careers application form
