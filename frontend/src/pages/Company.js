import { useParams, Navigate } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Motion";
import { MapPin } from "lucide-react";

const ABOUT_IMG = "https://images.pexels.com/photos/8117436/pexels-photo-8117436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const About = () => (
  <>
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 space-y-6">
        <Reveal>
          <p className="text-base md:text-lg leading-relaxed text-white/70">
            OnusMinds was founded on a simple observation: the companies that win online are the ones where engineering and marketing stop being separate departments. We built a firm where they were never separate to begin with.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base md:text-lg leading-relaxed text-white/70">
            Today we are a team of cloud engineers, support specialists, strategists and media buyers who share one cadence, one KPI sheet and one standard of craft. Our clients range from funded startups to established enterprises — what they share is the ambition to treat technology and growth as one investment.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            {[["50+", "Engagements delivered"], ["99.95%", "Uptime track record"], ["12", "Industries served"]].map(([n, l]) => (
              <div key={l} className="border border-white/10 bg-white/[0.02] p-6">
                <p className="font-display text-3xl md:text-4xl font-black text-[#0055FF]">{n}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-white/50">{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="lg:col-span-5">
        <Reveal delay={0.2}>
          <div className="overflow-hidden border border-white/10">
            <img src={ABOUT_IMG} alt="The OnusMinds team at work" className="aspect-[4/5] w-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

const VisionMission = () => (
  <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-28 space-y-6">
    {[
      {
        k: "Our Vision",
        t: "A world where no great idea fails on bad infrastructure — and no great platform stays undiscovered.",
        b: "We envision a market where the gap between 'building it' and 'growing it' no longer exists. Where the same team that keeps your systems alive at 3 AM also plans the campaign that floods them at 9 AM.",
      },
      {
        k: "Our Mission",
        t: "To unite world-class IT services and performance marketing into single, accountable engagements.",
        b: "Every engagement we sign carries both disciplines: engineers who understand funnels, marketers who respect uptime. We measure ourselves on one question — did the client's business move?",
      },
    ].map((b, i) => (
      <Reveal key={b.k} delay={i * 0.1}>
        <div className="relative overflow-hidden border border-white/10 bg-white/[0.02] p-10 md:p-16">
          <span className="pointer-events-none absolute -right-6 -top-10 font-display text-[10rem] font-black leading-none text-outline-soft select-none">
            0{i + 1}
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">{b.k}</p>
          <h2 className="relative mt-6 max-w-3xl font-display text-2xl md:text-4xl font-bold tracking-tight leading-snug">{b.t}</h2>
          <p className="relative mt-6 max-w-2xl text-base leading-relaxed text-white/60">{b.b}</p>
        </div>
      </Reveal>
    ))}
  </section>
);

const MILESTONES = [
  { year: "2019", title: "Founded in Bengaluru", text: "Two engineers, one laptop, and a conviction that IT services could be done with craft." },
  { year: "2020", title: "First managed services retainer", text: "Signed our first 24/7 support engagement — the client is still with us today." },
  { year: "2021", title: "Marketing practice launches", text: "Added SEO and paid media after clients asked us to 'also fix the growth side'." },
  { year: "2023", title: "Unified engagement model", text: "Formalised the two-discipline model: one SOW, one team, shared KPIs." },
  { year: "2024", title: "50th engagement delivered", text: "Crossed fifty engagements across twelve industries with a 92% retention rate." },
  { year: "2026", title: "OnusMinds today", text: "A distributed team across three time zones, still obsessed with the same two disciplines." },
];

const Timeline = () => (
  <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-28">
    <div className="relative border-l border-white/15 ml-2 md:ml-6">
      {MILESTONES.map((m, i) => (
        <Reveal key={m.year} delay={i * 0.05}>
          <div data-testid={`milestone-${m.year}`} className="relative pb-14 pl-10 md:pl-16">
            <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#0055FF] bg-[#050505]" />
            <p className="font-display text-4xl md:text-6xl font-black tracking-tighter text-outline">{m.year}</p>
            <h3 className="mt-2 font-display text-xl md:text-2xl font-bold uppercase tracking-tight">{m.title}</h3>
            <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-white/60">{m.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const LOCATIONS = [
  { city: "Bengaluru", country: "India", role: "Headquarters & Engineering", zone: "IST (UTC+5:30)" },
  { city: "Dubai", country: "UAE", role: "Client Services — MEA", zone: "GST (UTC+4)" },
  { city: "London", country: "United Kingdom", role: "Growth Strategy — Europe", zone: "GMT (UTC+0)" },
];

const Presence = () => (
  <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-28">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {LOCATIONS.map((l, i) => (
        <Reveal key={l.city} delay={i * 0.08}>
          <div data-testid={`presence-${l.city.toLowerCase()}`} className="group border border-white/10 bg-white/[0.02] p-10 hover:border-[#0055FF]/60 transition-colors duration-300">
            <MapPin className="h-6 w-6 text-[#0055FF]" />
            <h3 className="mt-6 font-display text-2xl md:text-3xl font-black uppercase tracking-tighter">{l.city}</h3>
            <p className="text-sm text-white/50">{l.country}</p>
            <p className="mt-6 text-sm text-white/70">{l.role}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{l.zone}</p>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={0.2}>
      <p className="mt-14 max-w-2xl text-base leading-relaxed text-white/60">
        Our follow-the-sun model means someone is always awake when your systems — or your campaigns — need attention. Wherever you are, an OnusMinds engineer or strategist is within working hours.
      </p>
    </Reveal>
  </section>
);

const PAGES = {
  about: {
    kicker: "Company — About Us",
    title: ["The firm where", "two crafts", "became one"],
    description: "OnusMinds exists because great technology deserves great marketing — and great marketing deserves technology that can keep up.",
    Body: About,
  },
  "vision-mission": {
    kicker: "Company — Vision & Mission",
    title: ["Why we", "exist"],
    description: "The beliefs that shape every engagement we sign.",
    Body: VisionMission,
  },
};

export default function CompanyPage() {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page) return <Navigate to="/" replace />;
  return (
    <main data-testid={`company-page-${slug}`}>
      <PageHero kicker={page.kicker} titleLines={page.title} description={page.description} />
      <page.Body />
    </main>
  );
}
