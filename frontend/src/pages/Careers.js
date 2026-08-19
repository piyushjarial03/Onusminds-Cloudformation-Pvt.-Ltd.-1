import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Motion";
import { CONTACT } from "../data/site";

const VALUES = [
  { n: "01", t: "Craft over volume", b: "We take fewer engagements and do them exceptionally. The same standard applies to how we work with each other." },
  { n: "02", t: "Two disciplines, one team", b: "Engineers sit in marketing reviews. Marketers sit in architecture reviews. Everyone understands the whole board." },
  { n: "03", t: "Own the outcome", b: "No hiding behind scope documents. If the client's business didn't move, we haven't finished." },
];

const ROLES = [
  { title: "Senior Cloud Engineer", team: "IT Services", location: "Bengaluru / Remote", type: "Full-time" },
  { title: "Performance Marketing Lead", team: "Digital Marketing", location: "Dubai / Remote", type: "Full-time" },
  { title: "Technical Content Strategist", team: "Digital Marketing", location: "Remote", type: "Contract" },
];

export default function Careers() {
  return (
    <main data-testid="careers-page">
      <PageHero
        kicker="Resources — Careers"
        titleLines={["Do the best", "work of", "your career"]}
        description="We're a small team with an unreasonable standard of craft. If that sounds like home, read on."
      />

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-14 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.08}>
              <div className="border border-white/10 bg-white/[0.02] p-10 h-full">
                <span className="font-display text-5xl font-black text-outline-soft">{v.n}</span>
                <h3 className="mt-6 font-display text-xl font-bold uppercase tracking-tight">{v.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{v.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-28">
        <Reveal>
          <h2 className="mb-10 font-display text-2xl md:text-4xl font-black uppercase tracking-tighter">Open roles</h2>
        </Reveal>
        <ul className="border-t border-white/10">
          {ROLES.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <li data-testid={`role-${i}`} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 py-8 hover:bg-white/[0.02] transition-colors px-2">
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight group-hover:text-[#0055FF] transition-colors">{r.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{r.team} · {r.location} · {r.type}</p>
                </div>
                <a
                  data-testid={`role-apply-${i}`}
                  href={`mailto:${CONTACT.email}?subject=Application: ${encodeURIComponent(r.title)}`}
                  className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#0055FF] hover:border-[#0055FF] transition-colors duration-300 self-start md:self-auto"
                >
                  Apply <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2}>
          <p className="mt-10 text-sm text-white/50">
            Don't see your role? We always make room for exceptional people — write to{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-[#0055FF] hover:underline">{CONTACT.email}</a>.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
