"use client";

import { useState, useCallback } from "react";

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
}

export default function PayButton({
  amount,
  note,
  className = "",
  tracking,
  items,
  productSlug,
  children,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = useCallback(async () => {
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
        body: JSON.stringify({ items: checkoutItems }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout creation failed");
      }

      const data = await res.json();

      const { DodoPayments } = await import("dodopayments-checkout");
      DodoPayments.Initialize({
        mode: "live",
        displayType: "overlay",
      });
      DodoPayments.Checkout.open({ checkoutUrl: data.checkoutUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [items, productSlug, amount]);

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
