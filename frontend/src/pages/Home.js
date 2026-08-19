import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown, Server, ShieldCheck, TrendingUp, Megaphone, Cloud, LineChart } from "lucide-react";
import { Reveal, MaskedLines, FadeIn, Marquee } from "../components/Motion";
import { RequestWorkForm } from "../components/RequestWorkForm";
import { SERVICES } from "../data/services";

const HERO_IMG = "https://images.pexels.com/photos/30547584/pexels-photo-30547584.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const CAPABILITIES = [
  { icon: Cloud, title: "Cloud Architecture", text: "Landing zones, Kubernetes and IaC that scale with ambition.", span: "md:col-span-7" },
  { icon: ShieldCheck, title: "24/7 Managed Support", text: "Follow-the-sun monitoring with a 15-minute critical SLA.", span: "md:col-span-5" },
  { icon: TrendingUp, title: "SEO & Content", text: "Organic growth engineered inside the codebase.", span: "md:col-span-5" },
  { icon: Megaphone, title: "Paid Media", text: "Full-funnel acquisition with ruthless attribution.", span: "md:col-span-7" },
  { icon: Server, title: "IT Consulting", text: "Operator-grade counsel for hard technology calls.", span: "md:col-span-6" },
  { icon: LineChart, title: "Demand Engines", text: "Marketing systems that compound, not campaigns that expire.", span: "md:col-span-6" },
];

const Hero = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative flex min-h-[100svh] items-end overflow-hidden grain">
      <motion.div style={{ y: yBg }} className="absolute inset-0 scale-110">
        <img src={HERO_IMG} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/40" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative mx-auto w-full max-w-[1600px] px-6 md:px-10 pb-14 md:pb-24 pt-32 md:pt-40">
        <FadeIn delay={0.1}>
          <p className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            <span className="h-px w-12 bg-[#0055FF]" /> IT Services × Digital Marketing
          </p>
        </FadeIn>

        <MaskedLines
          data-testid="hero-headline"
          lines={["Infrastructure", "that holds.", "Marketing that", "moves."]}
          className="font-display font-black uppercase tracking-tighter leading-[0.92] text-[9vw] sm:text-[10vw] lg:text-[8.5vw]"
          lineClassName="pb-1"
          delay={0.25}
        />

        <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <FadeIn delay={0.9}>
            <p data-testid="hero-subcopy" className="max-w-md text-base md:text-lg leading-relaxed text-white/60">
              OnusMinds unites two disciplines under one engagement — the engineers who keep your platform alive, and the marketers who make it matter.
            </p>
          </FadeIn>
          <FadeIn delay={1.05} className="flex items-center gap-4">
            <button
              data-testid="hero-cta-button"
              onClick={() => navigate("/contact")}
              className="group inline-flex items-center gap-3 bg-[#0055FF] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <button
              data-testid="hero-services-button"
              onClick={() => document.getElementById("approach")?.scrollIntoView({ behavior: "smooth" })}
              aria-label="Scroll down"
              className="hidden md:inline-flex items-center justify-center h-[52px] w-[52px] border border-white/20 hover:border-[#0055FF] hover:text-[#0055FF] transition-colors duration-300"
            >
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </button>
          </FadeIn>
        </div>
      </motion.div>
    </section>
  );
};

const Approach = () => (
  <section id="approach" data-testid="approach-section" className="relative mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-32">
    <Reveal>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">The Approach</p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter">
        Two disciplines.<br />One engagement.
      </h2>
    </Reveal>

    <div className="mt-14 md:mt-32 space-y-16 md:space-y-36">
      {[
        {
          num: "01",
          title: "IT Services",
          body: "Cloud infrastructure, managed support and consulting — the engineering backbone your growth depends on. Platforms that hold under pressure, teams that respond in minutes, and roadmaps that survive contact with reality.",
        },
        {
          num: "02",
          title: "Digital Marketing",
          body: "SEO, paid media and demand engines — the growth layer your platform deserves. Campaigns measured against revenue, content that compounds, and attribution that tells the truth.",
        },
      ].map((ch, i) => (
        <div key={ch.num} className={`relative grid grid-cols-1 md:grid-cols-12 gap-8 items-start ${i % 2 ? "" : ""}`}>
          <span className="pointer-events-none absolute -top-10 md:-top-24 left-0 font-display text-[6rem] md:text-[16rem] font-black leading-none text-outline-soft select-none">
            {ch.num}
          </span>
          <div className={`relative md:col-span-4 ${i % 2 ? "md:order-2 md:col-start-9" : ""}`}>
            <Reveal>
              <h3 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight pt-10 md:pt-20">{ch.title}</h3>
            </Reveal>
          </div>
          <div className={`relative md:col-span-6 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
            <Reveal delay={0.15}>
              <p className="text-base md:text-lg leading-relaxed text-white/60 md:pt-24">{ch.body}</p>
            </Reveal>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Capabilities = () => (
  <section data-testid="capabilities-section" className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-32 border-t border-white/10">
    <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Core Capabilities</p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter">What we do<br />exceptionally well</h2>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-white/50">
        Six practices, one integrated team. Every capability is delivered in-house — no hand-offs, no subcontractors.
      </p>
    </Reveal>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
      {CAPABILITIES.map((cap, i) => (
        <Reveal key={cap.title} delay={i * 0.06} className={`${cap.span} col-span-1`}>
          <div
            data-testid={`capability-card-${i}`}
            className="group relative h-full bg-white/[0.02] border border-white/10 p-8 md:p-10 hover:border-[#0055FF]/60 hover:bg-white/[0.04] transition-colors duration-500"
          >
            <cap.icon className="h-7 w-7 text-[#0055FF]" />
            <h3 className="mt-8 font-display text-xl md:text-2xl font-bold uppercase tracking-tight">{cap.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{cap.text}</p>
            <ArrowUpRight className="absolute top-8 right-8 h-5 w-5 text-white/20 group-hover:text-[#0055FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const ServicesIndex = () => {
  const navigate = useNavigate();
  return (
    <section data-testid="services-index-section" className="border-t border-white/10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-16 md:pt-40 pb-10">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Services</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter">Pick your discipline</h2>
        </Reveal>
      </div>
      <ul>
        {SERVICES.map((s, i) => (
          <li key={s.slug} className="border-t border-white/10 last:border-b">
            <button
              data-testid={`service-row-${s.slug}`}
              onClick={() => navigate(`/services/${s.slug}`)}
              className="group relative flex w-full items-center justify-between gap-6 px-6 md:px-10 py-8 md:py-10 text-left mx-auto max-w-[1600px] hover:bg-white/[0.03] transition-colors duration-300"
            >
              <div className="flex items-baseline gap-6 md:gap-10">
                <span className="font-display text-sm text-white/30">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl md:text-4xl font-black uppercase tracking-tighter group-hover:text-[#0055FF] transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{s.discipline}</p>
                </div>
              </div>
              <ArrowUpRight className="h-6 w-6 shrink-0 text-white/20 group-hover:text-[#0055FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

const RequestSection = () => (
  <section data-testid="request-section" className="relative mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-32">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
      <div className="lg:col-span-5">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Request Work</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
            Tell us what<br />you're building
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-white/60">
            One form, one business day. A senior engineer or strategist — never a salesperson — replies with a point of view on your problem.
          </p>
        </Reveal>
      </div>
      <div className="lg:col-span-7">
        <Reveal delay={0.15}>
          <RequestWorkForm />
        </Reveal>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee items={SERVICES.map((s) => s.title)} />
      <Approach />
      <Capabilities />
      <ServicesIndex />
      <RequestSection />
    </main>
  );
}
