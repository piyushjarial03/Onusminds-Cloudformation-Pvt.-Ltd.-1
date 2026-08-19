import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export const STATUS_STYLES = {
  new: "bg-amber-500/15 text-amber-400",
  in_progress: "bg-[#0055FF]/15 text-[#6b9aff]",
  completed: "bg-emerald-500/15 text-emerald-400",
};

export const STATUS_LABELS = { new: "New", in_progress: "In Progress", completed: "Completed" };

export const StatusPill = ({ status }) => {
  const s = STATUS_STYLES[status] ? status : "new";
  return (
    <span data-testid={`status-pill-${s}`} className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${STATUS_STYLES[s]}`}>
      {STATUS_LABELS[s]}
    </span>
  );
};

export default function DashboardView() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => setStats({ total: 0, attention: 0, completed: 0, active_services: 0 }));
    api.get("/admin/leads").then((r) => setLeads(r.data.slice(0, 5))).catch(() => setLeads([]));
  }, []);

  const cards = [
    { label: "Total requests", value: stats?.total, hint: "All enquiries", tid: "stat-total" },
    { label: "Needs attention", value: stats?.attention, hint: "New + in progress", tid: "stat-attention" },
    { label: "Completed", value: stats?.completed, hint: "Closed successfully", tid: "stat-completed" },
    { label: "Active services", value: stats?.active_services, hint: "Visible on site", tid: "stat-services" },
  ];

  return (
    <div data-testid="dashboard-view">
      <h1 className="font-display text-3xl md:text-4xl font-black tracking-tighter">Overview</h1>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.tid} data-testid={c.tid} className="border border-white/10 bg-white/[0.02] p-6">
            <p className="text-xs text-white/40">{c.label}</p>
            <p className="mt-3 font-display text-4xl font-black tracking-tighter">{c.value ?? "—"}</p>
            <p className="mt-2 text-[11px] text-white/30">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Live inbox</p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight">Recent requests</h2>
          </div>
          {leads && <span className="text-xs text-white/40">{leads.length} shown</span>}
        </div>
        <ul data-testid="recent-requests" className="mt-4 divide-y divide-white/5">
          {leads === null ? (
            <li className="px-6 py-6 text-sm text-white/40">Loading…</li>
          ) : leads.length === 0 ? (
            <li className="px-6 py-6 text-sm text-white/40">No enquiries yet.</li>
          ) : (
            leads.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0055FF]/15 font-display text-sm font-bold text-[#6b9aff]">
                    {(l.name || "?")[0].toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{l.name}</p>
                    <p className="truncate text-xs text-white/40">{[l.service, l.email].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
                <StatusPill status={l.status} />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
