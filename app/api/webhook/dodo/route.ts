import { NextRequest, NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { generateDownloadToken, sendOrderConfirmationEmail, sendAdminNotification } from "@/lib/order-utils";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.DODO_ENVIRONMENT as "test_mode" | "live_mode") || "live_mode",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (event.type !== "payment.succeeded") {
      return NextResponse.json({ received: true });
    }

    const paymentData = event.data || {};
    const sessionId = paymentData.checkout_session_id || paymentData.session_id;
    const paymentId = paymentData.id || paymentData.payment_id;
    const metadata = paymentData.metadata || {};

    if (!sessionId) {
      console.error("No session_id in webhook");
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    await connectDB();

    let customerEmail = paymentData.customer?.email || paymentData.email || "";
    let total = paymentData.amount ? Math.round(paymentData.amount / 100) : 0;

    if (!customerEmail || !total) {
      try {
        const payment = await dodo.payments.retrieve(paymentId).catch(() => null);
        if (payment) {
          customerEmail = customerEmail || (payment as any).customer?.email || "";
          const paid = payment.total_amount || (payment as any).amount || 0;
          total = total || Math.round(paid / 100);
        }
      } catch {
        console.error("Failed to retrieve payment");
      }
    }

    const existing = await OrderModel.findOne({ dodoSessionId: sessionId });
    if (existing) {
      if (existing.status === "pending") {
        const downloadUrl = `https://upscprepnotes.in/api/download/${existing.downloadToken}`;
        await OrderModel.findByIdAndUpdate(existing._id, {
          status: "paid",
          email: customerEmail || existing.email,
          dodoPaymentId: paymentId,
        });
        if (customerEmail) {
          try {
            await sendOrderConfirmationEmail(customerEmail, existing._id.toString().slice(-8).toUpperCase(), existing.items, downloadUrl);
          } catch (err) {
            console.error("Failed to send confirmation email:", err);
          }
        }
        try {
          await sendAdminNotification(customerEmail, existing.items, existing.total);
        } catch (err) {
          console.error("Admin notification failed:", err);
        }
      }
      return NextResponse.json({ received: true, orderId: existing._id });
    }

    let items: { slug: string; quantity: number; price: number; title: string }[];
    try {
      items = JSON.parse(metadata.items || "[]");
    } catch {
      items = [];
    }

    if (items.length === 0) {
      items = [{ slug: "unknown", quantity: 1, price: total, title: "Store Purchase" }];
    }

    const { generateDownloadToken } = await import("@/lib/order-utils");
    const downloadToken = generateDownloadToken();
    const order = await OrderModel.create({
      email: customerEmail || "unknown@checkout",
      items,
      total,
      ref: metadata.ref || "",
      dodoSessionId: sessionId,
      dodoPaymentId: paymentId,
      downloadToken,
      status: "paid",
    });

    const downloadUrl = `https://upscprepnotes.in/api/download/${downloadToken}`;

    if (customerEmail) {
      try {
        await sendOrderConfirmationEmail(customerEmail, order._id.toString().slice(-8).toUpperCase(), items, downloadUrl);
      } catch (err) {
        console.error("Failed to send confirmation email:", err);
      }
    }

    try {
      await sendAdminNotification(customerEmail, items, total);
    } catch (err) {
      console.error("Admin notification failed:", err);
    }

    return NextResponse.json({ received: true, orderId: order._id });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
