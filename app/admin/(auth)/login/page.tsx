"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mark } from "@/components/brand/Nav";

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
      <div className="rounded-[28px] bg-white p-8 shadow-[0_0_0_1px_var(--line-2),0_24px_56px_-28px_rgba(11,12,16,0.35)]">
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3">
          <Mark size={40} />
          <div>
            <p className="text-m font-bold tracking-[-0.02em] text-zinc-900">UPSCPrepNotes</p>
            <p className="text-s text-zinc-400">Admin</p>
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
              className="h-12 w-full rounded-full bg-white px-5 text-m shadow-[0_0_0_1px_var(--line-2)] outline-none transition focus:shadow-[0_0_0_2px_var(--accent)]"
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
            className="btn btn-blue h-12 w-full justify-center disabled:opacity-50"
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
