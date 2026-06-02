"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const HIDE_KEY = "slide_in_hidden";

export default function ScrollSlideIn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(HIDE_KEY)) return;
    } catch {}

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
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/10">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="p-4 pr-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">₹</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">UPSC Prep Bundle</p>
              <p className="text-xs text-gray-400">21 guides + topper copies</p>
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">₹799</span>
            <span className="text-xs text-gray-400 line-through">₹4,999</span>
          </div>

          <Link
            href="/toppers/toppers-copy-compilation"
            onClick={dismiss}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            Get the Bundle →
          </Link>
        </div>
      </div>
    </div>
  );
}
