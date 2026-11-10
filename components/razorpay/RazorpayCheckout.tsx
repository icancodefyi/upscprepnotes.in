"use client";

import Script from "next/script";
import { useState } from "react";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayFailure = { error: { description?: string; code?: string } };
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", cb: (r: RazorpayFailure) => void) => void };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color: string };
};
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type Props = { amountPaise: number; name: string; description: string; receipt?: string };

/** Pays one amount through Razorpay Standard Checkout: create order, open the modal, verify the signature. */
export default function RazorpayCheckout({ amountPaise, name, description, receipt }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error" | "info"; text: string } | null>(null);
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  async function pay() {
    setMessage(null);
    if (!keyId) return setMessage({ tone: "error", text: "Payments are not configured." });
    if (!window.Razorpay) return setMessage({ tone: "error", text: "The payment window is still loading. Try again in a moment." });

    setBusy(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise, receipt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBusy(false);
        return setMessage({ tone: "error", text: data.error || "Could not start the payment. Please try again." });
      }

      const RazorpayCtor = window.Razorpay;
      const rzp = new RazorpayCtor({
        key: keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name,
        description,
        theme: { color: "#1f3fd6" },
        handler: async (response) => {
          const v = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const result = await v.json();
          setBusy(false);
          if (v.ok && result.success) setMessage({ tone: "ok", text: `Payment received. Reference ${response.razorpay_payment_id}.` });
          else setMessage({ tone: "error", text: "We could not confirm this payment. Contact us with your payment reference." });
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setMessage({ tone: "info", text: "Payment cancelled. You have not been charged." });
          },
        },
      });
      rzp.on("payment.failed", (r) => {
        setBusy(false);
        setMessage({ tone: "error", text: r.error.description || "The payment failed. Please try another method." });
      });
      rzp.open();
    } catch {
      setBusy(false);
      setMessage({ tone: "error", text: "Network problem. Please try again." });
    }
  }

  const color = message?.tone === "ok" ? "#1a8a4a" : message?.tone === "error" ? "#b42318" : "#3f4450";

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="rounded-xl bg-[#1f3fd6] px-5 py-3 text-[15px] font-bold text-white disabled:opacity-60"
      >
        {busy ? "Opening payment…" : `Pay ₹${(amountPaise / 100).toLocaleString("en-IN")}`}
      </button>
      {message && (
        <p role="status" className="mt-3 text-[14px]" style={{ color }}>
          {message.text}
        </p>
      )}
    </div>
  );
}
