import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, Linkedin } from "lucide-react";
import { NAV, CONTACT, SOCIALS } from "../data/site";
import { Reveal } from "./Motion";
import { useSite, whatsappLink } from "../context/SiteContext";

const WhatsAppIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const Footer = () => {
  const navigate = useNavigate();
  const { content, services: siteServices } = useSite();
  const C = {
    email: content.contact_email,
    phone: content.contact_phone,
    phoneHref: `tel:${(content.contact_phone || "").replace(/[^+\d]/g, "")}`,
    whatsapp: whatsappLink(content.whatsapp_number),
    whatsappNumber: content.whatsapp_number,
    linkedin: CONTACT["linkedin"],
  };
  const company = NAV.find((n) => n.label === "Company");
  const servicesCol = { children: siteServices.map((s) => ({ label: s.title, to: `/services/${s.slug}` })) };
  const resources = NAV.find((n) => n.label === "Resources");

  return (
    <footer data-testid="site-footer" className="relative border-t border-white/10 bg-[#050505] overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-16 md:pt-32 pb-10">
        <Reveal>
          <button
            data-testid="footer-cta"
            onClick={() => navigate("/contact")}
            className="group block text-left w-full"
          >
            <span className="font-display block font-black uppercase tracking-tighter leading-[0.9] text-[11vw] md:text-[9vw] text-outline hover:text-white transition-colors duration-700">
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
            <div className="mt-6 flex items-center gap-3">
              <a
                data-testid="footer-linkedin-icon"
                href={C.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="OnusMinds on LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-[#0055FF] hover:bg-[#0055FF]/10 transition-colors duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                data-testid="footer-whatsapp-icon"
                href={C.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp us on ${C.whatsappNumber}`}
                className="group inline-flex h-11 items-center gap-2.5 border border-white/15 px-4 text-white/60 hover:text-white hover:border-[#25D366] hover:bg-[#25D366]/10 transition-colors duration-300"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span className="text-xs font-semibold tracking-wider">{C.whatsappNumber}</span>
              </a>
            </div>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a data-testid="footer-email" href={`mailto:${C.email}`} className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-[#0055FF]" /> {C.email}
              </a>
              <a data-testid="footer-phone" href={C.phoneHref} className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-[#0055FF]" /> {C.phone}
              </a>
              <a data-testid="footer-whatsapp" href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors">
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp: {C.whatsappNumber}
              </a>
            </div>
          </div>

          {[
            { title: "Company", items: company.children },
            { title: "Services", items: servicesCol.children },
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
          <p data-testid="footer-copyright">{content.footer_credit}</p>
          <div className="flex items-center gap-6">
            <p>Two disciplines. One engagement.</p>
            <Link data-testid="footer-admin-link" to="/admin" className="hover:text-white transition-colors duration-200 uppercase tracking-widest">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
