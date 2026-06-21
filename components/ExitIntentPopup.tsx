"use client";

import { useEffect, useState, useCallback } from "react";

const POPUP_HIDE_KEY = "exit_popup_hidden";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    try { localStorage.setItem(POPUP_HIDE_KEY, "1"); } catch {}
  }, []);

  useEffect(() => {
    try { if (localStorage.getItem(POPUP_HIDE_KEY)) return; } catch {}

    let fired = false;

    function handleMouseLeave(e: MouseEvent) {
      if (fired || dismissed || e.clientY > 0) return;
      fired = true;
      setVisible(true);
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-black to-zinc-900" />
        <div className="absolute inset-0 bg-[length:200%_100%] animate-shimmer bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent pointer-events-none" />

        <button
          onClick={dismiss}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur transition hover:bg-white/20 hover:text-white/80"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="relative px-6 pt-12 pb-6 text-center sm:px-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30">
            <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/20">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Flash Sale
          </span>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
            All Products at <span className="text-emerald-300">₹99</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Limited Time Offer — Notes bundles, test series, teacher materials, and more.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => {
                dismiss();
                window.location.href = "/store";
              }}
              data-track="exit-popup-cta"
              className="w-full rounded-full bg-white py-3.5 text-sm font-bold text-black transition-colors hover:bg-emerald-50"
            >
              Shop Now — ₹99
            </button>
          </div>

          <button
            onClick={dismiss}
            className="mt-4 text-xs text-white/40 underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            No thanks, I will continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
