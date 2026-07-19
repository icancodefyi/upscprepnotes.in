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

  // DodoPayments API key
  checks.dodoApiKey = process.env.DODO_API_KEY ? "set" : "missing";
  if (!process.env.DODO_API_KEY) healthy = false;

  // PostHog
  checks.posthog = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ? "set" : "missing";

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
