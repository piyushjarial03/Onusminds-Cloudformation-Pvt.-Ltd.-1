import { useEffect, useState } from "react";
import { ShieldCheck, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "../../lib/api";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";
const labelCls = "block mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50";

export default function TeamView() {
  const [team, setTeam] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [creating, setCreating] = useState(false);

  const load = () => api.get("/admin/team").then((r) => setTeam(r.data)).catch((e) => toast.error(formatApiError(e)));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/admin/team", form);
      toast.success(`Account created for ${form.email}`);
      setForm({ name: "", email: "", password: "", role: "admin" });
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setCreating(false);
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name} (${u.email})?`)) return;
    try {
      await api.delete(`/admin/team/${u.id}`);
      toast.success("Account removed");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <div data-testid="team-view">
      <h1 className="font-display text-3xl md:text-4xl font-black tracking-tighter">Team access</h1>

      <div className="mt-8 border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0055FF]">Access control</p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight">Admin team</h2>
          </div>
          {team && <span className="text-xs text-white/40">{team.length} account{team.length === 1 ? "" : "s"}</span>}
        </div>
        <ul data-testid="team-list" className="mt-4 divide-y divide-white/5">
          {team === null ? (
            <li className="px-6 py-6 text-sm text-white/40">Loading…</li>
          ) : (
            team.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-4 min-w-0">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#0055FF]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{u.name}</p>
                    <p className="truncate text-xs text-white/40">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[#0055FF]/15 text-[#6b9aff]">
                    {{ owner: "Owner", sr_admin: "Sr. Admin", admin: "Admin" }[u.role] || u.role}
                  </span>
                  <button data-testid={`team-remove-${u.id}`} onClick={() => remove(u)} aria-label={`Remove ${u.name}`} className="p-1.5 border border-white/15 text-white/40 hover:text-red-400 hover:border-red-500 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <form data-testid="team-create-form" onSubmit={create} className="border-t border-white/10 p-6">
          <h3 className="font-display text-lg font-bold tracking-tight">Create admin account</h3>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full name</label>
              <input data-testid="team-name" required value={form.name} onChange={set("name")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input data-testid="team-email" required type="email" value={form.email} onChange={set("email")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input data-testid="team-password" required type="password" minLength={8} value={form.password} onChange={set("password")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <select data-testid="team-role" value={form.role} onChange={set("role")} className={inputCls}>
                <option value="admin">Admin — dashboard &amp; news only</option>
                <option value="sr_admin">Sr. Admin — dashboard, requests &amp; news</option>
                <option value="owner">Owner — full access</option>
              </select>
            </div>
          </div>
          <button
            data-testid="team-create-submit"
            type="submit"
            disabled={creating}
            className="mt-5 inline-flex items-center gap-2 bg-[#0055FF] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> {creating ? "Creating…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
