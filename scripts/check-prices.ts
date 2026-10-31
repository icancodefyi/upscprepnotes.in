import { config } from "dotenv";
config({ path: ".env.local" });

import { DodoPayments } from "dodopayments";
import { PRODUCTS } from "../lib/store-products";

/**
 * Dodo charges the price configured on the product in its dashboard.
 * The `amount` we send to the checkout API is ignored for fixed-price products.
 *
 * So the only thing that can drift is the dashboard vs lib/store-products.ts.
 * Run this after changing any price. Exits non-zero on a mismatch.
 */
const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment:
    (process.env.DODO_ENVIRONMENT as "test_mode" | "live_mode") || "live_mode",
});

async function main() {
  const res = await dodo.products.list({ page_size: 100 });
  const byId = new Map((res.items ?? []).map((p) => [p.product_id, p]));

  let mismatches = 0;

  for (const product of PRODUCTS) {
    if (!product.dodoProductId) continue; // not sold individually
    const dodoProduct = byId.get(product.dodoProductId);

    if (!dodoProduct) {
      console.log(`✗ ${product.slug.padEnd(40)} missing in Dodo`);
      mismatches++;
      continue;
    }

    if (dodoProduct.price == null) {
      console.log(`✗ ${product.slug.padEnd(40)} has no price in Dodo`);
      mismatches++;
      continue;
    }

    const dodoPrice = dodoProduct.price / 100;
    const ok = dodoPrice === product.price;
    if (!ok) mismatches++;

    console.log(
      `${ok ? "✓" : "✗"} ${product.slug.padEnd(40)} site ₹${product.price}  dodo ₹${dodoPrice}`
    );
  }

  if (mismatches > 0) {
    console.error(
      `\n${mismatches} mismatch(es). Update lib/store-products.ts or the Dodo dashboard so the charged price equals the displayed price.`
    );
    process.exit(1);
  }

  console.log("\nAll prices match.");
}

main().catch((err) => {
  console.error("Price check failed:", err);
  process.exit(1);
});
