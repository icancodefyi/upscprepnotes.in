import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/razorpay-orders";

export const runtime = "nodejs";

/**
 * Razorpay's server-to-server notification. This is the source of truth for payments:
 * it arrives even if the buyer closed the browser before the verify call.
 * Configure it in the Razorpay dashboard with the events payment.captured, and set RAZORPAY_WEBHOOK_SECRET to the secret shown there.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });

  const raw = await request.text();
  const given = request.headers.get("x-razorpay-signature") || "";
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  if (!(a.length === b.length && timingSafeEqual(a, b))) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; email?: string } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "payment.captured") return NextResponse.json({ received: true });

  const p = event.payload?.payment?.entity;
  if (!p?.id || !p.order_id || typeof p.amount !== "number") {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  try {
    const result = await markOrderPaid({
      razorpayOrderId: p.order_id,
      paymentId: p.id,
      amountPaise: p.amount,
      email: p.email,
    });
    return NextResponse.json({ received: true, result: result.result });
  } catch (err) {
    console.error("razorpay webhook failed", err);
    // A 500 makes Razorpay retry the notification later.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
