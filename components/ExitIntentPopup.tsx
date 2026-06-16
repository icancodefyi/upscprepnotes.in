"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { IconStars } from "@tabler/icons-react";

const POPUP_HIDE_KEY = "exit_popup_hidden";

function getUtmParams(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utms: string[] = [];
  for (const key of utmKeys) {
    const val = params.get(key);
    if (val) utms.push(`${key}=${encodeURIComponent(val)}`);
  }
  utms.push("utm_source=exit_popup");
  return utms.length > 0 ? `?${utms.join("&")}` : "";
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [visitedSales, setVisitedSales] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    try { localStorage.setItem(POPUP_HIDE_KEY, "1"); } catch {}
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(POPUP_HIDE_KEY)) return;
      if (localStorage.getItem("visited_sales_page")) {
        startTransition(() => setVisitedSales(true));
      }
    } catch {}

    let fired = false;

    function handleMouseLeave(e: MouseEvent) {
      if (fired || dismissed || e.clientY > 0) return;
      fired = true;
      setVisible(true);
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [dismissed]);

  const utm = getUtmParams();
  const bundleUrl = `/store${utm}`;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 rounded-3xl bg-white shadow-xl">
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="px-6 pt-12 pb-6 text-center sm:px-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <IconStars size={28} className="text-emerald-600" />
          </div>

          {visitedSales ? (
            <>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Still Thinking?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                You checked the compilation — <strong className="text-gray-900">21 guides + topper copies + AI access</strong> for just ₹799. That is ₹11 per resource.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Wait! Check This Before You Go
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Get the <strong className="text-gray-900">Ultimate Compilation</strong> — 50+ answer copies, 21 strategy guides, interview prep, ethics cases, and AI access.
              </p>
            </>
          )}

          <div className="mt-5 flex items-baseline justify-center gap-2.5">
            <span className="text-3xl font-bold text-gray-900">₹799</span>
            <span className="text-sm text-gray-400 line-through">₹1,198</span>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">Save ₹399</span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => {
                dismiss();
                window.location.href = bundleUrl;
              }}
              data-track="exit-popup-cta"
              className="w-full rounded-full bg-emerald-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-500"
            >
              {visitedSales ? "Buy Now — ₹799" : "Claim Compilation at ₹799"}
            </button>
          </div>

          <button
            onClick={dismiss}
            className="mt-4 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            No thanks, I will continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
