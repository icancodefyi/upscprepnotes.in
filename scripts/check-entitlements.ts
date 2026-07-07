import { DodoPayments } from "dodopayments";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: "live_mode",
});

async function main() {
  const entitlementsPage = await dodo.entitlements.list();
  for (const e of entitlementsPage.items) {
    console.log(`Entitlement: ${e.name} (${e.id})`);
    console.log(`  integration_type: ${e.integration_type}`);
    console.log(`  integration_config:`, JSON.stringify(e.integration_config, null, 4));
    console.log("---");
  }
}

main().catch(err => {
  console.error("Failed:", err);
  process.exit(1);
});
