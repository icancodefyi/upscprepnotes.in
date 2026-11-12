"use client";

import posthog from "posthog-js";
import { useState, useCallback, useEffect } from "react";
import { track, flush, identify, getSessionId, getVisitorId } from "@/lib/track";
import { loadRazorpay, type RazorpayPaymentResponse } from "@/lib/razorpay-client";

interface CartItem {
  slug: string;
  quantity: number;
  price: number;
}

interface Props {
  amount: number;
  note?: string;
  className?: string;
  tracking?: string;
  items?: CartItem[];
  productSlug?: string;
  children?: React.ReactNode;
  email?: string;
}

function getStoredEmail(): string {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem("upsc-email") || ""; } catch { return ""; }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * One click opens the Razorpay payment window on this page. The server sets the price from the
 * product list, saves the order, and delivers the files after payment (webhook plus the order page).
 * If we already know the buyer's email (a form or an earlier purchase) it is pre-filled; otherwise
 * the payment window asks for it.
 */
export default function PayButton({
  amount,
  note,
  className = "",
  tracking,
  items,
  productSlug,
  children,
  email: propEmail,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // The email is compulsory before the payment window opens: it is how the buyer gets the file and any follow-up.
  const [saved, setSaved] = useState("");
  const [typed, setTyped] = useState("");
  useEffect(() => {
    setSaved(getStoredEmail());
  }, []);

  // Coming back to this page with the browser's back button can restore a stuck spinner. Reset it.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const handlePay = useCallback(async () => {
    const checkoutItems = items || (productSlug ? [{ slug: productSlug, quantity: 1, price: amount }] : []);
    const slugs = checkoutItems.map((i) => i.slug);
    const knownEmail = (propEmail || typed || saved || getStoredEmail()).trim().toLowerCase();
    const prefill = EMAIL_RE.test(knownEmail) ? knownEmail : "";
    if (!prefill) {
      setError("Please enter your email first. The download link is sent there.");
      return;
    }
    try {
      localStorage.setItem("upsc-email", prefill);
    } catch {}

    track("buy_click", { items: slugs, amount, tracking, has_email: !!prefill });
    posthog.capture("cart_checkout_clicked", { total_amount: amount, item_slugs: slugs, item_count: checkoutItems.length, tracking });

    if (checkoutItems.length === 0) {
      setError("Nothing to check out. Please refresh the page and try again.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    let status = 0;
    try {
      await loadRazorpay();

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: slugs,
          email: prefill || undefined,
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
        }),
      });
      status = res.status;
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.order_id) {
        throw new Error(data.error || "Payment could not be started");
      }

      if (prefill) identify(prefill, "checkout");
      track("checkout_redirect", { items: slugs, amount, tracking });
      flush(true);

      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) throw new Error("The payment window could not load. Please try again.");

      const rzp = new RazorpayCtor({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "UPSCPrepNotes",
        description: note || "Study material",
        prefill: prefill ? { email: prefill } : undefined,
        theme: { color: "#1f3fd6" },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            // 202 means the bank is still capturing the payment; the order page waits for it.
            if ((v.ok && (await v.json()).success) || v.status === 202) {
              window.location.assign(`/store/success?ref=${encodeURIComponent(data.ref)}`);
              return;
            }
            setLoading(false);
            setError("We could not confirm this payment yet. If money was taken, your download link will still arrive by email.");
          } catch {
            setLoading(false);
            setError("Network problem while confirming the payment. Check your email for the download link.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setNotice("Payment cancelled. You have not been charged.");
          },
        },
      });
      rzp.on("payment.failed", (r) => {
        setLoading(false);
        setError(r.error.description || "The payment failed. Please try another method.");
      });
      rzp.open();
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown";
      posthog.capture("checkout_failed", { item_slugs: slugs, total_amount: amount, tracking, status, reason });
      track("checkout_failed", { items: slugs, amount, tracking, status, reason });
      setError(
        reason.startsWith("Payment could not") || reason.includes("payment window")
          ? reason
          : "We couldn't open the payment window. Please tap the button again, or email hello@upscprepnotes.in.",
      );
      setLoading(false);
    }
  }, [items, productSlug, amount, tracking, propEmail, note, typed, saved]);

  const current = (propEmail || typed || saved).trim();
  const emailOk = EMAIL_RE.test(current);

  return (
    <>
      {!propEmail && !saved && (
        <label className="mb-2.5 block">
          <span className="block text-s font-bold text-[var(--ink)]">Your email <span className="text-[var(--mark-deep)]" aria-hidden="true">*</span><span className="sr-only"> (compulsory)</span></span>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-required="true"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="We send your download link here"
            className="mt-1.5 h-12 w-full rounded-full bg-white px-5 text-m text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] outline-none placeholder:text-[var(--muted)] focus:shadow-[0_0_0_2px_var(--accent)]"
          />
        </label>
      )}
      <button
        type="button"
        onClick={handlePay}
        data-track={tracking}
        disabled={loading || (!propEmail && !saved && !emailOk)}
        aria-busy={loading}
        className={className}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Opening payment…
          </span>
        ) : (
          children || `Pay ₹${amount}`
        )}
      </button>

      {notice && !error && (
        <p role="status" className="mt-2 text-s text-[var(--ink-2)]">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-s font-bold text-[var(--mark-deep)]">
          {error}
        </p>
      )}
    </>
  );
}
