import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { createPendingOrder, OrderError } from "@/lib/razorpay-orders";
import { EMAIL_RE } from "@/lib/handoff";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackServer } from "@/lib/tracking/server";

export const runtime = "nodejs";

/**
 * Starts a purchase: saves a pending order priced from the product list, then creates the Razorpay order
 * for that exact amount. The browser sends product slugs and an email, never a price.
 */
export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;

  let body: { items?: unknown; email?: unknown; visitorId?: unknown; sessionId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Optional: the payment window asks for the email if we don't have it. Delivery uses whichever we get.
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const { order, ref, total } = await createPendingOrder(body.items, email || undefined);

    const rzpOrder = await getRazorpay().orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: ref,
      notes: { ref, orderId: order._id.toString() },
    });
    order.razorpayOrderId = rzpOrder.id;
    if (typeof body.visitorId === "string") order.visitorId = body.visitorId.slice(0, 64);
    if (typeof body.sessionId === "string") order.sessionId = body.sessionId.slice(0, 64);
    await order.save();

    await trackServer("checkout_started", {
      visitorId: typeof body.visitorId === "string" ? body.visitorId : undefined,
      sessionId: typeof body.sessionId === "string" ? body.sessionId : undefined,
      email: email || undefined,
      path: "/api/razorpay/create-order",
      props: { ref, total, items: order.items.map((i: { slug: string }) => i.slug), provider: "razorpay" },
    });

    return NextResponse.json({
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      ref,
    });
  } catch (err) {
    if (err instanceof OrderError) return NextResponse.json({ error: err.message }, { status: 400 });
    const e = err as { statusCode?: number; message?: string };
    if (e.message === "RAZORPAY_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Payments are not configured." }, { status: 500 });
    }
    if (e.statusCode === 401) {
      return NextResponse.json({ error: "Razorpay authentication failed. Check the API keys." }, { status: 401 });
    }
    console.error("razorpay create-order failed", e.statusCode, e.message);
    return NextResponse.json({ error: "Could not start the payment. Please try again." }, { status: 500 });
  }
}
