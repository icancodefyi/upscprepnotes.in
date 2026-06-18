"use client";

import Link from "next/link";

interface Props {
  topperName: string;
}

export default function PurchaseSidebar({ topperName }: Props) {
  return (
    <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-zinc-800">Get {topperName}&apos;s Answer Copy</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">+ 50+ topper copies in the complete compilation</p>
        </div>
      </div>
      <Link
        href="/store"
        data-track="topper-sidebar-buy-answer-copies"
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-400 active:scale-[0.97]"
      >
        Shop Now — ₹99
      </Link>
      <p className="mt-1.5 text-center text-[9px] text-zinc-400">Great Weekend Sale · All Products at ₹99</p>
    </div>
  );
}
