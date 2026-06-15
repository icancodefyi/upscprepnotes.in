"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const UPI_ID = "rakhangezaid8@pingpay";
const WHATSAPP = "919152750079";

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

  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi, I want the Complete Compilation (₹799). From: upscprepnotes.in. Please share payment details.")}`;

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
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-400">
          72 resources · 7-day refund · Lifetime access · UPI / GPay / PhonePe
        </p>
      </div>
    </div>
  );
}
