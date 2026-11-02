import { trackServer } from "@/lib/tracking/server";
import { NextRequest, NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { generateDownloadToken, sendAdminNotification, sendOrderConfirmationEmail } from "@/lib/order-utils";

function buildDownloadUrl(token: string, items: { slug?: string }[]): string {
  const base = process.env.SITE_URL || "https://upscprepnotes.in";
  const firstSlug = items?.[0]?.slug;
  return `${base}/download/${token}${firstSlug ? `?slug=${firstSlug}` : ""}`;
}

async function sendConfirmationSafely(
  recipientEmail: string,
  orderId: string,
  items: { slug?: string; title: string }[],
  downloadToken: string
) {
  if (!recipientEmail) return;
  try {
    await sendOrderConfirmationEmail(
      recipientEmail,
      orderId,
      items,
      buildDownloadUrl(downloadToken, items)
    );
    console.log(`Order confirmation email sent to ${recipientEmail}`);
  } catch (err) {
    console.error(`Order confirmation email FAILED for ${recipientEmail}:`, err);
  }
}

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.DODO_ENVIRONMENT as "test_mode" | "live_mode") || "live_mode",
});

export async function POST(request: NextRequest) {
  const webhookId = Math.random().toString(36).slice(2, 10);
  try {
    const body = await request.text();

    // 1. Signature (Standard Webhooks). Set DODO_WEBHOOK_KEY from the Dodo dashboard (Webhooks > your endpoint > Secret).
    const webhookKey = process.env.DODO_WEBHOOK_KEY;
    if (webhookKey) {
      try {
        dodo.webhooks.unwrap(body, {
          key: webhookKey,
          headers: {
            "webhook-id": request.headers.get("webhook-id") || "",
            "webhook-signature": request.headers.get("webhook-signature") || "",
            "webhook-timestamp": request.headers.get("webhook-timestamp") || "",
          },
        });
      } catch {
        console.error(`[${webhookId}] Invalid webhook signature`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.warn(`[${webhookId}] DODO_WEBHOOK_KEY is not set: relying on the payment lookup below`);
    }

    let event;
    try {
      event = JSON.parse(body);
    } catch {
      console.error(`[${webhookId}] Invalid JSON body`);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.log(`[${webhookId}] Webhook received: type=${event.type}`);

    if (event.type !== "payment.succeeded") {
      console.log(`[${webhookId}] Ignoring event type: ${event.type}`);
      return NextResponse.json({ received: true });
    }

    const paymentData = event.data || {};
    const sessionId = paymentData.checkout_session_id || paymentData.session_id;
    const paymentId = paymentData.id || paymentData.payment_id;
    const metadata = paymentData.metadata || {};

    console.log(`[${webhookId}] payment.succeeded: session=${sessionId} payment=${paymentId}`);

    if (!sessionId) {
      console.error(`[${webhookId}] No session_id in webhook payload`);
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // 2. Never trust the payload: ask Dodo whether this payment really succeeded, for this session.
    //    A lookup failure throws (500), so Dodo retries the webhook later.
    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
    }
    let payment;
    try {
      payment = await dodo.payments.retrieve(paymentId);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status && status >= 400 && status < 500) {
        console.error(`[${webhookId}] Dodo does not know payment ${paymentId} (${status})`);
        return NextResponse.json({ error: "Unknown payment" }, { status: 400 });
      }
      throw err;
    }
    if (payment.status !== "succeeded" || (payment.checkout_session_id && payment.checkout_session_id !== sessionId)) {
      console.error(`[${webhookId}] Payment ${paymentId} not verified: status=${payment.status}`);
      return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
    }

    await connectDB();

    // From here on only Dodo's own record is used, not the posted JSON.
    const customerEmail: string = (payment as any).customer?.email || "";
    const total = Math.round(((payment as any).total_amount || 0) / 100);
    const verifiedMeta = ((payment as any).metadata || metadata || {}) as Record<string, string>;

    console.log(`[${webhookId}] Looking up order by sessionId=${sessionId}`);

    const existing = await OrderModel.findOne({ dodoSessionId: sessionId });
    if (existing) {
      if (existing.status === "pending") {
        await OrderModel.findByIdAndUpdate(existing._id, {
          status: "paid",
          email: customerEmail || existing.email,
          dodoPaymentId: paymentId,
        });
        console.log(`[${webhookId}] Order ${existing._id} updated: pending → paid`);
        const recipientEmail = customerEmail || existing.email || "";
        await sendConfirmationSafely(recipientEmail, existing._id.toString(), existing.items, existing.downloadToken);
        await trackServer("purchase", {
          email: customerEmail || existing.email,
          path: "/api/webhook/dodo",
          props: { ref: existing.ref, total: existing.total, items: existing.items.map((i: any) => i.slug), payment: paymentId },
        });
        try {
          await sendAdminNotification(customerEmail, existing.items, existing.total);
        } catch (err) {
          console.error(`[${webhookId}] Admin notification failed:`, err);
        }
      } else {
        console.log(`[${webhookId}] Order ${existing._id} already ${existing.status}, skipping`);
      }
      return NextResponse.json({ received: true, orderId: existing._id });
    }

    console.log(`[${webhookId}] No existing order found for sessionId=${sessionId}, creating new one`);

    let items: { slug: string; quantity: number; price: number; title: string }[];
    try {
      items = JSON.parse(verifiedMeta.items || "[]");
    } catch {
      items = [];
    }

    if (items.length === 0) {
      items = [{ slug: "unknown", quantity: 1, price: total, title: "Store Purchase" }];
    }

    const downloadToken = generateDownloadToken();
    const order = await OrderModel.create({
      email: customerEmail || "unknown@checkout",
      items,
      total,
      ref: verifiedMeta.ref || "",
      dodoSessionId: sessionId,
      dodoPaymentId: paymentId,
      downloadToken,
      status: "paid",
    });

    console.log(`[${webhookId}] New order created: ${order._id}`);

    await sendConfirmationSafely(customerEmail, order._id.toString(), order.items, order.downloadToken);

    await trackServer("purchase", {
      email: customerEmail,
      path: "/api/webhook/dodo",
      props: { ref: order.ref, total: order.total, items: order.items.map((i: any) => i.slug), payment: paymentId },
    });

    try {
      await sendAdminNotification(customerEmail, items, total);
    } catch (err) {
      console.error(`[${webhookId}] Admin notification failed:`, err);
    }

    return NextResponse.json({ received: true, orderId: order._id });
  } catch (err) {
    console.error(`[${webhookId}] Webhook error:`, err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
