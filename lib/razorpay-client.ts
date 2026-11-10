/** Browser side of Razorpay Standard Checkout. Loads Razorpay's script once, on first use. */

export type RazorpayPaymentResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
export type RazorpayInstance = { open: () => void; on: (event: "payment.failed", cb: (r: { error: { description?: string } }) => void) => void };
export type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
let loading: Promise<void> | null = null;

export function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Payments can only load in the browser."));
  if (window.Razorpay) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loading = null;
        script.remove();
        reject(new Error("The payment window could not load. Check your connection and try again."));
      };
      document.body.appendChild(script);
    });
  }
  return loading;
}
