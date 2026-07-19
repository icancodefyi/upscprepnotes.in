/**
 * Script to check and recover stuck pending orders.
 * 
 * Usage:
 *   npx tsx scripts/recover-stuck-orders.ts          # list all pending orders
 *   npx tsx scripts/recover-stuck-orders.ts --check   # check DodoPayments for each
 *   npx tsx scripts/recover-stuck-orders.ts --fulfill  # mark as paid + send emails
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import { DodoPayments } from "dodopayments";

const MONGODB_URI = process.env.MONGODB_URI!;
const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.DODO_ENVIRONMENT as "test_mode" | "live_mode") || "live_mode",
});

const orderSchema = new mongoose.Schema(
  {
    email: String,
    items: [{ slug: String, title: String, quantity: Number, price: Number }],
    total: Number,
    offeredPrice: Number,
    ref: String,
    dodoSessionId: String,
    dodoPaymentId: String,
    downloadToken: String,
    status: { type: String, enum: ["pending", "paid", "delivered"] },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

async function main() {
  const mode = (process.argv[2] || "--list") as string;

  await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME || "upscprepnotes" });
  console.log("Connected to MongoDB\n");

  const pending = await Order.find({ status: "pending" }).sort({ createdAt: -1 });

  if (pending.length === 0) {
    console.log("No pending orders found.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${pending.length} pending order(s):\n`);

  for (const order of pending) {
    const age = Date.now() - new Date(order.createdAt).getTime();
    const hours = Math.round(age / (1000 * 60 * 60));
    const days = Math.round(hours / 24);

    console.log(`─── Order ${order._id} ───`);
    console.log(`  Email:    ${order.email}`);
    console.log(`  Ref:      ${order.ref}`);
    console.log(`  Total:    ₹${order.total}`);
    console.log(`  Items:    ${order.items.map((i: any) => i.slug).join(", ")}`);
    console.log(`  Created:  ${order.createdAt} (${days > 0 ? `${days}d ` : ""}${hours % 24}h ago)`);
    console.log(`  Session:  ${order.dodoSessionId || "none"}`);

    if (mode === "--check" && order.dodoSessionId) {
      try {
        // Try to look up payments by session
        const payments = await (dodo as any).payments.list({
          checkout_session_id: order.dodoSessionId,
        }).catch(() => null);

        if (payments && payments.length > 0) {
          const p = payments[0];
          console.log(`  DodoPayments status: ${p.status}`);
          console.log(`  Payment ID: ${p.payment_id || p.id}`);

          if (p.status === "succeeded" || p.status === "completed") {
            console.log(`  ⚠️  PAYMENT SUCCEEDED — order should be fulfilled!`);

            if (process.argv.includes("--fulfill")) {
              await Order.findByIdAndUpdate(order._id, {
                status: "paid",
                dodoPaymentId: p.payment_id || p.id,
              });
              console.log(`  ✅ Order updated to "paid"`);
            }
          } else {
            console.log(`  Payment not completed — ${p.status}`);
          }
        } else {
          console.log(`  No payment found in DodoPayments for this session`);
        }
      } catch (err: any) {
        console.log(`  Error checking DodoPayments: ${err.message}`);
      }
    }

    if (process.argv.includes("--fulfill") && !process.argv.includes("--check")) {
      // Direct fulfill without checking
      await Order.findByIdAndUpdate(order._id, { status: "paid" });
      console.log(`  ✅ Order manually marked as "paid"`);
    }

    console.log("");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
