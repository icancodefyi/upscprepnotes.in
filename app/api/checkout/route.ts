import { NextRequest, NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";
import { PRODUCTS } from "@/lib/store-products";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/models/order.model";
import { generateDownloadToken } from "@/lib/order-utils";

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
    const { items, email, successUrl, cancelUrl } = body as {
      items: CheckoutItem[];
      email?: string;
      successUrl?: string;
      cancelUrl?: string;
    };

    const origin = request.headers.get("origin") || request.headers.get("referer") || "https://upscprepnotes.in";
    const productId = process.env.DODO_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json(
        { error: "Store not configured for payments. Run setup-dodo-product first." },
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
      total += (item.price || product.price) * item.quantity;
      resolvedItems.push({ slug: item.slug, quantity: item.quantity, price: item.price || product.price, title: product.title });
    }

    const ref = shortRef();
    const downloadToken = generateDownloadToken();

    await connectDB();

    const order = await OrderModel.create({
      items: resolvedItems,
      total,
      ref,
      downloadToken,
      status: "pending",
    });

    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          amount: total * 100,
        },
      ],
      customer: email ? { email } : undefined,
      return_url: successUrl || `${origin}/store/success?ref=${ref}`,
      cancel_url: cancelUrl || `${origin}/store`,
      feature_flags: {
        allow_discount_code: false,
        allow_currency_selection: false,
      },
      metadata: {
        ref,
        items: JSON.stringify(resolvedItems.map((i) => ({ slug: i.slug, quantity: i.quantity, price: i.price, title: i.title }))),
        total: String(total),
      },
    });

    await OrderModel.findByIdAndUpdate(order._id, {
      dodoSessionId: session.session_id,
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
