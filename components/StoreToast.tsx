"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const HIDE_KEY = "store-toast-hidden";

export default function StoreToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem(HIDE_KEY)) return; } catch {}

    const timer = setTimeout(() => {
      setVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(HIDE_KEY, "1"); } catch {}
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 right-0 left-0 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="relative mx-3 sm:mx-0 animate-in slide-in-from-bottom-8 fade-in duration-500">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 shadow-xl ring-1 ring-emerald-500/20">
          <div className="absolute inset-0 bg-[length:200%_100%] animate-shimmer bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent pointer-events-none" />
          <button
            onClick={dismiss}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur transition hover:bg-white/20 hover:text-white/80"
            aria-label="Dismiss"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-lg ring-1 ring-emerald-500/20">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Offer
                </p>
                <p className="mt-0.5 text-sm font-bold tracking-tight text-white">
                  Starting at <span className="text-emerald-300">₹99</span>
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/60">Instant download</p>
            <div className="mt-4">
              <Link
                href="/store"
                onClick={dismiss}
                data-track="store-toast-cta"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-black shadow-lg transition-all hover:bg-emerald-50 active:scale-[0.97]"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
