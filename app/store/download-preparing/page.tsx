"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function PreparingInner() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Your product";
  const slug = searchParams.get("slug") || "";
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await fetch("/api/store/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "download-preparing", slug }),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="mt-4 text-xl font-bold text-gray-900">Your file is being prepared</h1>
      <p className="mt-2 text-sm text-gray-500">
        <strong>{title}</strong> is being compiled and will be ready shortly.
      </p>

      <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">What happens next</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            We&apos;re preparing your download file right now
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            You&apos;ll get an email the moment it&apos;s ready
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            This usually takes less than 24 hours
          </li>
        </ul>
      </div>

      {!submitted ? (
        <form onSubmit={handleNotify} className="mt-6">
          <p className="text-xs text-gray-400">Enter your email to get notified when it&apos;s ready</p>
          <div className="mt-2 flex gap-2">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? "..." : "Notify Me"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Done. We&apos;ll email you at <strong>{email}</strong> as soon as your file is ready.
        </div>
      )}

      <Link
        href="/store"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600"
      >
        ← Back to Store
      </Link>
    </div>
  );
}

export default function DownloadPreparingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-600" />
        </div>
      }
    >
      <PreparingInner />
    </Suspense>
  );
}
