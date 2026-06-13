"use client";

import { useState, useEffect } from "react";
import UpiQrCode from "@/components/ui/UpiQrCode";

export default function StrategyPaywall({
  topperName,
  topperSlug,
  blurredCount,
}: {
  topperName: string;
  topperSlug: string;
  blurredCount: number;
}) {
  const [showPay, setShowPay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  if (blurredCount <= 0) return null;

  const upiUri = `upi://pay?pa=rakhangezaid8@pingpay&pn=UPSCPrepNotes&am=99&tn=Strategy%20Report%20-%20${encodeURIComponent(topperName)}&cu=INR`;

  return (
    <>
      <div className="relative mt-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 text-center">
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
          Locked
        </span>
        <p className="mt-2 text-sm font-bold text-gray-900">
          Full Strategy Report - ₹99
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Unlock the complete strategy, marks analysis, paper-wise breakdowns, and score deep dive. Delivered as a single PDF.
        </p>
        <button
          onClick={() => setShowPay(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
          data-track={`strategy-paywall-cta-${topperSlug}`}
        >
          Buy Full Report &rarr;
        </button>
      </div>

      {showPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowPay(false)}>
          <div
            className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPay(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-gray-900">{topperName} Strategy Report</h3>
            <p className="mt-1 text-sm text-gray-500">Pay ₹99 to get the full report as a PDF</p>

            <div className="mt-5">
              {isMobile ? (
                <a
                  href={upiUri}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                  Pay ₹99 via UPI
                </a>
              ) : (
                <div className="flex flex-col items-center">
                  <UpiQrCode upiId="rakhangezaid8@pingpay" amount={99} name="UPSCPrepNotes" note={`Strategy Report - ${topperName}`} size={180} />
                </div>
              )}
              <p className="mt-3 text-center text-xs text-gray-400">
                You will be redirected to your UPI app to complete the payment
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
