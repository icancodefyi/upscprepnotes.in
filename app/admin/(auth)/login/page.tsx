"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Invalid password");
        return;
      }

      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">
            UP
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-900">Admin Panel</p>
            <p className="text-xs text-zinc-400">UPSCPrepNotes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-medium text-zinc-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying...
              </span>
            ) : "Sign in"}
          </button>
        </form>
      </div>
      <p className="mt-6 text-center text-xs text-zinc-400">
        UPSCPrepNotes Admin · Authorized access only
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50/50 p-6">
      <Suspense
        fallback={
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-zinc-100" />
              <div className="mt-4 h-4 w-24 animate-pulse rounded bg-zinc-100" />
              <div className="mt-8 h-12 animate-pulse rounded-xl bg-zinc-100" />
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
