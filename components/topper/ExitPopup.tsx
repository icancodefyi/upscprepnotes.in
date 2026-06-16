"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExitPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let fired = false;
    const handler = (e: MouseEvent) => {
      if (fired || e.clientY > 10) return;
      fired = true;
      setShow(true);
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 sm:p-8">
        <button
          onClick={() => setShow(false)}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">Wait — before you go</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Get <strong className="text-gray-900">50+ topper answer copies</strong> including this one — GS1–4, Essay, Optional papers with marks.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 border-y border-black/[0.06] py-4">
          <div>
            <p className="text-3xl font-bold text-gray-900">₹799</p>
          </div>
          <div className="h-8 w-px bg-black/[0.08]" />
          <div className="text-left">
            <p className="text-xs text-gray-500 line-through">₹4,999</p>
            <p className="text-xs text-emerald-600 font-semibold">₹11 per copy</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <Link
            href="/store"
            onClick={() => setShow(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
            Pay ₹799 — Get Instant Access
          </Link>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-400">
          72 resources · 7-day refund · Lifetime access
        </p>
      </div>
    </div>
  );
}
