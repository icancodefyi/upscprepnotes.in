"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
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
        body: JSON.stringify({
          items: checkoutItems,
          email: email || undefined,
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout creation failed");
      }

      const data = await res.json();

      if (email) {
        try { localStorage.setItem("upsc-email", email); } catch {}
        identify(email, "checkout");
      }

      track("checkout_redirect", { items: checkoutItems.map((i) => i.slug), amount, tracking });
      flush(true);
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }, [items, productSlug, amount, tracking]);

  const handlePay = useCallback(async () => {
    track("buy_click", { items: items?.map((i) => i.slug) || (productSlug ? [productSlug] : []), amount, tracking, has_email: !!effectiveEmail });
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

      {error && !showEmailPrompt && (
        <p className="mt-2 text-s text-[var(--mark-deep)]">{error}</p>
      )}

      {showEmailPrompt &&
        createPortal(
          <EmailDialog
            value={emailInput}
            onChange={setEmailInput}
            onSubmit={handleEmailSubmit}
            onClose={() => {
              setShowEmailPrompt(false);
              setError("");
            }}
            loading={loading}
            error={error}
          />,
          document.body,
        )}
    </>
  );
}

/** Asks once for the email the PDFs are sent to, then hands off to checkout. */
function EmailDialog({
  value,
  onChange,
  onSubmit,
  onClose,
  loading,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading: boolean;
  error: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    // The dialog is portalled but React events still bubble to the button's ancestors (often a card link): stop them here.
    <div
      className="up fixed inset-0 z-[120] flex items-end justify-center p-4 backdrop-blur-sm sm:items-center"
      style={{ background: "rgba(11,12,16,0.55)" }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label="Enter your email to continue"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="w-full max-w-[420px] rounded-[28px] bg-white p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] sm:p-7"
      >
        <p className="text-m font-bold text-[var(--ink)]">Enter your email to continue</p>
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="your@email.com"
          autoFocus
          className="mt-4 h-12 w-full rounded-full bg-white px-5 text-m text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] outline-none focus:shadow-[0_0_0_2px_var(--accent)]"
        />
        {error && <p className="mt-2 text-s text-[var(--mark-deep)]">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-blue mt-4 w-full justify-center">
          {loading ? "Processing..." : "Continue to Payment"}
        </button>
        <button type="button" onClick={onClose} className="mt-2 w-full py-2 text-s font-bold text-[var(--muted)] hover:text-[var(--ink)]">
          Cancel
        </button>
      </form>
    </div>
  );
}
