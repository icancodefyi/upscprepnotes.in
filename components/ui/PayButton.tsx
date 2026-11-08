"use client";

import posthog from "posthog-js";
import { useState, useCallback, useEffect } from "react";
import { track, flush, identify, getSessionId, getVisitorId } from "@/lib/track";

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

// If the checkout link has not come back by then, stop the spinner and let the buyer retry.
const CHECKOUT_TIMEOUT_MS = 20000;

function getStoredEmail(): string {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem("upsc-email") || ""; } catch { return ""; }
}

/**
 * One click to the payment page. Dodo's checkout asks for the email, and the payment
 * webhook delivers the files to it, so there is no email step on our side. A known
 * email (from a form or an earlier purchase) is passed along so Dodo can pre-fill it.
 */
export default function PayButton({
  amount,
  className = "",
  tracking,
  items,
  productSlug,
  children,
  email: propEmail,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Coming back from the payment page with the browser's back button restores this page
  // from cache with the spinner still on. Reset it so the button works again.
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
    const email = propEmail || getStoredEmail();

    track("buy_click", { items: slugs, amount, tracking, has_email: !!email });
    posthog.capture("cart_checkout_clicked", { total_amount: amount, item_slugs: slugs, item_count: checkoutItems.length, tracking });

    if (checkoutItems.length === 0) {
      setError("Nothing to check out. Please refresh the page and try again.");
      return;
    }

    setLoading(true);
    setError("");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHECKOUT_TIMEOUT_MS);
    let status = 0;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          items: checkoutItems,
          email: email || undefined,
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
        }),
      });
      status = res.status;
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Checkout could not be opened");
      }

      if (email) identify(email, "checkout");
      track("checkout_redirect", { items: slugs, amount, tracking });
      flush(true);
      window.location.href = data.checkoutUrl;
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "AbortError";
      const reason = timedOut ? "timeout" : err instanceof Error ? err.message : "unknown";
      posthog.capture("checkout_failed", { item_slugs: slugs, total_amount: amount, tracking, status, reason });
      track("checkout_failed", { items: slugs, amount, tracking, status, reason });
      setError(
        timedOut
          ? "The payment page is taking too long to open. Please tap the button again."
          : "We couldn't open the payment page. Please tap the button again, or email hello@upscprepnotes.in.",
      );
      setLoading(false);
    } finally {
      clearTimeout(timer);
    }
  }, [items, productSlug, amount, tracking, propEmail]);

  return (
    <>
      <button
        type="button"
        onClick={handlePay}
        data-track={tracking}
        disabled={loading}
        aria-busy={loading}
        className={className}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Opening checkout…
          </span>
        ) : (
          children || `Pay ₹${amount}`
        )}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-s font-bold text-[var(--mark-deep)]">
          {error}
        </p>
      )}
    </>
  );
}
