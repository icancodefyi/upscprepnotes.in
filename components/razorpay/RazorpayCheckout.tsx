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
  prefill?: { email?: string };
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color: string };
};
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Props = {
  /** Product slugs in the cart. The server sets every price. */
  slugs: string[];
  /** Shown in the payment window and on the button. */
  name: string;
  description: string;
  /** Total in rupees, for the button label only. The server calculates the amount it charges. */
  displayTotal: number;
};

/** Pays a cart through Razorpay Standard Checkout: create the order, open the modal, verify, then show the order page. */
export default function RazorpayCheckout({ slugs, name, description, displayTotal }: Props) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error" | "info"; text: string } | null>(null);

  function goToOrder(ref: string) {
    window.location.assign(`/store/success?ref=${encodeURIComponent(ref)}`);
  }

  async function pay() {
    setMessage(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) return setMessage({ tone: "error", text: "Enter the email where you want your download link." });
    if (!window.Razorpay) return setMessage({ tone: "error", text: "The payment window is still loading. Try again in a moment." });

    setBusy(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: slugs, email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBusy(false);
        return setMessage({ tone: "error", text: data.error || "Could not start the payment. Please try again." });
      }

      const RazorpayCtor = window.Razorpay;
      const rzp = new RazorpayCtor({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name,
        description,
        prefill: { email: cleanEmail },
        theme: { color: "#1f3fd6" },
        handler: async (response) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await v.json();
            if (v.ok && result.success) return goToOrder(data.ref);
            if (v.status === 202) return goToOrder(data.ref); // still capturing; the order page waits for it
            setBusy(false);
            setMessage({ tone: "error", text: "We could not confirm this payment yet. If money was taken, your download link will still arrive by email." });
          } catch {
            setBusy(false);
            setMessage({ tone: "error", text: "Network problem while confirming the payment. Check your email for the download link." });
          }
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
      <label className="block text-[14px] font-bold" htmlFor="rzp-email">Email for your download link</label>
      <input
        id="rzp-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[#c9cfdd] px-3 py-2.5 text-[15px]"
        placeholder="you@example.com"
      />
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="mt-4 rounded-xl bg-[#1f3fd6] px-5 py-3 text-[15px] font-bold text-white disabled:opacity-60"
      >
        {busy ? "Opening payment…" : `Pay ₹${displayTotal.toLocaleString("en-IN")}`}
      </button>
      {message && (
        <p role="status" className="mt-3 text-[14px]" style={{ color }}>
          {message.text}
        </p>
      )}
    </div>
  );
}
