"use client";

import { useState, useCallback } from "react";
import posthog from "posthog-js";

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
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const storedEmail = getStoredEmail();
  const effectiveEmail = propEmail || storedEmail;

  const proceedToCheckout = useCallback(async (email: string) => {
    setLoading(true);
    setError("");

    try {
      const checkoutItems = items || (productSlug ? [{ slug: productSlug, quantity: 1, price: amount }] : []);
      if (checkoutItems.length === 0) {
        setError("No items to checkout");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems, email: email || undefined }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout creation failed");
      }

      const data = await res.json();

      if (email) {
        try { localStorage.setItem("upsc-email", email); } catch {}
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }, [items, productSlug, amount]);

  const handlePay = useCallback(async () => {
    posthog.capture("cart_checkout_clicked", {
      total_amount: amount,
      item_slugs: items?.map((i) => i.slug) || (productSlug ? [productSlug] : []),
      item_count: items?.length || (productSlug ? 1 : 0),
      tracking,
    });
    if (!effectiveEmail) {
      setShowEmailPrompt(true);
      return;
    }
    await proceedToCheckout(effectiveEmail);
  }, [effectiveEmail, proceedToCheckout, amount, items, productSlug, tracking]);

  const handleEmailSubmit = useCallback(async () => {
    const trimmed = emailInput.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email");
      return;
    }
    setShowEmailPrompt(false);
    setError("");
    await proceedToCheckout(trimmed);
  }, [emailInput, proceedToCheckout]);

  if (showEmailPrompt) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">Enter your email to continue</p>
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="your@email.com"
          autoFocus
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
          onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubmit(); }}
        />
        <button
          type="button"
          onClick={handleEmailSubmit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePay}
        data-track={tracking}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Opening Checkout...
          </span>
        ) : (
          children || `Pay ₹${amount}`
        )}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </>
  );
}
