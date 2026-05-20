"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductFloatingWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link
      href="/toppers/toppers-copy-compilation"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-xs font-medium text-zinc-700 shadow-lg transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:px-5 md:py-3 md:text-sm"
      aria-label="Get the topper answer copy compilation"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
        ₹
      </span>
      <span className="hidden md:inline">50+ Topper Answer Copies</span>
      <span className="md:hidden">Answer Copies</span>
      <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
