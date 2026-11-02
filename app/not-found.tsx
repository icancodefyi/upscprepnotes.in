import type { Metadata } from "next";
import Link from "next/link";
import BrandShell from "@/components/brand/BrandShell";

export const metadata: Metadata = {
  title: "Page Not Found — UPSCPrepNotes",
  description: "The page you're looking for doesn't exist. Browse UPSC toppers, answer copies, marksheets, and preparation resources.",
  robots: { index: false, follow: true },
};

/** A blank answer sheet the examiner has marked 404 in red ink. */
function MarkedSheet() {
  return (
    <div aria-hidden className="paper relative mx-auto h-[210px] w-[170px] rotate-[-3deg] overflow-hidden px-5 pt-6">
      <span className="absolute inset-y-0 left-8 w-px bg-[var(--mark)]/40" />
      <div className="space-y-[18px] pl-6">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span key={i} className="block h-px bg-[rgba(31,63,214,0.14)]" />
        ))}
      </div>
      <svg viewBox="0 0 120 90" className="absolute left-1/2 top-1/2 w-[132px] -translate-x-1/2 -translate-y-1/2 text-[var(--mark-deep)]">
        <path d="M60 8c28-2 52 12 52 36 0 22-22 38-52 38S8 68 8 46C8 22 30 6 66 10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <text x="60" y="56" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor" style={{ fontFamily: "var(--up-sans)" }}>404</text>
      </svg>
    </div>
  );
}

export default async function NotFound() {
  return (
    <BrandShell>
      <div className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-6 pb-24 pt-32 text-center">
        <div>
          <MarkedSheet />
          <h1 className="t-display mt-12 text-h1">Page not found</h1>
          <p className="mt-4 text-m text-[var(--ink-2)]">We couldn&apos;t find the page you&apos;re looking for.</p>
          <div className="mt-8">
            <Link href="/" className="btn btn-ink">
              Return home <span className="knob">→</span>
            </Link>
          </div>
        </div>
      </div>
    </BrandShell>
  );
}
