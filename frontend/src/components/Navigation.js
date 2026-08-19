import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { NAV } from "../data/site";
import { useSite } from "../context/SiteContext";
import { fileUrl } from "../lib/api";

const Dropdown = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        data-testid={`nav-dropdown-${item.label.toLowerCase()}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-wide text-white/70 hover:text-white transition-colors duration-300 uppercase"
      >
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute left-0 top-full pt-3 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="min-w-[260px] border border-white/10 bg-zinc-950/95 backdrop-blur-2xl shadow-2xl shadow-black/60 py-2">
          {item.children.map((child) => (
            <li key={child.to}>
              <Link
                data-testid={`nav-link-${child.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                to={child.to}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between px-5 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200"
              >
                <span>{child.label}</span>
                {child.meta ? (
                  <span className="text-[10px] uppercase tracking-widest text-[#0055FF]">{child.meta === "IT Services" ? "IT" : "Growth"}</span>
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { services, content } = useSite();
  const navItems = NAV.map((item) =>
    item.label === "Services"
      ? { ...item, children: services.map((s) => ({ label: s.title, to: `/services/${s.slug}`, meta: s.discipline })) }
      : item
  );

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-500 ${
        scrolled || mobileOpen ? "bg-black/70 backdrop-blur-2xl border-white/10" : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10 h-[72px]">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 font-display text-xl md:text-2xl font-black tracking-tighter uppercase">
          {content.logo_url ? (
            <img src={fileUrl(content.logo_url)} alt="OnusMinds" className="h-9 w-9 object-contain" />
          ) : null}
          Onus<span className="text-[#0055FF]">Minds</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            {navItems.map((item) =>
              item.children ? (
                <Dropdown key={item.label} item={item} />
              ) : (
                <li key={item.label}>
                  <Link
                    data-testid="nav-link-home"
                    to={item.to}
                    className="px-4 py-2 text-sm font-medium tracking-wide text-white/70 hover:text-white transition-colors duration-300 uppercase"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <button
            data-testid="nav-cta-button"
            onClick={() => navigate("/contact")}
            className="group hidden sm:inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-[#0055FF] hover:border-[#0055FF] transition-colors duration-300"
          >
            {content.nav_cta}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 text-white/80 hover:text-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-2xl transition-[max-height] duration-500 ${
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
        }`}
      >
        <ul className="px-6 py-4 space-y-1">
          {navItems.map((item) =>
            item.children ? (
              <li key={item.label}>
                <button
                  data-testid={`nav-mobile-dropdown-${item.label.toLowerCase()}`}
                  onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                  className="flex w-full items-center justify-between py-3 font-display text-lg font-bold uppercase tracking-tight"
                >
                  {item.label}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded === item.label ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-[max-height] duration-400 ${expanded === item.label ? "max-h-[600px]" : "max-h-0"}`}>
                  <ul className="pb-3 pl-4 space-y-1 border-l border-white/10 ml-1">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to} className="block py-2 text-sm text-white/60 hover:text-white transition-colors">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <Link to={item.to} className="block py-3 font-display text-lg font-bold uppercase tracking-tight">
                  {item.label}
                </Link>
              </li>
            )
          )}
          <li className="pt-4">
            <button
              data-testid="nav-mobile-cta"
              onClick={() => navigate("/contact")}
              className="w-full bg-[#0055FF] px-5 py-3 text-xs font-semibold uppercase tracking-widest"
            >
              {content.nav_cta}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};
