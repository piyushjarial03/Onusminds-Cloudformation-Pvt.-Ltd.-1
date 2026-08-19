import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LayoutDashboard, PenSquare, Inbox, Users, Newspaper, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardView from "./DashboardView";
import RequestsView from "./RequestsView";
import SiteEditorView from "./SiteEditorView";
import TeamView from "./TeamView";
import NewsView from "./NewsView";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "editor", label: "Site editor", icon: PenSquare },
  { id: "requests", label: "Requests", icon: Inbox },
  { id: "team", label: "Team access", icon: Users },
  { id: "news", label: "News & Media", icon: Newspaper },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("dashboard");

  if (user === null)
    return <main className="pt-40 px-6 text-white/40 text-sm" data-testid="admin-loading">Checking access…</main>;
  if (user === false) return <Navigate to="/admin/login" replace />;

  const Active = { dashboard: DashboardView, editor: SiteEditorView, requests: RequestsView, team: TeamView, news: NewsView }[view];

  return (
    <main data-testid="admin-dashboard" className="min-h-screen pt-[72px]">
      <aside className="hidden lg:flex fixed left-0 top-[72px] bottom-0 z-40 w-64 flex-col border-r border-white/10 bg-[#0A0A0A]">
        <div className="p-6 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Control room</p>
          <p className="mt-1 text-sm text-[#6b9aff] capitalize">{user.role}</p>
        </div>
        <nav className="flex-1 py-4">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              data-testid={`admin-nav-${item.id}`}
              onClick={() => setView(item.id)}
              className={`flex w-full items-center gap-3 px-6 py-3.5 text-sm font-medium border-l-2 transition-colors duration-200 ${
                view === item.id ? "border-[#0055FF] bg-[#0055FF]/10 text-white" : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="mt-0.5 text-xs text-white/40">{user.email}</p>
          <button
            data-testid="admin-logout"
            onClick={logout}
            className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:hidden sticky top-[72px] z-40 flex items-center gap-1 overflow-x-auto border-b border-white/10 bg-[#0A0A0A] px-3 py-2">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            data-testid={`admin-nav-mobile-${item.id}`}
            onClick={() => setView(item.id)}
            className={`whitespace-nowrap px-3.5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
              view === item.id ? "bg-[#0055FF] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button data-testid="admin-logout-mobile" onClick={logout} className="ml-auto whitespace-nowrap px-3 py-2 text-[11px] uppercase tracking-widest text-red-400">
          Sign out
        </button>
      </div>

      <section className="lg:pl-64">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10 md:py-14">
          <Active />
        </div>
      </section>
    </main>
  );
}
