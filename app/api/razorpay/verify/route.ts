import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Checks the signature Razorpay returns after a successful payment.
 * Signature = HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET).
 * Only a matching signature counts as paid. Orders are not marked paid here yet.
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
  const match = a.length === b.length && timingSafeEqual(a, b);

  if (!match) {
    return NextResponse.json({ success: false, error: "Signature does not match" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
