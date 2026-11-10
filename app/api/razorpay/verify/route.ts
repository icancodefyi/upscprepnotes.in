import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { fetchCapturedPayment, markOrderPaid } from "@/lib/razorpay-orders";

export const runtime = "nodejs";

/**
 * Called by the browser after the Razorpay modal succeeds.
 * 1. Checks the HMAC signature of order_id|payment_id.
 * 2. Asks Razorpay whether that payment was captured for this order and the right amount.
 * 3. Marks the order paid (idempotent; the webhook does the same if the buyer closed the tab).
 * Returns 202 while the payment is still being captured, so the page can wait for the email.
 */
export async function POST(req: Request) {
  let body: { razorpay_order_id?: unknown; razorpay_payment_id?: unknown; razorpay_signature?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (typeof razorpay_order_id !== "string" || typeof razorpay_payment_id !== "string" || typeof razorpay_signature !== "string") {
    return NextResponse.json({ success: false, error: "Missing payment fields" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ success: false, error: "Payments are not configured" }, { status: 500 });

  const expected = createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (!(a.length === b.length && timingSafeEqual(a, b))) {
    return NextResponse.json({ success: false, error: "Signature does not match" }, { status: 400 });
  }

  await connectDB();
  const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

  try {
    const payment = await fetchCapturedPayment(razorpay_payment_id);
    if (payment.orderId !== razorpay_order_id) {
      return NextResponse.json({ success: false, error: "Payment does not belong to this order" }, { status: 400 });
    }
    if (payment.status !== "captured") {
      // Authorised but not yet captured: the webhook will finish the order when Razorpay captures it.
      return NextResponse.json({ success: false, pending: true, ref: order.ref }, { status: 202 });
    }
    const result = await markOrderPaid({
      razorpayOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amountPaise: payment.amountPaise,
      email: payment.email || order.email,
    });
    if (result.result === "amount_mismatch") {
      return NextResponse.json({ success: false, error: "Amount does not match the order" }, { status: 400 });
    }
    return NextResponse.json({ success: true, ref: result.ref });
  } catch (err) {
    // Razorpay answers 400 for a payment ID it does not know: treat that as a bad request, not a server fault.
    if ((err as { statusCode?: number }).statusCode === 400) {
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 400 });
    }
    console.error("razorpay verify failed", err);
    return NextResponse.json({ success: false, error: "Could not confirm the payment" }, { status: 500 });
  }
}
