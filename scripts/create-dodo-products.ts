import { DodoPayments } from "dodopayments";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: (process.env.DODO_ENVIRONMENT as "test_mode" | "live_mode") || "live_mode",
});

const PRODUCTS = [
  { name: "Answer Copies Compilation", priceInr: 799, slug: "answer-copies-compilation" },
  { name: "Top 10 Rankers Strategy", priceInr: 299, slug: "top-10-rankers-strategy" },
  { name: "All Strategy Reports", priceInr: 799, slug: "all-strategy-reports" },
  { name: "Government Schemes Compilation", priceInr: 99, slug: "government-schemes-compilation" },
  { name: "Anthropology Bundle", priceInr: 299, slug: "anthropology-bundle" },
  { name: "Complete GS Notes Bundle", priceInr: 399, slug: "complete-gs-notes-bundle" },
];

async function main() {
  const entitlementsPage = await dodo.entitlements.list();
  const entitlements = entitlementsPage.items;
  const slugToProductId: Record<string, string> = {};

  console.log("Available entitlements:");
  for (const e of entitlements) {
    console.log(`  ${e.id} — "${e.name}"`);
  }

  for (const product of PRODUCTS) {
    const entitlement = entitlements.find((e) => e.name === product.name);
    if (!entitlement) {
      console.warn(`No entitlement found for "${product.name}" — skipping`);
      continue;
    }

    const created = await dodo.products.create({
      name: product.name,
      tax_category: "digital_products",
      price: {
        type: "one_time_price",
        currency: "INR",
        price: product.priceInr * 100,
        discount: 0,
        purchasing_power_parity: false,
      },
      entitlements: [{ entitlement_id: entitlement.id }],
      description: `${product.name} — UPSCPrepNotes.in`,
    });

    slugToProductId[product.slug] = created.product_id;
    console.log(`Created "${product.name}" → ${created.product_id}`);
  }

  console.log("\n--- Product ID Mapping ---");
  console.log(JSON.stringify(slugToProductId, null, 2));
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
