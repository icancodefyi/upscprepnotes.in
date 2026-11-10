"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Gilu from "@/components/brand/Gilu";
import { MailIcon, ZipIcon } from "@/components/brand/icons";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

/** Shown when an order's files are still being prepared. */
export default function PreparingClient() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Your product";

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-28 text-center sm:pt-32">
      <Gilu pose="reading" size={170} className="mx-auto h-auto w-[140px]" />
      <h1 className="t-display mt-4 text-h1">We&apos;ve got your order</h1>
      <p className="mt-3 text-m leading-[1.55] text-[var(--ink-2)]">
        Gilu is packing your files. You&apos;ll have them in about 10 minutes.
      </p>

      <div className={`${card} mt-8 p-5 text-left`}>
        <div className="flex items-center gap-4">
          <ZipIcon size={52} />
          <div className="min-w-0">
            <p className="text-m font-bold leading-snug">{title}</p>
            <p className="mt-0.5 text-s text-[var(--muted)]">Being packed right now</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3 border-t border-[var(--line)] pt-4">
          <MailIcon size={36} />
          <p className="text-s leading-[1.55] text-[var(--ink-2)]">
            We&apos;ll email you the moment it&apos;s ready. If it doesn&apos;t arrive, check Spam or Promotions.
          </p>
        </div>
      </div>

      <Link href="/store" className="mt-10 inline-block text-s font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
        Back to the store
      </Link>
    </div>
  );
}
