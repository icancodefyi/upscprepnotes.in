"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

/** Shown when an order's files are still being prepared (original copy). */
export default function PreparingClient() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Your product";

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-36 text-center">
      <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#d4f1df] text-l font-bold text-[#14532d]">✓</span>
      <h1 className="t-display mt-5 text-h1">We received your order</h1>
      <p className="mt-4 text-m text-[var(--ink-2)]">
        <strong>{title}</strong> is being prepared right now.
      </p>

      <div className="mt-8 rounded-[20px] bg-[#d4f1df] p-5">
        <p className="text-m font-bold text-[#14532d]">You&apos;ll receive it within 10 minutes.</p>
        <p className="mt-1 text-s text-[#14532d]/80">Thanks for your patience. We&apos;re on it.</p>
      </div>

      <div className="mt-6 rounded-[20px] bg-white p-5 text-left shadow-[0_0_0_1px_var(--line-2)]">
        <p className="text-m font-bold">What happens next</p>
        <ul className="mt-3 space-y-2 text-s text-[var(--ink-2)]">
          {["We're preparing your download file right now", "You'll get an email the moment it's ready", "Check your spam folder if you don't see it"].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <Link href="/store" className="mt-10 inline-block text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
        ← Back to Store
      </Link>
    </div>
  );
}
