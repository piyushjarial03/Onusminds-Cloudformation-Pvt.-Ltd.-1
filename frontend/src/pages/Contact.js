import { useState } from "react";
import { ArrowUpRight, Mail, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Motion";
import { RequestWorkForm } from "../components/RequestWorkForm";
import { api, formatApiError } from "../lib/api";
import { CONTACT } from "../data/site";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";

const QuickContact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, kind: "contact" });
      toast.success("Message sent. We'll reply within one business day.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form data-testid="contact-form" onSubmit={submit} className="space-y-4">
      <input data-testid="contact-name" required placeholder="Your name *" value={form.name} onChange={set("name")} className={inputCls} />
      <input data-testid="contact-email" required type="email" placeholder="Email *" value={form.email} onChange={set("email")} className={inputCls} />
      <textarea data-testid="contact-message" required rows={4} placeholder="How can we help? *" value={form.message} onChange={set("message")} className={`${inputCls} resize-none`} />
      <button
        data-testid="contact-submit"
        type="submit"
        disabled={loading}
        className="group inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send message"}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </button>
    </form>
  );
};

export default function Contact() {
  return (
    <main data-testid="contact-page">
      <PageHero
        kicker="Resources — Contact Us"
        titleLines={["Let's build", "something", "that lasts"]}
        description="Tell us about the problem. A senior engineer or strategist replies within one business day."
      />

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="mb-8 font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">Request work</h2>
            <RequestWorkForm />
          </Reveal>
        </div>

        <div className="lg:col-span-5 space-y-12">
          <Reveal delay={0.1}>
            <h2 className="mb-8 font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">Quick message</h2>
            <QuickContact />
          </Reveal>

          <Reveal delay={0.2}>
            <div className="border border-white/10 bg-white/[0.02] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Reach us directly</p>
              <div className="mt-6 space-y-4 text-sm">
                <a data-testid="contact-email-link" href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-[#0055FF]" /> {CONTACT.email}
                </a>
                <a data-testid="contact-phone-link" href={CONTACT.phoneHref} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-[#0055FF]" /> {CONTACT.phone}
                </a>
                <a data-testid="contact-whatsapp-link" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
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
