import { Mail, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Motion";
import { RequestWorkForm } from "../components/RequestWorkForm";
import { useSite, whatsappLink } from "../context/SiteContext";

export default function Contact() {
  const { content } = useSite();
  const phoneHref = `tel:${(content.contact_phone || "").replace(/[^+\d]/g, "")}`;
  return (
    <main data-testid="contact-page">
      <PageHero
        kicker="Resources — Contact Us"
        titleLines={["Let's build", "something", "that lasts"]}
        description="Tell us about the problem. A senior engineer or strategist replies within one business day."
      />

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="mb-8 font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">Request work</h2>
            <RequestWorkForm />
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="border border-white/10 bg-white/[0.02] p-8 sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Reach us directly</p>
              <div className="mt-6 space-y-4 text-sm">
                <a data-testid="contact-email-link" href={`mailto:${content.contact_email}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-[#0055FF]" /> {content.contact_email}
                </a>
                <a data-testid="contact-phone-link" href={phoneHref} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-[#0055FF]" /> {content.contact_phone}
                </a>
                <a data-testid="contact-whatsapp-link" href={whatsappLink(content.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <MessageCircle className="h-4 w-4 text-[#0055FF]" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
