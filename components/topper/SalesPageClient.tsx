"use client";

import { useState, useEffect } from "react";
import PayButton from "@/components/ui/PayButton";
import { PRICE, PRODUCT_SLUG } from "./sales-page-data";

export default function SalesPageClient({ children }: { children: React.ReactNode }) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!previewImg) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setPreviewImg(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [previewImg]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("[data-preview-url]");
      if (btn) {
        const url = btn.getAttribute("data-preview-url");
        if (url) setPreviewImg(url);
        return;
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const toggle = target.closest("[data-faq-toggle]");
      if (toggle) {
        const idx = parseInt(toggle.getAttribute("data-faq-toggle")!, 10);
        setOpenFaq(prev => prev === idx ? null : idx);
        return;
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    document.querySelectorAll("[data-faq-answer]").forEach((el) => {
      const idx = parseInt(el.getAttribute("data-faq-answer")!, 10);
      el.classList.toggle("hidden", openFaq !== idx);
    });
    document.querySelectorAll("[data-faq-chevron]").forEach((el) => {
      const idx = parseInt(el.getAttribute("data-faq-chevron")!, 10);
      el.classList.toggle("rotate-180", openFaq === idx);
    });
  }, [openFaq]);

  useEffect(() => {
    const form = document.getElementById("samples-form") as HTMLFormElement;
    if (!form) return;
    const handler = async (e: Event) => {
      e.preventDefault();
      const email = (document.getElementById("samples-email") as HTMLInputElement).value;
      if (!email.trim()) return;
      const submit = document.getElementById("samples-submit") as HTMLButtonElement;
      const success = document.getElementById("samples-success");
      const error = document.getElementById("samples-error");
      submit.disabled = true;
      submit.textContent = "Sending...";
      try {
        const r = await fetch("/api/free-guides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "", email: email.trim() }) });
        if (!r.ok) { const d = await r.json(); throw new Error(d.error || "Failed"); }
        form.classList.add("hidden");
        success?.classList.remove("hidden");
      } catch (err: any) {
        error!.textContent = err.message;
        error?.classList.remove("hidden");
      } finally { submit.disabled = false; submit.textContent = "Get 3 Free Guides"; }
    };
    form.addEventListener("submit", handler);
    return () => form.removeEventListener("submit", handler);
  }, []);



  return (
    <>
      {/* LiveCounter - rendered as a hidden element for client hydration */}
      <div id="live-counter-root" className="hidden" />

      {children}

      {/* Preview lightbox */}
      {previewImg && (
        <div className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-[rgba(11,12,16,0.75)] p-4" onClick={() => setPreviewImg(null)}>
          <button onClick={() => setPreviewImg(null)} aria-label="Close preview" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-[var(--ink)]">
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewImg} alt="Preview" className="max-h-[90vh] max-w-[92vw] rounded-[8px] bg-white object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-[520px] items-center justify-between gap-3 rounded-full bg-[var(--ink)] py-2 pl-5 pr-2 text-white shadow-[0_12px_30px_-10px_rgba(11,12,16,0.6)]">
          <div className="flex flex-col leading-tight">
            <span className="tab text-m font-bold">₹{PRICE}</span>
            <span className="text-s text-white/60">63 answer copies · 7-day refund</span>
          </div>
          <PayButton amount={PRICE} productSlug={PRODUCT_SLUG} tracking="dodo-mobile-sticky" className="btn btn-blue h-11 px-5 [--btn-fs:14px]">
            Get the Compilation →
          </PayButton>
        </div>
      </div>
    </>
  );
}
