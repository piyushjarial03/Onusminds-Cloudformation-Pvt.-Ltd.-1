import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Trash2, LogOut, Upload, Plus, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { api, fileUrl, formatApiError } from "../../lib/api";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";

const EMPTY_ARTICLE = { title: "", category: "News", excerpt: "", content: "", image_url: "", published: true };

const LeadsTab = () => {
  const [leads, setLeads] = useState(null);

  const load = () => api.get("/admin/leads").then((r) => setLeads(r.data)).catch((e) => toast.error(formatApiError(e)));
  useEffect(() => { load(); }, []);

  const toggleRead = async (lead) => {
    await api.patch(`/admin/leads/${lead.id}`, { read: !lead.read });
    load();
  };
  const remove = async (lead) => {
    if (!window.confirm(`Delete enquiry from ${lead.name}?`)) return;
    await api.delete(`/admin/leads/${lead.id}`);
    load();
  };

  if (leads === null) return <p className="text-white/40 text-sm">Loading leads…</p>;
  if (leads.length === 0) return <p data-testid="leads-empty" className="text-white/40 text-sm">No enquiries yet.</p>;

  return (
    <ul data-testid="leads-list" className="space-y-3">
      {leads.map((l) => (
        <li key={l.id} className={`border p-5 ${l.read ? "border-white/10 opacity-60" : "border-[#0055FF]/50 bg-[#0055FF]/5"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${l.kind === "request_work" ? "bg-[#0055FF] text-white" : "bg-white/10 text-white/70"}`}>
                {l.kind === "request_work" ? "Request Work" : "Contact"}
              </span>
              <p className="font-display font-bold">{l.name}</p>
              <a href={`mailto:${l.email}`} className="text-sm text-white/50 hover:text-white">{l.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <button data-testid={`lead-read-${l.id}`} onClick={() => toggleRead(l)} className="border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-widest hover:border-white/60 transition-colors">
                {l.read ? "Mark unread" : "Mark read"}
              </button>
              <button data-testid={`lead-delete-${l.id}`} onClick={() => remove(l)} aria-label="Delete lead" className="border border-white/20 p-2 hover:border-red-500 hover:text-red-400 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/60">{l.message}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/30">
            {[l.company, l.service, l.phone, l.contact_method && `Prefers ${l.contact_method}`].filter(Boolean).join(" · ") || "—"} · {new Date(l.created_at).toLocaleString("en-IN")}
          </p>
        </li>
      ))}
    </ul>
  );
};

const NewsTab = () => {
  const [articles, setArticles] = useState(null);
  const [editing, setEditing] = useState(null); // null = list, {id?} = form
  const [uploading, setUploading] = useState(false);

  const load = () => api.get("/admin/news").then((r) => setArticles(r.data)).catch((e) => toast.error(formatApiError(e)));
  useEffect(() => { load(); }, []);

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd);
      setEditing((f) => ({ ...f, image_url: data.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing.id) await api.put(`/admin/news/${editing.id}`, editing);
      else await api.post("/admin/news", editing);
      toast.success(editing.id ? "Article updated" : "Article published");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete "${a.title}"?`)) return;
    await api.delete(`/admin/news/${a.id}`);
    load();
  };

  if (editing) {
    const set = (k) => (e) => setEditing((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    return (
      <form data-testid="news-editor-form" onSubmit={save} className="max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight">{editing.id ? "Edit article" : "New article"}</h3>
          <button type="button" data-testid="news-editor-cancel" onClick={() => setEditing(null)} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/50 hover:text-white">
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
        </div>
        <input data-testid="news-title" required placeholder="Title *" value={editing.title} onChange={set("title")} className={inputCls} />
        <div className="grid grid-cols-2 gap-4">
          <input data-testid="news-category" placeholder="Category" value={editing.category} onChange={set("category")} className={inputCls} />
          <label className="flex items-center gap-3 text-sm text-white/60">
            <input data-testid="news-published" type="checkbox" checked={editing.published} onChange={set("published")} className="h-4 w-4 accent-[#0055FF]" />
            Published
          </label>
        </div>
        <textarea data-testid="news-excerpt" rows={2} placeholder="Excerpt" value={editing.excerpt} onChange={set("excerpt")} className={`${inputCls} resize-none`} />
        <textarea data-testid="news-content" rows={10} placeholder="Article body — blank line between paragraphs" value={editing.content} onChange={set("content")} className={`${inputCls} resize-y`} />
        <div>
          <label data-testid="news-image-upload" className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:border-[#0055FF] transition-colors">
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
          </label>
          {editing.image_url && (
            <img src={fileUrl(editing.image_url)} alt="Article" className="mt-4 aspect-[16/9] max-w-sm border border-white/10 object-cover" />
          )}
        </div>
        <button data-testid="news-save" type="submit" className="bg-[#0055FF] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
          {editing.id ? "Save changes" : "Publish article"}
        </button>
      </form>
    );
  }

  return (
    <div>
      <button
        data-testid="news-new-button"
        onClick={() => setEditing({ ...EMPTY_ARTICLE })}
        className="mb-6 inline-flex items-center gap-2 bg-[#0055FF] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
      >
        <Plus className="h-4 w-4" /> New article
      </button>
      {articles === null ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : articles.length === 0 ? (
        <p data-testid="news-admin-empty" className="text-white/40 text-sm">No articles yet.</p>
      ) : (
        <ul data-testid="news-admin-list" className="space-y-3">
          {articles.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 border border-white/10 p-5">
              <div className="flex items-center gap-4">
                {a.image_url && <img src={fileUrl(a.image_url)} alt="" className="h-12 w-20 object-cover border border-white/10" />}
                <div>
                  <p className="font-display font-bold">{a.title}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    {a.category} · {a.published ? <span className="text-[#0055FF]">Published</span> : "Draft"} · /news/{a.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button data-testid={`news-edit-${a.id}`} onClick={() => setEditing({ ...a })} aria-label="Edit article" className="border border-white/20 p-2 hover:border-[#0055FF] transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button data-testid={`news-delete-${a.id}`} onClick={() => remove(a)} aria-label="Delete article" className="border border-white/20 p-2 hover:border-red-500 hover:text-red-400 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("leads");

  if (user === null)
    return <main className="pt-40 px-6 text-white/40 text-sm" data-testid="admin-loading">Checking access…</main>;
  if (user === false) return <Navigate to="/admin/login" replace />;

  return (
    <main data-testid="admin-dashboard" className="mx-auto max-w-[1200px] px-6 md:px-10 pt-28 pb-16 md:pb-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Admin</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-black uppercase tracking-tighter">Control room</h1>
        </div>
        <button
          data-testid="admin-logout"
          onClick={logout}
          className="inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 text-xs uppercase tracking-widest hover:border-red-500 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      <div className="mt-10 flex gap-2 border-b border-white/10">
        {["leads", "news"].map((t) => (
          <button
            key={t}
            data-testid={`admin-tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors ${
              tab === t ? "border-[#0055FF] text-white" : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            {t === "leads" ? "Enquiries" : "News & Media"}
          </button>
        ))}
      </div>

      <div className="mt-8">{tab === "leads" ? <LeadsTab /> : <NewsTab />}</div>
    </main>
  );
}
