import { NextRequest, NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { generateDownloadToken, sendAdminNotification } from "@/lib/order-utils";
import { getPostHogClient } from "@/lib/posthog-server";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.DODO_ENVIRONMENT as "test_mode" | "live_mode") || "live_mode",
});

export async function POST(request: NextRequest) {
  const webhookId = Math.random().toString(36).slice(2, 10);
  try {
    const body = await request.text();

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
        console.error(`[${webhookId}] Failed to retrieve payment details for ${paymentId}`);
      }
    }

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
        try {
          await AnalyticsEventModel.create({
            event: "checkout_completed",
            pagePath: "/store/success",
            sessionId: "server",
            visitorId: "server",
            referrer: "",
            userAgent: "",
            deviceType: "server",
            metadata: { ref: existing.ref, total: existing.total, items: existing.items.map((i: any) => i.slug) },
          });
        } catch {}
        const distinctId = customerEmail || existing.email || `anon-${existing.ref}`;
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId,
          event: "payment_completed",
          properties: {
            ref: existing.ref,
            total_amount: existing.total,
            item_slugs: existing.items.map((i: any) => i.slug),
            item_count: existing.items.length,
            payment_id: paymentId,
            email: customerEmail || existing.email || undefined,
          },
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
      items = JSON.parse(metadata.items || "[]");
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
      ref: metadata.ref || "",
      dodoSessionId: sessionId,
      dodoPaymentId: paymentId,
      downloadToken,
      status: "paid",
    });

    console.log(`[${webhookId}] New order created: ${order._id}`);

    try {
      await AnalyticsEventModel.create({
        event: "checkout_completed",
        pagePath: "/store/success",
        sessionId: "server",
        visitorId: "server",
        referrer: "",
        userAgent: "",
        deviceType: "server",
        metadata: { ref: order.ref, total: order.total, items: order.items.map((i: any) => i.slug) },
      });
    } catch {}

    const newDistinctId = customerEmail || `anon-${order.ref}`;
    const posthogNew = getPostHogClient();
    posthogNew.capture({
      distinctId: newDistinctId,
      event: "payment_completed",
      properties: {
        ref: order.ref,
        total_amount: order.total,
        item_slugs: order.items.map((i: any) => i.slug),
        item_count: order.items.length,
        payment_id: paymentId,
        email: customerEmail || undefined,
      },
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
