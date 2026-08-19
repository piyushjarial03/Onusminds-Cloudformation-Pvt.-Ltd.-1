import { Reveal, MaskedLines } from "./Motion";

export const PageHero = ({ kicker, titleLines, description, image }) => (
  <section className="relative overflow-hidden pt-40 pb-20 md:pt-52 md:pb-28">
    {image && (
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/80 to-[#050505]" />
      </div>
    )}
    <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
      {kicker && (
        <Reveal y={20}>
          <p data-testid="page-hero-kicker" className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">
            <span className="h-px w-10 bg-[#0055FF]" /> {kicker}
          </p>
        </Reveal>
      )}
      <MaskedLines
        lines={titleLines}
        className="font-display font-black uppercase tracking-tighter leading-[0.95] text-4xl sm:text-5xl md:text-7xl"
        lineClassName="pb-1"
      />
      {description && (
        <Reveal delay={0.4}>
          <p data-testid="page-hero-description" className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-white/60">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  </section>
);
