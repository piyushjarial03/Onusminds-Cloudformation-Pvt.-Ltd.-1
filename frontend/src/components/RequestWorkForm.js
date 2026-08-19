import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../lib/api";
import { SERVICES } from "../data/services";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";

const labelCls = "block mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50";

export const RequestWorkForm = ({ defaultService = "" }) => {
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "", service: defaultService, message: "", contact_method: "Either",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, kind: "request_work" });
      toast.success("Request received. We'll be in touch within one business day.");
      setForm({ name: "", email: "", company: "", phone: "", service: defaultService, message: "", contact_method: "Either" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form data-testid="request-work-form" onSubmit={submit} className="border border-white/10 bg-white/[0.02] p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="rw-name" className={labelCls}>Name</label>
          <input id="rw-name" data-testid="rw-name" required value={form.name} onChange={set("name")} className={inputCls} />
        </div>
        <div>
          <label htmlFor="rw-company" className={labelCls}>Company name</label>
          <input id="rw-company" data-testid="rw-company" value={form.company} onChange={set("company")} className={inputCls} />
        </div>
        <div>
          <label htmlFor="rw-email" className={labelCls}>Email</label>
          <input id="rw-email" data-testid="rw-email" required type="email" value={form.email} onChange={set("email")} className={inputCls} />
        </div>
        <div>
          <label htmlFor="rw-phone" className={labelCls}>Phone number</label>
          <input id="rw-phone" data-testid="rw-phone" type="tel" value={form.phone} onChange={set("phone")} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="rw-service" className={labelCls}>Service required</label>
          <select id="rw-service" data-testid="rw-service" required value={form.service} onChange={set("service")} className={inputCls}>
            <option value="" disabled>Choose a service</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.title}>{s.title}</option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="rw-message" className={labelCls}>Tell us about your requirement</label>
          <textarea
            id="rw-message"
            data-testid="rw-message"
            required
            rows={5}
            value={form.message}
            onChange={set("message")}
            className={`${inputCls} resize-y`}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="rw-contact-method" className={labelCls}>Preferred contact method</label>
          <select id="rw-contact-method" data-testid="rw-contact-method" value={form.contact_method} onChange={set("contact_method")} className={inputCls}>
            <option>Either</option>
            <option>Email</option>
            <option>Phone</option>
            <option>WhatsApp</option>
          </select>
        </div>
      </div>
      <button
        data-testid="rw-submit"
        type="submit"
        disabled={loading}
        className="group mt-7 inline-flex items-center gap-3 bg-[#0055FF] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Submit request"}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </button>
      <p className="mt-4 text-xs text-white/40">Your request is saved securely in our request system.</p>
    </form>
  );
};
