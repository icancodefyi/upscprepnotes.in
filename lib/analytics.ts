"use client";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type Item = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
};

export function gtagEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, params);
}

export function trackViewItem(productName: string, productPrice: number) {
  gtagEvent("view_item", {
    currency: "INR",
    value: productPrice,
    items: [{ item_id: productName, item_name: productName, price: productPrice, quantity: 1 } satisfies Item],
  });
}

export function trackAddToCart(productName: string, productPrice: number) {
  gtagEvent("add_to_cart", {
    currency: "INR",
    value: productPrice,
    items: [{ item_id: productName, item_name: productName, price: productPrice, quantity: 1 } satisfies Item],
  });
}

export function trackBeginCheckout(productName: string, productPrice: number) {
  gtagEvent("begin_checkout", {
    currency: "INR",
    value: productPrice,
    items: [{ item_id: productName, item_name: productName, price: productPrice, quantity: 1 } satisfies Item],
  });
}

export function trackAddPaymentInfo(productName: string, productPrice: number) {
  gtagEvent("add_payment_info", {
    currency: "INR",
    value: productPrice,
    payment_type: "UPI",
    items: [{ item_id: productName, item_name: productName, price: productPrice, quantity: 1 } satisfies Item],
  });
}

export function trackPurchase(
  productName: string,
  productPrice: number,
  transactionId: string
) {
  gtagEvent("purchase", {
    currency: "INR",
    value: productPrice,
    transaction_id: transactionId,
    items: [{ item_id: productName, item_name: productName, price: productPrice, quantity: 1 } satisfies Item],
  });
}

export function trackGenerateLead() {
  gtagEvent("generate_lead", { value: 1 });
}

export function trackEvent(action: string, label?: string) {
  gtagEvent(action, { event_label: label || action });
}
