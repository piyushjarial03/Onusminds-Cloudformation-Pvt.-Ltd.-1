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

## Backlog
- P0: Swap real copy/contacts; confirm notification inbox
- P1: Case studies / client logos section; news categories + search
- P2: Leads analytics dashboard; blog tags; SEO meta per page; careers application form
