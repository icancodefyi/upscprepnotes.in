"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919152750079";
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
      if (localStorage.getItem("visited_sales_page")) setVisitedSales(true);
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
  const bundleUrl = `/toppers/toppers-copy-compilation${utm}`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi! I'm interested in the UPSC preparation bundle.")}`;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 rounded-3xl bg-white shadow-2xl">
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
            <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {visitedSales ? (
            <>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Still Thinking? Price Still ₹799
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                You checked the bundle — it&apos;s <strong className="text-gray-900">21 guides + topper copies + interview prep</strong> for just ₹799. Price moves to ₹4,999 soon.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Wait! Don&apos;t Miss This
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Get the <strong className="text-gray-900">Complete UPSC Preparation Bundle</strong> — 21 strategy guides, topper copies, interview prep & more.
              </p>
            </>
          )}

          <div className="mt-5 flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-gray-900">₹799</span>
            <span className="text-sm text-gray-400 line-through">₹4,999</span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">Save 84%</span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              onClick={() => {
                dismiss();
                window.location.href = bundleUrl;
              }}
              className="w-full rounded-full bg-gray-900 py-5 text-sm font-semibold shadow-lg shadow-gray-900/20 hover:bg-gray-800"
            >
              {visitedSales ? "Buy Now — ₹799 →" : "Claim Bundle at ₹799 →"}
            </Button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-800"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          <button
            onClick={dismiss}
            className="mt-4 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            No thanks, I&apos;ll continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
