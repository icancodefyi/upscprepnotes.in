"use client";

import { useState, useEffect } from "react";
import PayButton from "@/components/ui/PayButton";
import { trackViewItem } from "@/lib/analytics";
import { trackClientEvent } from "@/lib/client-analytics";
import { WHATSAPP_NUMBER, SITE, TIER, PRICE } from "./sales-page-data";

export default function SalesPageClient({ children }: { children: React.ReactNode }) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    trackViewItem("Topper Answer Copy Compilation", PRICE);
  }, []);

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
        try { window.gtag?.("event", "generate_lead", { event_label: "samples-form" }); } catch {}
      } catch (err: any) {
        error!.textContent = err.message;
        error?.classList.remove("hidden");
      } finally { submit.disabled = false; submit.textContent = "Get 3 Free Guides"; }
    };
    form.addEventListener("submit", handler);
    return () => form.removeEventListener("submit", handler);
  }, []);

  useEffect(() => {
    const form = document.getElementById("payment-form") as HTMLFormElement;
    if (!form) return;
    const handler = async (e: Event) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const submit = document.getElementById("payment-submit") as HTMLButtonElement;
      const success = document.getElementById("payment-success");
      submit.disabled = true;
      submit.textContent = "Processing...";
      try {
        const r = await fetch("/api/customer", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name, email: data.email, utr: data.utr, product: "Ultimate Compilation", amount: PRICE, screenshotUrl: "" }),
        });
        if (!r.ok) throw new Error("Failed");
        form.innerHTML = `<div class="text-center py-8"><div class="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg></div><p class="font-bold text-gray-900">Payment Received!</p><p class="text-sm text-gray-500 mt-1">We will email your download link within 2 hours.</p></div>`;
        try { window.gtag?.("event", "purchase", { transaction_id: data.email, value: PRICE, currency: "INR" }); } catch {}
      } catch {
        const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I paid for "${TIER}" on ${SITE}. UTR: ${data.utr}. Email: ${data.email}. Please send the download link.`)}`;
        window.open(wa, "_blank");
      } finally { submit.disabled = false; submit.textContent = "Confirm Payment — Get Download Link"; }
    };
    form.addEventListener("submit", handler);
    return () => form.removeEventListener("submit", handler);
  }, []);

  function trackWA(tier: string, location: string) {
    trackClientEvent("whatsapp_click", { tier, location });
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("[data-track^='whatsapp']");
      if (link) {
        const href = (link as HTMLAnchorElement).href || "";
        const tier = href.includes("Ultimate") ? TIER : TIER;
        trackWA(tier, link.getAttribute("data-track") || "unknown");
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      {/* LiveCounter - rendered as a hidden element for client hydration */}
      <div id="live-counter-root" className="hidden" />

      {children}

      {/* Preview lightbox */}
      {previewImg && (
        <div className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setPreviewImg(null)}>
          <button onClick={() => setPreviewImg(null)} className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <img src={previewImg} alt="Preview" className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Mobile Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900">₹{PRICE}</span>
            <span className="text-[10px] text-gray-400">72 resources · 7-day refund</span>
          </div>
          <PayButton amount={PRICE} tracking="upi-mobile-sticky" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 active:scale-[0.97]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            Get the Compilation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </PayButton>
        </div>
      </div>
    </>
  );
}
