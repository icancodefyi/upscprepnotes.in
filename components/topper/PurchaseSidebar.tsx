"use client";

import PayButton from "@/components/ui/PayButton";

interface Props {
  topperName: string;
}

export default function PurchaseSidebar({ topperName }: Props) {
  return (
    <div className="mt-4 rounded-xl border-2 border-emerald-600/20 bg-emerald-50 p-4">
      <p className="text-xs font-bold text-emerald-800 tracking-tight">Get {topperName}&apos;s Answer Copy</p>
      <p className="mt-0.5 text-[10px] text-emerald-700/70">+ 50+ topper copies in the Complete Compilation</p>
      <div className="mt-3 flex flex-col gap-1.5">
        <PayButton amount={799} productSlug="all-strategy-reports" tracking="dodo-sidebar" className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 active:scale-[0.97]">
          Pay ₹799 — Instant Access
        </PayButton>
      </div>
    </div>
  );
}
