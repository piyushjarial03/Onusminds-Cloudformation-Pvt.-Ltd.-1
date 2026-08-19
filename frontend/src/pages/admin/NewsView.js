import { useEffect, useState } from "react";
import { Trash2, Upload, Plus, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { api, fileUrl, formatApiError } from "../../lib/api";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";

const EMPTY_ARTICLE = { title: "", category: "News", excerpt: "", content: "", image_url: "", published: true };

export default function NewsView() {
  const [articles, setArticles] = useState(null);
  const [editing, setEditing] = useState(null);
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
          <h1 className="font-display text-2xl font-bold tracking-tight">{editing.id ? "Edit article" : "New article"}</h1>
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
    <div data-testid="news-view">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tighter">News &amp; Media</h1>
        <button
          data-testid="news-new-button"
          onClick={() => setEditing({ ...EMPTY_ARTICLE })}
          className="inline-flex items-center gap-2 bg-[#0055FF] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
        >
          <Plus className="h-4 w-4" /> New article
        </button>
      </div>
      {articles === null ? (
        <p className="mt-8 text-white/40 text-sm">Loading…</p>
      ) : articles.length === 0 ? (
        <p data-testid="news-admin-empty" className="mt-8 text-white/40 text-sm">No articles yet.</p>
      ) : (
        <ul data-testid="news-admin-list" className="mt-8 space-y-3">
          {articles.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-white/[0.02] p-5">
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
}
