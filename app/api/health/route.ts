import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";

export async function GET() {
  const checks: Record<string, string> = {};
  let healthy = true;

  // MongoDB
  try {
    await connectDB();
    checks.mongodb = "ok";
  } catch {
    checks.mongodb = "error";
    healthy = false;
  }

  // Razorpay keys (checkout and signature checks)
  checks.razorpayKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? "set" : "missing";
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) healthy = false;
  checks.razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ? "set" : "missing";
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) healthy = false;

  // Pending orders (stuck > 1 hour)
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const stuckCount = await OrderModel.countDocuments({
      status: "pending",
      createdAt: { $lt: oneHourAgo },
    });
    checks.stuckOrders = String(stuckCount);
    if (stuckCount > 0) checks.stuckOrdersWarning = `${stuckCount} orders pending for >1 hour`;
  } catch {
    checks.stuckOrders = "unknown";
  }

  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  );
}
