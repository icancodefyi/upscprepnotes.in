"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconClock } from "@tabler/icons-react";

const HIDE_KEY = "timed_banner_hidden";

export default function TimedBundleBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(HIDE_KEY)) return;
    } catch {}

    const timer = setTimeout(() => {
      setVisible(true);
    }, 25000);

    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(HIDE_KEY, "1"); } catch {}
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-30 animate-in slide-in-from-left-8 fade-in duration-500 sm:left-6 sm:right-auto sm:w-72">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 shadow-xl shadow-emerald-900/20">
        <div className="absolute inset-0 bg-[length:200%_100%] animate-shimmer bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent pointer-events-none" />
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur hover:bg-white/20 hover:text-white/80"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="relative p-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Offer</span>
          </div>
          <p className="mt-2 text-sm font-bold text-white">
            Starting at <span className="text-emerald-300">₹99</span>
          </p>
          <p className="mt-0.5 text-xs text-white/60">Instant download</p>

          <Link
            href="/store"
            onClick={dismiss}
            data-track="timed-banner"
            className="relative mt-3 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-emerald-50"
          >
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
