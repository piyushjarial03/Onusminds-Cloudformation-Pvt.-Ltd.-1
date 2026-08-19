import { useParams, Navigate, useNavigate } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Motion";
import { getService, SERVICES } from "../data/services";

const IMG = "https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = getService(slug);
  if (!service) return <Navigate to="/" replace />;

  const others = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <main data-testid={`service-page-${slug}`}>
      <PageHero kicker={service.discipline} titleLines={[service.title]} description={service.tagline} image={IMG} />

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-7">
          {service.description.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p className="mb-6 text-base md:text-lg leading-relaxed text-white/70">{p}</p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <h2 className="mt-14 mb-8 font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">What's included</h2>
          </Reveal>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.deliverables.map((d, i) => (
              <Reveal key={d} delay={i * 0.05}>
                <li className="flex items-start gap-3 border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-white/70 hover:border-[#0055FF]/50 transition-colors duration-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0055FF]" />
                  {d}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10 sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Outcomes</p>
              <ul className="mt-6 space-y-5">
                {service.outcomes.map((o) => (
                  <li key={o} className="border-l-2 border-[#0055FF] pl-4 font-display text-lg md:text-xl font-bold tracking-tight">
                    {o}
                  </li>
                ))}
              </ul>
              <button
                data-testid="service-cta-button"
                onClick={() => navigate("/contact")}
                className="group mt-10 inline-flex w-full items-center justify-center gap-3 bg-[#0055FF] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Request this service
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
          </Reveal>
        </aside>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-14 md:py-20">
          <Reveal>
            <p className="mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Explore more</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08}>
                <button
                  data-testid={`service-related-${s.slug}`}
                  onClick={() => navigate(`/services/${s.slug}`)}
                  className="group w-full border border-white/10 bg-white/[0.02] p-8 text-left hover:border-[#0055FF]/60 transition-colors duration-300"
                >
                  <p className="text-[10px] uppercase tracking-widest text-[#0055FF]">{s.discipline}</p>
                  <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{s.short}</p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
