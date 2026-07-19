"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function PreparingInner() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Your product";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="mt-4 text-xl font-bold text-gray-900">We received your order</h1>
      <p className="mt-2 text-sm text-gray-500">
        <strong>{title}</strong> is being prepared right now.
      </p>

      <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-800">
          You&apos;ll receive it within 10 minutes.
        </p>
        <p className="mt-1 text-xs text-emerald-600">
          Thanks for your patience. We&apos;re on it.
        </p>
      </div>

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
            Check your spam folder if you don&apos;t see it
          </li>
        </ul>
      </div>

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
