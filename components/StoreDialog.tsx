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

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-zinc-100 hover:text-zinc-500" aria-label="Close">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

export default function StoreDialog() {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" onClick={dismiss} />

      {/* ───── STAGE 1: Browse Store ───── */}
      {stage === "browse" && (
        <div className="relative z-10 w-full max-w-sm animate-in fade-in duration-300">
          <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <CloseButton onClick={dismiss} />

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Popular</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-800">Premium UPSC Resources</p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-zinc-500">
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Strategy compilations & answer copies
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                GS notes bundles & test series
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                From ₹99 — lifetime access
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="text-[11px] text-zinc-400 leading-tight">
                <span className="font-semibold text-zinc-700">1,459+</span>
                <br />downloads this month
              </div>
              <Link href="/store" onClick={handleBrowse} data-track="store-dialog-browse"
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.97]"
              >
                Browse Store
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ───── STAGE 2: Email for 60% off coupon ───── */}
      {stage === "coupon" && (
        <div className="relative z-10 w-full max-w-sm animate-in fade-in duration-300">
          <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <CloseButton onClick={dismiss} />

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Exclusive Offer</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-800">Get 60% Off Everything</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
              Enter your email and get a one-time 60% off coupon code valid on every product in the store.
            </p>

            <form onSubmit={handleClaimCoupon} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 outline-none transition focus:border-zinc-400 placeholder:text-zinc-400"
                />
                <button type="submit" disabled={submitting}
                  className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Get Code"
                  )}
                </button>
              </div>
              {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
            </form>

            <p className="mt-3 text-[10px] text-zinc-400">One-time use · No spam · Unsubscribe anytime</p>
          </div>
        </div>
      )}

      {/* ───── STAGE 3: Coupon claimed ───── */}
      {stage === "claimed" && (
        <div className="relative z-10 w-full max-w-sm animate-in fade-in duration-300">
          <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <CloseButton onClick={dismiss} />

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Coupon Generated</p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-800">Your 60% Off Code is Ready</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400">One-time coupon</p>
              <p className="mt-0.5 select-all text-lg font-bold tracking-wider text-zinc-800">{couponCode}</p>
            </div>

            <p className="mt-2 text-[11px] text-zinc-400 text-center">Valid on all products. Enter at checkout.</p>

            <Link href={couponLink} onClick={dismiss} data-track="coupon-claimed-cta"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.97]"
            >
              Shop Now
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
