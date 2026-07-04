import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;
  try {
    const ref = request.nextUrl.searchParams.get("ref");
    const token = request.nextUrl.searchParams.get("token");
    const sessionId = request.nextUrl.searchParams.get("session_id");

    await connectDB();

    let order;

    if (ref) {
      order = await OrderModel.findOne({
        $or: [
          { ref },
          ...(ref.length === 24 ? [{ _id: ref }] : []),
          { dodoSessionId: ref },
          { downloadToken: ref },
        ],
      });
    }

    if (token) {
      order = await OrderModel.findOne({ downloadToken: token });
    }

    if (sessionId) {
      order = await OrderModel.findOne({ dodoSessionId: sessionId });
    }

    if (!order) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      status: order.status,
      items: order.items,
      total: order.total,
      email: order.email,
      downloadToken: order.downloadToken,
      orderId: order._id.toString().slice(-8).toUpperCase(),
      createdAt: order.createdAt,
    });
  } catch (err) {
    console.error("Order status error:", err);
    return NextResponse.json({ error: "Failed to check order" }, { status: 500 });
  }
}
