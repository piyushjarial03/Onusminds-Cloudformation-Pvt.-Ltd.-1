export const SERVICES = [
  {
    slug: "infrastructure-cloud",
    title: "Infrastructure & Cloud",
    discipline: "IT Services",
    tagline: "Platforms engineered to never blink.",
    short: "Architecture reviews, cloud migration, and cost cleanup for teams running on AWS, Azure, or GCP.",
    description: [
      "Your infrastructure is the silent partner in every campaign, launch and transaction. We design cloud environments on AWS, Azure and GCP that scale elastically with demand — and fail gracefully when the unexpected happens.",
      "From greenfield architecture to brownfield migration, our engineers work in audited, documented, infrastructure-as-code engagements. Nothing lives in someone's head; everything lives in version control.",
    ],
    deliverables: [
      "Cloud architecture & landing zones",
      "Migration & modernisation programs",
      "Kubernetes & container orchestration",
      "Infrastructure as Code (Terraform)",
      "CI/CD pipeline engineering",
      "Cost optimisation & FinOps reviews",
    ],
    outcomes: ["99.95% uptime track record", "Up to 40% cloud cost reduction", "Deploys measured in minutes, not days"],
  },
  {
    slug: "managed-it-support",
    title: "Managed IT Support",
    discipline: "IT Services",
    tagline: "A follow-the-sun safety net for your stack.",
    short: "Day-to-day helpdesk, endpoint monitoring, and patching so nothing depends on one in-house person.",
    description: [
      "Downtime doesn't keep office hours, and neither do we. Our managed support practice watches your systems around the clock across three time zones, resolving most incidents before your users ever notice.",
      "Beyond firefighting, we run the unglamorous discipline that prevents fires: patch cadences, backup verification, capacity planning and blameless postmortems that turn every incident into a hardening exercise.",
    ],
    deliverables: [
      "24/7 monitoring & alerting",
      "15-minute critical incident SLA",
      "Service desk & end-user support",
      "Patch & vulnerability management",
      "Backup & disaster recovery drills",
      "Quarterly service reviews",
    ],
    outcomes: ["15-min critical response SLA", "Proactive resolution of 80% of incidents", "Blameless postmortem culture"],
  },
  {
    slug: "seo-content-strategy",
    title: "SEO & Content Strategy",
    discipline: "Digital Marketing",
    tagline: "Organic growth, engineered in the codebase.",
    short: "Technical SEO fixes, keyword mapping, and an editorial calendar built around what your buyers search.",
    description: [
      "Search performance is won in the codebase as much as in the copy. Our strategists sit inside the engineering sprint — Core Web Vitals, crawl budgets and structured data ship as pull requests, not slide decks.",
      "On top of that technical foundation, we build editorial engines: topic clusters mapped to intent, a publishing cadence your team can actually sustain, and measurement tied to pipeline rather than vanity rankings.",
    ],
    deliverables: [
      "Technical SEO audits & fixes",
      "Keyword & intent mapping",
      "Editorial calendar & content ops",
      "Digital PR & link acquisition",
      "Structured data & schema",
      "Organic performance dashboards",
    ],
    outcomes: ["Compounding organic traffic", "Rankings tied to revenue, not vanity", "Content velocity your team can sustain"],
  },
  {
    slug: "paid-media-performance",
    title: "Paid Media & Performance",
    discipline: "Digital Marketing",
    tagline: "Every rupee accountable. Every click measured.",
    short: "Search and social campaigns managed to a cost-per-lead target, not a vanity impression count.",
    description: [
      "Paid media should be an investment with a statement, not an expense with a hope. We plan, launch and optimise campaigns across Google, Meta, LinkedIn and programmatic with creative testing built into the operating rhythm.",
      "Attribution is where most agencies go quiet; it's where we start. Server-side tracking, clean UTM governance and weekly budget reallocation mean your spend flows to what actually converts.",
    ],
    deliverables: [
      "Paid search & shopping campaigns",
      "Paid social & programmatic",
      "Landing page CRO",
      "Server-side tracking & attribution",
      "Creative testing frameworks",
      "Weekly budget reallocation",
    ],
    outcomes: ["ROAS reported weekly, not monthly", "Creative tested in structured sprints", "Full-funnel attribution clarity"],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
