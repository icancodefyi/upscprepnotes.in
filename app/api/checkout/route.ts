import { NextRequest, NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";
import { PRODUCTS } from "@/lib/store-products";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { generateDownloadToken, sendOfferNotification } from "@/lib/order-utils";
import { getPostHogClient } from "@/lib/posthog-server";

function shortRef() {
  return Date.now().toString(36).slice(-6) + Math.random().toString(36).slice(2, 6);
}

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.DODO_ENVIRONMENT as "test_mode" | "live_mode") || "live_mode",
});

interface CheckoutItem {
  slug: string;
  quantity: number;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, successUrl, cancelUrl, offeredPrice } = body as {
      items: CheckoutItem[];
      email?: string;
      successUrl?: string;
      cancelUrl?: string;
      offeredPrice?: number;
    };

    const origin = request.headers.get("origin") || request.headers.get("referer") || "https://upscprepnotes.in";
    const fallbackProductId = process.env.DODO_PRODUCT_ID;
    if (!fallbackProductId) {
      return NextResponse.json(
        { error: "Store not configured for payments." },
        { status: 500 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    let total = 0;
    const resolvedItems: { slug: string; quantity: number; price: number; title: string }[] = [];
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.slug === item.slug);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.slug}` },
          { status: 400 }
        );
      }
      let itemPrice: number;
      if (offeredPrice !== undefined) {
        const minPrice = product.minOfferPrice ?? product.price;
        if (offeredPrice < minPrice) {
          return NextResponse.json(
            { error: `Minimum price for ${product.title} is ₹${minPrice}` },
            { status: 400 }
          );
        }
        itemPrice = offeredPrice;
      } else {
        itemPrice = item.price || product.price;
      }
      total += itemPrice * item.quantity;
      resolvedItems.push({ slug: item.slug, quantity: item.quantity, price: itemPrice, title: product.title });
    }

    const ref = shortRef();
    const downloadToken = generateDownloadToken();

    await connectDB();

    const order = await OrderModel.create({
      items: resolvedItems,
      total,
      offeredPrice,
      ref,
      downloadToken,
      email: email || undefined,
      status: "pending",
    });

    // Build product_cart with the correct Dodo product ID per item
    const productCart = resolvedItems.map((item) => {
      const product = PRODUCTS.find((p) => p.slug === item.slug);
      return {
        product_id: product?.dodoProductId || fallbackProductId,
        quantity: item.quantity,
        amount: item.price * 100,
      };
    });

    const session = await dodo.checkoutSessions.create({
      product_cart: productCart,
      customer: email ? { email } : undefined,
      return_url: successUrl || `${origin}/store/success?ref=${ref}`,
      cancel_url: cancelUrl || `${origin}/store`,
      feature_flags: {
        allow_discount_code: true,
        allow_currency_selection: false,
      },
      metadata: {
        ref,
        items: JSON.stringify(resolvedItems.map((i) => ({ slug: i.slug, quantity: i.quantity, price: i.price, title: i.title }))),
        total: String(total),
        ...(offeredPrice !== undefined ? { offeredPrice: String(offeredPrice) } : {}),
      },
    });

    await OrderModel.findByIdAndUpdate(order._id, {
      dodoSessionId: session.session_id,
    });

    // Notify admin of name-your-price offer
    if (offeredPrice !== undefined) {
      const product = PRODUCTS.find((p) => p.slug === resolvedItems[0]?.slug);
      if (product) {
        const origPrice = product.price;
        sendOfferNotification(email || "unknown", product.title, offeredPrice, origPrice, ref).catch(
          (err) => console.error("Offer notification failed:", err)
        );
      }
    }

    try {
      await AnalyticsEventModel.create({
        event: "checkout_started",
        pagePath: "/store",
        sessionId: "server",
        visitorId: "server",
        referrer: "",
        userAgent: "",
        deviceType: "server",
        metadata: { ref, total, items: resolvedItems.map(i => i.slug) },
      });
    } catch {}

    const distinctId = email || `anon-${ref}`;
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId,
      event: "checkout_started",
      properties: {
        ref,
        total_amount: total,
        item_slugs: resolvedItems.map((i) => i.slug),
        item_count: resolvedItems.length,
        email: email || undefined,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
    });
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Checkout creation failed",
      },
      { status: 500 }
    );
  }
}
