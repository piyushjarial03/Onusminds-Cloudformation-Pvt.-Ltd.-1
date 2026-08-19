import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../../lib/api";
import { StatusPill } from "./DashboardView";

const STATUSES = ["new", "in_progress", "completed"];
const STATUS_BTNS = { new: "Mark new", in_progress: "Mark in progress", completed: "Mark completed" };

export default function RequestsView() {
  const [leads, setLeads] = useState(null);
  const [active, setActive] = useState(null);

  const load = () => api.get("/admin/leads").then((r) => setLeads(r.data)).catch((e) => toast.error(formatApiError(e)));
  useEffect(() => { load(); }, []);

  const setStatus = async (lead, status) => {
    try {
      await api.patch(`/admin/leads/${lead.id}`, { status });
      toast.success(`Marked ${status.replace("_", " ")}`);
      setActive((a) => (a && a.id === lead.id ? { ...a, status } : a));
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const remove = async (lead) => {
    if (!window.confirm(`Delete enquiry from ${lead.name}?`)) return;
    await api.delete(`/admin/leads/${lead.id}`);
    setActive(null);
    load();
  };

  return (
    <div data-testid="requests-view">
      <h1 className="font-display text-3xl md:text-4xl font-black tracking-tighter">Request inbox</h1>
      <p className="mt-2 text-sm text-white/40">Every enquiry, in one view.</p>

      <div className="mt-8 border border-white/10 bg-white/[0.02]">
        {leads === null ? (
          <p className="px-6 py-8 text-sm text-white/40">Loading…</p>
        ) : leads.length === 0 ? (
          <p data-testid="requests-empty" className="px-6 py-8 text-sm text-white/40">No enquiries yet.</p>
        ) : (
          <ul data-testid="requests-list" className="divide-y divide-white/5">
            {leads.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {l.name}{l.company ? <span className="text-white/40"> / {l.company}</span> : null}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/40">
                    {[l.service, new Date(l.created_at).toLocaleDateString("en-IN")].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={l.status} />
                  <button
                    data-testid={`lead-details-${l.id}`}
                    onClick={() => setActive(l)}
                    className="border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold hover:border-[#0055FF] transition-colors"
                  >
                    View details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {active && (
        <div data-testid="lead-modal" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6" onClick={() => setActive(null)}>
          <div className="w-full max-w-lg border border-white/10 bg-zinc-950 p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-bold tracking-tight">{active.name}</p>
                <p className="mt-1 text-sm text-white/50">{active.email}</p>
              </div>
              <button data-testid="lead-modal-close" onClick={() => setActive(null)} aria-label="Close" className="p-2 text-white/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Company", active.company],
                ["Phone", active.phone],
                ["Service", active.service],
                ["Preferred contact", active.contact_method],
                ["Type", active.kind === "request_work" ? "Request Work" : "Contact"],
                ["Received", new Date(active.created_at).toLocaleString("en-IN")],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-white/5 pb-2">
                  <dt className="text-white/40">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/70">{active.message}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  data-testid={`lead-status-${s}`}
                  onClick={() => setStatus(active, s)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    (active.status || "new") === s ? "bg-[#0055FF] text-white" : "border border-white/15 text-white/60 hover:border-white/50"
                  }`}
                >
                  {STATUS_BTNS[s]}
                </button>
              ))}
              <button
                data-testid="lead-modal-delete"
                onClick={() => remove(active)}
                className="ml-auto inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-red-400 hover:border-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
