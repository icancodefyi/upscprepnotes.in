"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STAGE_KEY = "store-toast-stage";
const COUPON_KEY = "store-coupon-code";
const EMAIL_KEY = "store-coupon-email";

function generateCoupon(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "UPSC60-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function StoreToast() {
  const [stage, setStage] = useState<"browse" | "coupon" | "claimed" | null>(null);
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedStage = localStorage.getItem(STAGE_KEY);
    const savedCoupon = localStorage.getItem(COUPON_KEY);

    if (savedStage === "claimed" && savedCoupon) {
      setCouponCode(savedCoupon);
      setStage("claimed");
      return;
    }

    if (savedStage === "coupon" || savedStage === "dismissed") {
      const timer = setTimeout(() => setStage("coupon"), 20000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setStage("browse"), 15000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setStage(null);
    if (stage === "browse") {
      localStorage.setItem(STAGE_KEY, "dismissed");
    }
  }

  function handleBrowse() {
    dismiss();
    localStorage.setItem(STAGE_KEY, "dismissed");
  }

  async function handleClaimCoupon(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setSubmitting(true);
    const code = generateCoupon();

    try {
      await fetch("/api/coupon/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, coupon: code }),
      });
    } catch {}

    localStorage.setItem(STAGE_KEY, "claimed");
    localStorage.setItem(COUPON_KEY, code);
    localStorage.setItem(EMAIL_KEY, email);
    setCouponCode(code);
    setStage("claimed");
    setSubmitting(false);
  }

  const couponLink = `/store?coupon=${couponCode}`;

  if (!stage) return null;

  /* ───── STAGE 1: Browse Store ───── */
  if (stage === "browse") {
    return (
      <div className="fixed bottom-0 right-0 left-0 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
        <div className="relative mx-3 sm:mx-0 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-emerald-400/5 blur-3xl" />

            <button
              onClick={dismiss}
              data-track="store-toast-dismiss"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur transition hover:bg-white/20 hover:text-white/80"
              aria-label="Dismiss"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-lg ring-1 ring-emerald-500/20">
                  📚
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Popular Right Now
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold tracking-tight text-white leading-tight">
                    Premium UPSC Resources
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs text-gray-400">
                <p className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  Strategy compilations &amp; answer copies
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  GS notes bundles &amp; test series
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  From ₹99 — lifetime access
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-[11px] text-gray-500 leading-tight">
                  <span className="font-semibold text-emerald-400">1,459+</span>
                  <br />
                  downloads this month
                </div>
                <Link
                  href="/store"
                  onClick={handleBrowse}
                  data-track="store-toast-cta"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30 active:scale-[0.97]"
                >
                  Browse Store →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───── STAGE 2: Email for 60% off coupon ───── */
  if (stage === "coupon") {
    return (
      <div className="fixed bottom-0 right-0 left-0 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
        <div className="relative mx-3 sm:mx-0 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-amber-400/10 blur-3xl" />

            <button
              onClick={dismiss}
              data-track="coupon-toast-dismiss"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur transition hover:bg-white/20 hover:text-white/80"
              aria-label="Dismiss"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-lg ring-1 ring-amber-500/20">
                  🎯
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Exclusive Offer
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold tracking-tight text-white leading-tight">
                    Get 60% Off Everything
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                Enter your email and get a one-time 60% off coupon code valid on every product in the store.
              </p>

              <form onSubmit={handleClaimCoupon} className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none ring-1 ring-white/5 transition focus:border-emerald-500/50 focus:ring-emerald-500/30"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-400/30 active:scale-[0.97] disabled:opacity-50"
                  >
                    {submitting ? "..." : "Get Code →"}
                  </button>
                </div>
                {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
              </form>

              <p className="mt-3 text-[10px] text-gray-600">
                One-time use · No spam · Unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───── STAGE 3: Coupon claimed ───── */
  return (
    <div className="fixed bottom-0 right-0 left-0 z-50 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="relative mx-3 sm:mx-0 animate-in slide-in-from-bottom-8 fade-in duration-500">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-[#0f172a] via-[#1a1a2e] to-[#16213e] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-amber-400/10 blur-3xl" />

          <button
            onClick={dismiss}
            data-track="coupon-claimed-dismiss"
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur transition hover:bg-white/20 hover:text-white/80"
            aria-label="Dismiss"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-lg ring-1 ring-emerald-500/20">
                🎉
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  Coupon Generated
                </p>
                <p className="mt-0.5 text-sm font-extrabold tracking-tight text-white leading-tight">
                  Your 60% Off Code is Ready
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-amber-400/80">One-time coupon</p>
              <p className="mt-0.5 select-all text-lg font-black tracking-wider text-amber-400">
                {couponCode}
              </p>
            </div>

            <p className="mt-2 text-[11px] text-gray-500 text-center">
              Valid on all products. Enter at checkout.
            </p>

            <Link
              href={couponLink}
              onClick={dismiss}
              data-track="coupon-claimed-cta"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30 active:scale-[0.97]"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
