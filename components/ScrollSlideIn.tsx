"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const HIDE_KEY = "slide_in_hidden";

export default function ScrollSlideIn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem(HIDE_KEY)) return; } catch {}

    let fired = false;

    function handleScroll() {
      if (fired) return;
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.6) {
        fired = true;
        setVisible(true);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(HIDE_KEY, "1"); } catch {}
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 animate-in slide-in-from-bottom-8 fade-in duration-500 sm:left-auto sm:right-6 sm:w-80">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 shadow-xl ring-1 ring-emerald-500/20">
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/20">
            Great Weekend Sale
          </span>

          <div className="mt-3">
            <p className="text-sm font-bold text-white">
              All Products at <span className="text-emerald-300">₹99</span>
            </p>
            <p className="text-xs text-white/60">Biggest Sale Till Date</p>
          </div>

          <Link
            href="/store"
            onClick={dismiss}
            data-track="scroll-slide-in"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2.5 text-xs font-bold text-black transition-colors hover:bg-emerald-50"
          >
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
