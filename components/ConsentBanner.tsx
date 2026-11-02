"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { brandFonts } from "@/components/brand/fonts";
import { getConsent, setConsent, onConsentChange, type Consent } from "@/lib/consent";

/** One-time analytics notice. Nothing is recorded until the visitor accepts. */
export default function ConsentBanner() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Consent | undefined>(undefined);

  useEffect(() => {
    setChoice(getConsent());
    return onConsentChange(() => setChoice(getConsent()));
  }, []);

  if (choice !== null || pathname?.startsWith("/admin")) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics choice"
      className={`up ${brandFonts} fixed inset-x-3 bottom-3 z-[60] rounded-[20px] p-4 shadow-[0_0_0_1px_var(--line-2),0_12px_40px_-12px_rgba(11,12,16,0.3)] sm:inset-x-auto sm:left-4 sm:bottom-4 sm:w-[380px]`}
    >
      <p className="text-s leading-[1.5] text-[var(--ink-2)]">
        We count visits, clicks and searches to see what students need and fix what&apos;s broken. No ads, nothing sold, and
        your email is never read from what you type.{" "}
        <Link href="/privacy-policy" className="font-bold text-[var(--accent)] underline-offset-2 hover:underline">
          Details
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setConsent("yes")} className="btn btn-ink h-10 flex-1 justify-center px-4 [--btn-fs:14px]">
          Accept
        </button>
        <button
          type="button"
          onClick={() => setConsent("no")}
          className="btn h-10 flex-1 justify-center px-4 text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] [--btn-fs:14px]"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
