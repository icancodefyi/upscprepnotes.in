"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const HIDE_KEY = "store-dialog-hidden";

export default function StoreDialog() {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative z-10 w-full max-w-sm animate-in fade-in duration-300">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 shadow-xl ring-1 ring-emerald-500/20">
          <div className="absolute inset-0 bg-[length:200%_100%] animate-shimmer bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent pointer-events-none" />
          <button onClick={dismiss} className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur transition hover:bg-white/20 hover:text-white/80" aria-label="Close">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/20">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Offer
            </span>
            <h2 className="mt-3 text-lg font-bold text-white">
              Starting at <span className="text-emerald-300">₹99</span>
            </h2>
            <p className="mt-1 text-xs text-white/60">
              Instant download · 7-day refund
            </p>
            <div className="mt-5 flex items-center justify-between">
              <div className="text-[11px] text-white/40 leading-tight">
                <span className="font-semibold text-emerald-400">Instant</span>
                <br />download
              </div>
              <Link href="/store" onClick={dismiss} data-track="store-dialog-browse"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-black transition hover:bg-emerald-50 active:scale-[0.97]"
              >
                Shop Now
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
