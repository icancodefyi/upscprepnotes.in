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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
            <span className="text-xl">🎉</span>
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">Great Weekend Sale!</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            All Products at <strong className="text-zinc-900">₹99</strong> — Biggest Sale Till Date.
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-4 text-center">
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Great Weekend Sale</p>
          <p className="mt-1 text-3xl font-bold text-white">₹99</p>
          <p className="text-xs text-emerald-200/80">All Products</p>
        </div>

        <div className="mt-5 space-y-2.5">
          <Link
            href="/store"
            onClick={() => setShow(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-400"
          >
            Shop Now &rarr;
          </Link>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-400">
          Biggest Sale Till Date · All Products at ₹99
        </p>
      </div>
    </div>
  );
}
