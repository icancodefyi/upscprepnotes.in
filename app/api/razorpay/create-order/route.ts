import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

export const runtime = "nodejs";

/** Creates a Razorpay order. Amount is in paise (₹1 = 100 paise). */
export async function POST(req: Request) {
  let body: { amount?: unknown; receipt?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = body.amount;
  if (typeof amount !== "number" || !Number.isInteger(amount) || amount < 100) {
    return NextResponse.json({ error: "Amount must be a whole number of paise, at least 100" }, { status: 400 });
  }
  const receipt = typeof body.receipt === "string" && body.receipt.length <= 40 ? body.receipt : `rcpt_${Date.now()}`;

  try {
    const order = await getRazorpay().orders.create({ amount, currency: "INR", receipt });
    return NextResponse.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    const e = err as { statusCode?: number; message?: string; message2?: string };
    if (e.message === "RAZORPAY_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });
    }
    // Razorpay answers 401 when the key id or secret is wrong.
    if (e.statusCode === 401) {
      return NextResponse.json({ error: "Razorpay authentication failed. Check the API keys." }, { status: 401 });
    }
    console.error("razorpay create-order failed", e.statusCode, e.message);
    return NextResponse.json({ error: "Could not create the order. Please try again." }, { status: 500 });
  }
}
