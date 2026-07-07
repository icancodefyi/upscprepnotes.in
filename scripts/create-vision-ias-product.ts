import { DodoPayments } from "dodopayments";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: "live_mode",
});

async function main() {
  const entitlementsPage = await dodo.entitlements.list();
  console.log("Existing entitlements:", JSON.stringify(entitlementsPage.items.map(e => ({ id: e.id, name: e.name })), null, 2));

  const entitlement = await dodo.entitlements.create({
    name: "Vision IAS Mains Test Series 2026",
    description: "10 full-length Vision IAS Mains 2026 test papers (GS 1-4)",
    integration_type: "digital_files",
    integration_config: {
      digital_file_ids: [],
      external_url: "https://cdn.upscprepnotes.in/Vision-IAS-Mains-2026-Test-Series.zip",
    },
  });
  console.log("\nCreated entitlement:", JSON.stringify({ id: entitlement.id, name: entitlement.name }, null, 2));

  const product = await dodo.products.create({
    name: "Vision IAS Mains Test Series 2026",
    tax_category: "digital_products",
    price: {
      type: "one_time_price",
      currency: "INR",
      price: 59900,
      discount: 0,
      purchasing_power_parity: false,
    },
    entitlements: [{ entitlement_id: entitlement.id }],
    description: "Vision IAS Mains Test Series 2026 — UPSCPrepNotes.in",
  });
  console.log("\nCreated product:", JSON.stringify({ id: product.product_id, name: product.name }, null, 2));
}

main().catch(err => {
  console.error("Failed:", err);
  process.exit(1);
});
