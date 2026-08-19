import { motion } from "framer-motion";

const EASE = [0.19, 1, 0.22, 1];

export const Reveal = ({ children, delay = 0, y = 48, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MaskedLines = ({ lines, className = "", lineClassName = "", delay = 0, as = "h1", ...rest }) => {
  const Tag = motion[as] || motion.h1;
  return (
    <div className={className} {...rest}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <Tag
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.15, delay: delay + i * 0.13, ease: EASE }}
            className={lineClassName}
          >
            {line}
          </Tag>
        </div>
      ))}
    </div>
  );
};

export const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Marquee = ({ items }) => (
  <div data-testid="services-marquee" className="overflow-hidden border-y border-white/10 py-10 md:py-14 select-none">
    <div className="marquee-track">
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
          {items.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="mx-6 md:mx-10 font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-outline whitespace-nowrap">
                {item}
              </span>
              <span className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#0055FF]" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
