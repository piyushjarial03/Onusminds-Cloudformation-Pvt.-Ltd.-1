import { useEffect, useState } from "react";
import { LogIn, PenSquare, Newspaper, Inbox, Users, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../../lib/api";

const ACTION_META = {
  "Signed in": { icon: LogIn, cls: "bg-emerald-500/15 text-emerald-400" },
  "Published site content": { icon: PenSquare, cls: "bg-[#0055FF]/15 text-[#6b9aff]" },
  "Updated services": { icon: PenSquare, cls: "bg-[#0055FF]/15 text-[#6b9aff]" },
  "Uploaded file": { icon: Upload, cls: "bg-white/10 text-white/60" },
};

const metaFor = (action) => {
  if (ACTION_META[action]) return ACTION_META[action];
  if (action.includes("article")) return { icon: Newspaper, cls: "bg-purple-500/15 text-purple-300" };
  if (action.includes("request")) return { icon: Inbox, cls: "bg-amber-500/15 text-amber-400" };
  if (action.includes("account")) return { icon: Users, cls: "bg-[#0055FF]/15 text-[#6b9aff]" };
  if (action.includes("Deleted")) return { icon: Trash2, cls: "bg-red-500/15 text-red-400" };
  return { icon: PenSquare, cls: "bg-white/10 text-white/60" };
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
};

export default function ActivityView() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get("/admin/activity").then((r) => setItems(r.data)).catch((e) => {
      toast.error(formatApiError(e));
      setItems([]);
    });
  }, []);

  return (
    <div data-testid="activity-view">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Audit trail</p>
      <h1 className="mt-1 font-display text-3xl md:text-4xl font-black tracking-tighter">Activity &amp; sign-ins</h1>
      <p className="mt-2 text-sm text-white/40">Who signed in, and every change made to the website.</p>

      <div className="mt-8 border border-white/10 bg-white/[0.02]">
        {items === null ? (
          <p className="px-6 py-8 text-sm text-white/40">Loading…</p>
        ) : items.length === 0 ? (
          <p data-testid="activity-empty" className="px-6 py-8 text-sm text-white/40">No activity recorded yet.</p>
        ) : (
          <ul data-testid="activity-list" className="divide-y divide-white/5">
            {items.map((a) => {
              const meta = metaFor(a.action);
              return (
                <li key={a.id} className="flex items-start gap-4 px-6 py-4">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.cls}`}>
                    <meta.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{a.user_name}</span>
                      <span className="text-white/40"> ({a.user_email})</span>
                      <span className="text-white/80"> — {a.action}</span>
                    </p>
                    {a.detail && <p className="mt-0.5 text-xs text-white/40 break-words">{a.detail}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-white/30" title={new Date(a.created_at).toLocaleString("en-IN")}>
                    {timeAgo(a.created_at)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
