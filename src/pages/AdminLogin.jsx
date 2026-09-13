import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, LoaderCircle } from "lucide-react";

import { loginAdmin } from "../lib/auth";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const { user, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <LoaderCircle className="animate-spin text-[#d7ad55]" size={28} />
      </div>
    );
  }

  if (user) {
    const destination = location.state?.from?.pathname || "/admin";
    return <Navigate to={destination} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06151b] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/80">
            <span className="font-serif text-xl tracking-[-0.08em]">OS</span>
          </div>

          <p className="text-xs font-semibold tracking-[0.3em]">O-S STITCHES</p>

          <p className="mt-2 text-xs text-white/50">Designer Administration</p>
        </div>

        {/* Login card */}
        <div className="rounded-xl bg-white p-7 shadow-2xl sm:p-9">
          <div className="mb-7">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f7f7f5] text-[#06151b]">
              <LockKeyhole size={19} strokeWidth={1.8} />
            </div>

            <h1 className="text-xl font-semibold text-[#06151b]">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Sign in to manage your website.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium text-gray-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d7ad55] px-5 py-3 text-sm font-semibold text-[#06151b] transition hover:bg-[#e5c275] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderCircle size={17} className="animate-spin" />}

              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/40">
          O-S STITCHES • Admin Panel
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
