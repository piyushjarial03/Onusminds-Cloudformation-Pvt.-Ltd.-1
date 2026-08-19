import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../lib/api";
import { SERVICES } from "../data/services";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";

export const RequestWorkForm = ({ defaultService = "", compact = false }) => {
  const [form, setForm] = useState({
    name: "", email: "", company: "", service: defaultService, budget: "", message: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, kind: "request_work" });
      toast.success("Request received. We'll be in touch within one business day.");
      setForm({ name: "", email: "", company: "", service: defaultService, budget: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form data-testid="request-work-form" onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input data-testid="rw-name" required placeholder="Your name *" value={form.name} onChange={set("name")} className={inputCls} />
      <input data-testid="rw-email" required type="email" placeholder="Work email *" value={form.email} onChange={set("email")} className={inputCls} />
      <input data-testid="rw-company" placeholder="Company" value={form.company} onChange={set("company")} className={inputCls} />
      <select data-testid="rw-service" value={form.service} onChange={set("service")} className={inputCls}>
        <option value="">Service of interest</option>
        {SERVICES.map((s) => (
          <option key={s.slug} value={s.title}>{s.title}</option>
        ))}
        <option value="Not sure yet">Not sure yet</option>
      </select>
      <select data-testid="rw-budget" value={form.budget} onChange={set("budget")} className={`${inputCls} md:col-span-2`}>
        <option value="">Indicative budget</option>
        <option>Under ₹5L</option>
        <option>₹5L – ₹15L</option>
        <option>₹15L – ₹50L</option>
        <option>₹50L+</option>
        <option>Prefer to discuss</option>
      </select>
      <textarea
        data-testid="rw-message"
        required
        rows={compact ? 3 : 5}
        placeholder="What are you trying to build, fix or grow? *"
        value={form.message}
        onChange={set("message")}
        className={`${inputCls} md:col-span-2 resize-none`}
      />
      <div className="md:col-span-2">
        <button
          data-testid="rw-submit"
          type="submit"
          disabled={loading}
          className="group inline-flex items-center gap-3 bg-[#0055FF] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Request work"}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>
    </form>
  );
};
