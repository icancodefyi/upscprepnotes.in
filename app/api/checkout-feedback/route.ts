import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { LEAVE_REASONS, SITE, verifyEmailToken, type LeaveReason } from "@/lib/email-links";

export const runtime = "nodejs";

/** One tap from the reminder email: saves why the person left, then shows a thank-you page. */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const orderId = q.get("o") ?? "";
  const reason = q.get("r") as LeaveReason;
  const token = q.get("t") ?? "";
  const back = (path: string) => NextResponse.redirect(`${SITE}${path}`, 303);

  if (!/^[a-f0-9]{24}$/i.test(orderId) || !LEAVE_REASONS.includes(reason) || !verifyEmailToken(`co:${orderId}:${reason}`, token)) {
    return back("/store");
  }
  try {
    await connectDB();
    const order = await OrderModel.findById(orderId, { items: 1, status: 1 }).lean<{ items?: { slug: string }[]; status?: string }>();
    if (!order) return back("/store");
    // Only a pending order records an answer; a paid one just says thanks.
    if (order.status === "pending") {
      await OrderModel.updateOne({ _id: orderId, status: "pending" }, { $set: { leftReason: reason, leftReasonAt: new Date() } });
    }
    const slug = order.items?.[0]?.slug ?? "";
    return back(`/store/feedback-thanks?r=${reason}${slug ? `&p=${encodeURIComponent(slug)}` : ""}`);
  } catch {
    return back("/store");
  }
}
