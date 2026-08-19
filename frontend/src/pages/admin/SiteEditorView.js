import { useEffect, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { api, fileUrl, formatApiError } from "../../lib/api";
import { useSite, DEFAULT_CONTENT } from "../../context/SiteContext";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";
const labelCls = "block mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50";

const Field = ({ label, k, value, onChange, textarea }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {textarea ? (
      <textarea data-testid={`field-${k}`} rows={k === "hero_title" ? 5 : 3} value={value} onChange={onChange} className={`${inputCls} resize-y`} />
    ) : (
      <input data-testid={`field-${k}`} value={value} onChange={onChange} className={inputCls} />
    )}
  </div>
);

export default function SiteEditorView() {
  const { refresh } = useSite();
  const [content, setContent] = useState(null);
  const [services, setServices] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/content").then((r) => setContent({ ...DEFAULT_CONTENT, ...r.data })).catch((e) => toast.error(formatApiError(e)));
    api.get("/admin/services").then((r) => setServices(r.data)).catch((e) => toast.error(formatApiError(e)));
  }, []);

  if (!content || !services) return <p className="text-white/40 text-sm" data-testid="editor-loading">Loading editor…</p>;

  const setC = (k) => (e) => setContent((c) => ({ ...c, [k]: e.target.value }));
  const setS = (i, k, v) => setServices((list) => list.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));

  const uploadLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd);
      setContent((c) => ({ ...c, logo_url: data.url }));
      toast.success("Logo uploaded — publish to apply");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const publish = async () => {
    setSaving(true);
    try {
      await api.put("/admin/content", content);
      await api.put("/admin/services/bulk", { services });
      await refresh();
      toast.success("Changes published — live on the site now");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="site-editor-view">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Full text control</p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-black tracking-tighter">Site editor</h1>
        </div>
        <button
          data-testid="publish-changes"
          onClick={publish}
          disabled={saving}
          className="bg-[#0055FF] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
        >
          {saving ? "Publishing…" : "Publish changes"}
        </button>
      </div>

      <div className="mt-8 border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-wrap items-center gap-6">
        {content.logo_url ? (
          <img src={fileUrl(content.logo_url)} alt="Site logo" data-testid="logo-preview" className="h-14 w-14 object-contain border border-white/10" />
        ) : (
          <span data-testid="logo-placeholder" className="flex h-14 w-14 items-center justify-center border border-white/10 font-display text-lg font-black">
            O<span className="text-[#0055FF]">M</span>
          </span>
        )}
        <div>
          <label data-testid="logo-upload" className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:border-[#0055FF] transition-colors">
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Choose new logo"}
            <input type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
          </label>
          <p className="mt-2 text-xs text-white/40 max-w-xs">PNG or JPG, square works best. Updates the header after publishing.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 space-y-5">
          <h2 className="font-display text-lg font-bold tracking-tight">Hero &amp; overview</h2>
          <Field label="Eyebrow" k="hero_eyebrow" value={content.hero_eyebrow} onChange={setC("hero_eyebrow")} />
          <Field label="Hero title (one line per row)" k="hero_title" textarea value={content.hero_title} onChange={setC("hero_title")} />
          <Field label="Hero text" k="hero_text" textarea value={content.hero_text} onChange={setC("hero_text")} />
          <Field label="Overview title" k="overview_title" textarea value={content.overview_title} onChange={setC("overview_title")} />
          <Field label="Capabilities title" k="capabilities_title" textarea value={content.capabilities_title} onChange={setC("capabilities_title")} />
          <Field label="Request title" k="request_title" textarea value={content.request_title} onChange={setC("request_title")} />
          <Field label="Request text" k="request_text" textarea value={content.request_text} onChange={setC("request_text")} />
        </div>

        <div className="space-y-6">
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 space-y-5">
            <h2 className="font-display text-lg font-bold tracking-tight">Contact &amp; chrome</h2>
            <Field label="Email" k="contact_email" value={content.contact_email} onChange={setC("contact_email")} />
            <Field label="Phone" k="contact_phone" value={content.contact_phone} onChange={setC("contact_phone")} />
            <Field label="WhatsApp" k="whatsapp_number" value={content.whatsapp_number} onChange={setC("whatsapp_number")} />
            <Field label="Nav CTA" k="nav_cta" value={content.nav_cta} onChange={setC("nav_cta")} />
            <Field label="Footer credit" k="footer_credit" value={content.footer_credit} onChange={setC("footer_credit")} />
            <Field label="Footer blurb" k="footer_blurb" textarea value={content.footer_blurb} onChange={setC("footer_blurb")} />
            <Field label="LinkedIn URL" k="linkedin_url" value={content.linkedin_url} onChange={setC("linkedin_url")} />
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <h2 className="font-display text-lg font-bold tracking-tight">Homepage stats</h2>
            <div className="mt-5 space-y-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="grid grid-cols-[120px_1fr] gap-3">
                  <div>
                    <label className={labelCls}>Stat {n} value</label>
                    <input data-testid={`field-stat_${n}_value`} value={content[`stat_${n}_value`]} onChange={setC(`stat_${n}_value`)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Stat {n} label</label>
                    <input data-testid={`field-stat_${n}_label`} value={content[`stat_${n}_label`]} onChange={setC(`stat_${n}_label`)} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <h2 className="font-display text-lg font-bold tracking-tight">Services</h2>
            <ul data-testid="services-editor" className="mt-5 space-y-5">
              {services.map((s, i) => (
                <li key={s.id || `new-${i}`} className="border border-white/10 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-sm text-white/30">0{i + 1}</span>
                    <label className="flex items-center gap-2 text-xs text-white/50">
                      <input
                        data-testid={`service-visible-${i}`}
                        type="checkbox"
                        checked={!!s.visible}
                        onChange={(e) => setS(i, "visible", e.target.checked)}
                        className="h-4 w-4 accent-[#0055FF]"
                      />
                      Visible
                    </label>
                    <button
                      data-testid={`service-remove-${i}`}
                      onClick={() => setServices((list) => list.filter((_, idx) => idx !== i))}
                      aria-label="Remove service"
                      className="p-1.5 text-white/40 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input data-testid={`service-title-${i}`} value={s.title} onChange={(e) => setS(i, "title", e.target.value)} placeholder="Service title" className={inputCls} />
                  <select data-testid={`service-discipline-${i}`} value={s.discipline} onChange={(e) => setS(i, "discipline", e.target.value)} className={inputCls}>
                    <option>IT Services</option>
                    <option>Digital Marketing</option>
                  </select>
                  <textarea data-testid={`service-short-${i}`} rows={3} value={s.short} onChange={(e) => setS(i, "short", e.target.value)} placeholder="Short description" className={`${inputCls} resize-y`} />
                </li>
              ))}
            </ul>
            <button
              data-testid="add-service"
              onClick={() => setServices((list) => [...list, { title: "", discipline: "IT Services", short: "", tagline: "", description: [], deliverables: [], outcomes: [], visible: true }])}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-dashed border-white/20 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#6b9aff] hover:border-[#0055FF] transition-colors"
            >
              <Plus className="h-4 w-4" /> Add service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
