import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkRateLimit } from "@/lib/rate-limit";
import { OrderModel } from "@/models/order.model";

export const runtime = "nodejs";

/**
 * Records what happened in the payment window for a pending order: the payment failed, or the window was closed.
 * It only ever appends to an order that is still pending, so it cannot touch a paid order.
 */
export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;
  try {
    const body = await request.json();
    const ref = typeof body.ref === "string" ? body.ref.trim() : "";
    const kind = body.kind === "failed" || body.kind === "dismissed" ? body.kind : "";
    if (!/^[a-z0-9]{6,20}$/i.test(ref) || !kind) return new NextResponse(null, { status: 400 });
    const reason = typeof body.reason === "string" ? body.reason.replace(/[\u0000-\u001f<>]/g, "").slice(0, 200) : undefined;
    await connectDB();
    await OrderModel.updateOne(
      { ref, status: "pending" },
      { $push: { payAttempts: { $each: [{ at: new Date(), kind, reason }], $slice: -10 } } },
    );
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
