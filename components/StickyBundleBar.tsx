"use client";

import { useRouter } from "next/navigation";

export default function StickyBundleBar() {
  const router = useRouter();

  function handleClick() {
    router.push("/store");
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1.5 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          <span className="truncate text-[12px] text-gray-600 sm:text-sm">
            <strong className="text-emerald-600">39 premium products</strong>
            <span className="hidden sm:inline"> — notes bundles, test series, teacher materials & more</span>
          </span>
        </div>
        <button
          onClick={handleClick}
          data-track="global-sticky-bar"
          className="shrink-0 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-emerald-500 sm:px-6 sm:py-2 sm:text-sm"
        >
          <span className="sm:hidden">Browse Store</span>
          <span className="hidden sm:inline">Browse Store — from ₹99</span>
        </button>
      </div>
    </div>
  );
}
