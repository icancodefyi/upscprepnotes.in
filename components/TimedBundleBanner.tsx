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
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/5">
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
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              <IconClock size={11} />
              <span>Limited</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-900">
            72 resources at <span className="text-emerald-600">₹11/copy</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-400">50+ topper copies + 21 guides + AI</p>

          <Link
            href="/store"
            onClick={dismiss}
            data-track="timed-banner"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Browse Store →
          </Link>
        </div>
      </div>
    </div>
  );
}
