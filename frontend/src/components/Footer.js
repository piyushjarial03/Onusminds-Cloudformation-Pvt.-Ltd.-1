import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, MessageCircle } from "lucide-react";
import { NAV, CONTACT, SOCIALS } from "../data/site";
import { Reveal } from "./Motion";

export const Footer = () => {
  const navigate = useNavigate();
  const company = NAV.find((n) => n.label === "Company");
  const services = NAV.find((n) => n.label === "Services");
  const resources = NAV.find((n) => n.label === "Resources");

  return (
    <footer data-testid="site-footer" className="relative border-t border-white/10 bg-[#050505] overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-24 md:pt-32 pb-10">
        <Reveal>
          <button
            data-testid="footer-cta"
            onClick={() => navigate("/contact")}
            className="group block text-left w-full"
          >
            <span className="font-display block font-black uppercase tracking-tighter leading-[0.9] text-[13vw] md:text-[9vw] text-outline hover:text-white transition-colors duration-700">
              Start a<br />conversation
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-white/50 group-hover:text-[#0055FF] transition-colors duration-300">
              Tell us what you're building <ArrowUpRight className="h-4 w-4" />
            </span>
          </button>
        </Reveal>

        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          <div className="col-span-2 md:col-span-4">
            <p className="font-display text-2xl font-black uppercase tracking-tighter">
              Onus<span className="text-[#0055FF]">Minds</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Two disciplines. One engagement. Infrastructure that holds, marketing that moves — under one roof.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a data-testid="footer-email" href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-[#0055FF]" /> {CONTACT.email}
              </a>
              <a data-testid="footer-phone" href={CONTACT.phoneHref} className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-[#0055FF]" /> {CONTACT.phone}
              </a>
              <a data-testid="footer-whatsapp" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors">
                <MessageCircle className="h-4 w-4 text-[#0055FF]" /> WhatsApp us
              </a>
            </div>
          </div>

          {[
            { title: "Company", items: company.children },
            { title: "Services", items: services.children },
            { title: "Resources", items: resources.children },
          ].map((col) => (
            <div key={col.title} className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Follow</p>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
                    {s.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40">
          <p data-testid="footer-copyright">© {new Date().getFullYear()} OnusMinds. All rights reserved.</p>
          <p>Two disciplines. One engagement.</p>
        </div>
      </div>
    </footer>
  );
};
