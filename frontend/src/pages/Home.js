import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, Check, Mail, MessageCircle } from "lucide-react";
import { Reveal, MaskedLines, FadeIn } from "../components/Motion";
import { NetworkCanvas } from "../components/NetworkCanvas";
import { useSite, whatsappLink } from "../context/SiteContext";

const STATS = [
  { value: "12+", label: "Projects delivered" },
  { value: "6", label: "Active clients" },
  { value: "24h", label: "Support coverage" },
  { value: "2", label: "Disciplines, one team" },
];

const OUTCOMES = [
  { num: "01", title: "Faster releases", text: "Infrastructure and pipelines that let your team ship weekly, not monthly." },
  { num: "02", title: "Cleaner numbers", text: "Marketing reported against cost-per-lead and revenue, not vanity metrics." },
  { num: "03", title: "One accountable team", text: "No hand-offs between an IT vendor and a marketing agency. One call, one owner." },
  { num: "04", title: "Systems that scale", text: "Platforms that hold under campaign traffic instead of falling over on launch day." },
];

const Hero = () => {
  const ref = useRef(null);
  const { content } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroLines = content.hero_title.split("\n").filter(Boolean);

  return (
    <section ref={ref} data-testid="hero-section" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0A1633]">
      <motion.div style={{ y: yBg }} className="absolute inset-0 scale-110">
        <NetworkCanvas className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1633]/60 via-[#0A1633]/70 to-[#0A1633]" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative mx-auto w-full max-w-5xl px-6 text-center pt-32 pb-20">
        <FadeIn delay={0.1}>
          <p data-testid="hero-eyebrow" className="mb-8 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#7DA2FF]">
            {content.hero_eyebrow}
          </p>
        </FadeIn>

        <MaskedLines
          data-testid="hero-headline"
          lines={heroLines}
          className="font-display font-black tracking-tight leading-[1.02] text-4xl sm:text-6xl lg:text-7xl text-white"
          lineClassName="pb-1"
          delay={0.25}
        />

        <FadeIn delay={0.9}>
          <p data-testid="hero-subcopy" className="mx-auto mt-8 max-w-xl text-base md:text-lg leading-relaxed text-white/60">
            {content.hero_text}
          </p>
        </FadeIn>
        <FadeIn delay={1.05}>
          <button
            data-testid="hero-cta-button"
            onClick={() => window.open(whatsappLink(content.whatsapp_number), "_blank", "noopener,noreferrer")}
            className="group mt-10 inline-flex items-center gap-3 rounded-md bg-[#2563EB] px-9 py-4 text-sm font-semibold text-white hover:bg-[#1d4fd7] transition-colors duration-300"
          >
            Start a conversation
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </FadeIn>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30">
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
};

const StatsBar = () => (
  <section data-testid="stats-bar" className="bg-[#0D1C40] border-y border-white/5">
    <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 px-6">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08}>
          <div data-testid={`stat-${i}`} className="px-4 py-10 text-center md:border-l border-white/5 first:border-l-0">
            <p className="font-display text-3xl md:text-4xl font-black text-white">{s.value}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-white/40">{s.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const WhoWeAre = () => {
  const { content } = useSite();
  return (
    <section id="approach" data-testid="who-we-are" className="bg-[#F5F7FA] text-[#0A1633]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-12 px-6 py-20 md:py-28">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Who we are</p>
          <h2 data-testid="overview-title" className="font-display text-3xl md:text-5xl font-black tracking-tight whitespace-pre-line">
            {content.overview_title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#0A1633]/60">
            OnusMinds is a compact team of engineers and marketers working as one. We take ownership of outcomes — uptime, leads, revenue — not just deliverables.
          </p>
        </Reveal>
        <div className="space-y-6 md:pt-16">
          {[
            "Senior engineers and strategists on every account — never handed to juniors.",
            "Fixed-scope or ongoing engagements, structured around what you actually need.",
            "Clear weekly reporting in plain language, not dashboards you have to decode.",
          ].map((line, i) => (
            <Reveal key={line} delay={i * 0.08}>
              <p className="flex items-start gap-3 text-base text-[#0A1633]/80">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#2563EB]" />
                {line}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <Link to="/company/about" data-testid="more-about-link" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
              More about us
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const CoreCapabilities = () => {
  const { content, services } = useSite();
  const navigate = useNavigate();
  const firstIT = services.find((s) => s.discipline === "IT Services");
  const firstDM = services.find((s) => s.discipline !== "IT Services");

  return (
    <section data-testid="capabilities-section" className="bg-[#F5F7FA] text-[#0A1633] border-t border-[#0A1633]/10">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Core capabilities</p>
            <h2 data-testid="capabilities-title" className="font-display text-3xl md:text-5xl font-black tracking-tight whitespace-pre-line">
              {content.capabilities_title}
            </h2>
          </div>
          <div className="flex gap-3">
            {firstIT && (
              <button data-testid="view-it-page" onClick={() => navigate(`/services/${firstIT.slug}`)} className="border border-[#0A1633]/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-[#0A1633] hover:text-white transition-colors duration-300">
                View IT page
              </button>
            )}
            {firstDM && (
              <button data-testid="view-marketing-page" onClick={() => navigate(`/services/${firstDM.slug}`)} className="border border-[#0A1633]/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-[#0A1633] hover:text-white transition-colors duration-300">
                View marketing page
              </button>
            )}
          </div>
        </Reveal>

        <ul className="mt-14 border-t border-[#0A1633]/10">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <li>
                <button
                  data-testid={`capability-row-${s.slug}`}
                  onClick={() => navigate(`/services/${s.slug}`)}
                  className="group grid w-full grid-cols-[1fr_auto] items-start gap-5 border-b border-[#0A1633]/10 py-8 text-left"
                >
                  <span>
                    <span className="block font-display text-xl md:text-2xl font-bold tracking-tight group-hover:text-[#2563EB] transition-colors duration-300">
                      {s.title}
                    </span>
                    <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-[#0A1633]/60">{s.short}</span>
                  </span>
                  <ArrowUpRight className="mt-1 h-5 w-5 text-[#0A1633]/30 group-hover:text-[#2563EB] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </button>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

const Outcomes = () => (
  <section data-testid="outcomes-section" className="bg-[#F5F7FA] text-[#0A1633] border-t border-[#0A1633]/10">
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <Reveal>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Outcomes</p>
        <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight">What clients notice first</h2>
      </Reveal>
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
        {OUTCOMES.map((o, i) => (
          <Reveal key={o.num} delay={i * 0.08}>
            <div data-testid={`outcome-${o.num}`} className="flex gap-6">
              <span className="font-mono text-sm font-semibold text-[#2563EB]">{o.num}</span>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#0A1633]/60">{o.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const ClosingCta = () => {
  const { content } = useSite();
  const navigate = useNavigate();
  return (
    <section data-testid="closing-cta" className="bg-[#0A1633] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 text-center">
        <Reveal>
          <h2 data-testid="request-title" className="font-display text-3xl md:text-5xl font-black tracking-tight whitespace-pre-line">
            {content.request_title}
          </h2>
          <p data-testid="request-text" className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60">
            {content.request_text} We'll reply within 1 business day. No sales pitch.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              data-testid="cta-request-work"
              onClick={() => navigate("/contact")}
              className="group inline-flex items-center gap-3 rounded-md bg-[#2563EB] px-9 py-4 text-sm font-semibold hover:bg-[#1d4fd7] transition-colors duration-300"
            >
              Request work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <a
              data-testid="cta-whatsapp"
              href={whatsappLink(content.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-4 text-sm font-semibold hover:border-[#25D366] hover:text-[#25D366] transition-colors duration-300"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              data-testid="cta-email"
              href={`mailto:${content.contact_email}`}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-4 text-sm font-semibold hover:border-white/60 transition-colors duration-300"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <WhoWeAre />
      <CoreCapabilities />
      <Outcomes />
      <ClosingCta />
    </main>
  );
}
