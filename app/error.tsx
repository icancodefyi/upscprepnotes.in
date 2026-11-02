"use client";

import Link from "next/link";
import Nav from "@/components/brand/Nav";
import { brandFonts } from "@/components/brand/fonts";
import "@/components/brand/brand.css";

/** A crumpled-corner sheet: something went wrong mid-answer. Client-only, so the footer (which needs data) is left out. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={`up ${brandFonts} min-h-screen`}>
      <Nav />
      <main className="mx-auto grid min-h-screen max-w-3xl place-items-center px-6 pb-24 pt-32 text-center">
        <div>
          <div aria-hidden className="paper relative mx-auto h-[190px] w-[150px] rotate-[2deg] overflow-hidden px-5 pt-6">
            <span className="absolute inset-y-0 left-8 w-px bg-[var(--mark)]/40" />
            <div className="space-y-[16px] pl-6">
              {[78, 92, 60, 85, 40].map((w, i) => (
                <span key={i} className="block h-[3px] rounded-full bg-[rgba(31,63,214,0.35)]" style={{ width: `${w}%` }} />
              ))}
            </div>
            {/* the line the pen slipped on */}
            <svg viewBox="0 0 100 40" className="absolute bottom-6 left-10 w-[90px] text-[var(--mark-deep)]">
              <path d="M2 30c10-14 18 8 28-6s16 10 26-4 18 6 26-8 10 4 14-2" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="t-display mt-12 text-h1">Something went wrong</h1>
          <p className="mt-4 text-m text-[var(--ink-2)]">An unexpected error occurred. Please try again.</p>
          {error.digest && <p className="tab mt-2 text-s text-[var(--muted)]">Ref {error.digest}</p>}
          <div className="mt-8 flex justify-center gap-3">
            <button type="button" onClick={() => reset()} className="btn btn-ink">
              Try again
            </button>
            <Link href="/" className="btn btn-paper">
              Go home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
