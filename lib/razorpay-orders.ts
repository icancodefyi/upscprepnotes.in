import { PRODUCTS } from "@/lib/store-products";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { generateDownloadToken, sendAdminNotification, sendOrderConfirmationEmail } from "@/lib/order-utils";
import { trackServer } from "@/lib/tracking/server";
import { getRazorpay } from "@/lib/razorpay";

export const MAX_ITEMS = 5;

/** Thrown for a bad cart. The message is safe to show to the buyer. */
export class OrderError extends Error {}

function shortRef() {
  return Date.now().toString(36).slice(-6) + Math.random().toString(36).slice(2, 6);
}

/**
 * Prices a cart from the product list. The browser only sends slugs; the price is never taken from it.
 * Same rules as the Dodo checkout: sellable products only, one copy of each.
 */
export function priceCart(slugs: unknown): { items: { slug: string; title: string; quantity: number; price: number }[]; total: number } {
  if (!Array.isArray(slugs) || slugs.length === 0) throw new OrderError("Your cart is empty.");
  if (slugs.length > MAX_ITEMS) throw new OrderError("Too many items in one order.");

  const seen = new Set<string>();
  const items: { slug: string; title: string; quantity: number; price: number }[] = [];
  let total = 0;
  for (const slug of slugs) {
    if (typeof slug !== "string") throw new OrderError("Invalid product in cart.");
    if (seen.has(slug)) throw new OrderError("The same product is in the cart twice.");
    seen.add(slug);
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product || product.comingSoon) throw new OrderError(`Product not found: ${slug}`);
    items.push({ slug, title: product.title, quantity: 1, price: product.price });
    total += product.price;
  }
  return { items, total };
}

/** Creates a pending order with a download token. Nothing is delivered until it is paid. */
export async function createPendingOrder(slugs: unknown, email?: string) {
  const { items, total } = priceCart(slugs);
  await connectDB();
  const ref = shortRef();
  const order = await OrderModel.create({
    provider: "razorpay",
    items,
    total,
    ref,
    downloadToken: generateDownloadToken(),
    email: email || undefined,
    status: "pending",
  });
  return { order, ref, total };
}

function buildDownloadUrl(token: string, items: { slug?: string }[]): string {
  const base = process.env.SITE_URL || "https://upscprepnotes.in";
  const firstSlug = items?.[0]?.slug;
  return `${base}/download/${token}${firstSlug ? `?slug=${firstSlug}` : ""}`;
}

export type MarkResult = "paid" | "already_paid" | "amount_mismatch" | "not_found";

/**
 * Marks a Razorpay order paid, exactly once. Safe to call from both the verify route and the webhook:
 * the second call finds the order already paid and does nothing.
 * Sends the buyer's download email and the admin notice only on the first successful call.
 */
export async function markOrderPaid(opts: { razorpayOrderId: string; paymentId: string; amountPaise: number; email?: string }): Promise<{ result: MarkResult; ref?: string }> {
  await connectDB();
  const order = await OrderModel.findOne({ razorpayOrderId: opts.razorpayOrderId });
  if (!order) return { result: "not_found" };

  if (order.status !== "pending") return { result: "already_paid", ref: order.ref };
  if (opts.amountPaise !== order.total * 100) {
    console.error(`[razorpay] amount mismatch for ${order.ref}: paid ${opts.amountPaise}, expected ${order.total * 100}`);
    return { result: "amount_mismatch", ref: order.ref };
  }

  // Only one caller can move the order from pending to paid.
  const updated = await OrderModel.findOneAndUpdate(
    { _id: order._id, status: "pending" },
    { status: "paid", razorpayPaymentId: opts.paymentId, email: opts.email || order.email },
    { new: true }
  );
  if (!updated) return { result: "already_paid", ref: order.ref };

  const to = updated.email || "";
  if (to) {
    try {
      await sendOrderConfirmationEmail(to, updated._id.toString(), updated.items, buildDownloadUrl(updated.downloadToken, updated.items));
    } catch (err) {
      console.error(`[razorpay] confirmation email failed for ${updated.ref}:`, err);
    }
  }
  try {
    await sendAdminNotification(to, updated.items, updated.total, "Razorpay");
  } catch (err) {
    console.error(`[razorpay] admin notification failed for ${updated.ref}:`, err);
  }
  await trackServer("purchase", {
    email: to,
    path: "/api/razorpay",
    props: { ref: updated.ref, total: updated.total, items: updated.items.map((i: { slug: string }) => i.slug), payment: opts.paymentId, provider: "razorpay" },
  });
  return { result: "paid", ref: updated.ref };
}

/** Asks Razorpay directly whether a payment was captured for this order and amount. Never trusts the browser. */
export async function fetchCapturedPayment(paymentId: string) {
  const p = await getRazorpay().payments.fetch(paymentId);
  return {
    status: p.status as string,
    orderId: p.order_id as string,
    amountPaise: Number(p.amount),
    email: (p.email as string) || "",
  };
}
