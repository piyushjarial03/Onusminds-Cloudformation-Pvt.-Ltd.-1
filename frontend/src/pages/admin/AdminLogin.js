import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatApiError } from "../../lib/api";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#0055FF] focus:outline-none transition-colors duration-300";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-testid="admin-login-page" className="flex min-h-[100svh] items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md border border-white/10 bg-white/[0.02] p-10">
        <p className="font-display text-2xl font-black uppercase tracking-tighter">
          Onus<span className="text-[#0055FF]">Minds</span>
        </p>
        <p className="mt-2 text-xs uppercase tracking-widest text-white/40">Admin access</p>
        <form data-testid="admin-login-form" onSubmit={submit} className="mt-8 space-y-4">
          <input
            data-testid="admin-email"
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputCls}
          />
          <input
            data-testid="admin-password"
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className={inputCls}
          />
          {error && (
            <p data-testid="admin-login-error" className="text-sm text-red-400">{error}</p>
          )}
          <button
            data-testid="admin-login-submit"
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-2 bg-[#0055FF] px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
