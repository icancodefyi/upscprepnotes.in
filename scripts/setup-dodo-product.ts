import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DOT_ENV = join(__dirname, "..", ".env.local");

function loadVar(name: string): string | undefined {
  for (const line of readFileSync(DOT_ENV, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx > 0 && t.slice(0, idx).trim() === name) return t.slice(idx + 1).trim();
  }
}

async function main() {
  const apiKey = loadVar("DODO_API_KEY");
  if (!apiKey) throw new Error("DODO_API_KEY not found in .env.local");

  const envMode = loadVar("DODO_ENVIRONMENT") || "live_mode";
  const baseUrl = envMode === "test_mode" ? "https://test.dodopayments.com" : "https://live.dodopayments.com";

    const res = await fetch(`${baseUrl}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "UPSCPrepNotes Store Credit",
      description: "Pay-what-you-want store credit. Enter your cart total as the amount at checkout.",
      tax_category: "digital_products",
      price: {
        type: "one_time_price",
        currency: "INR",
        price: 100,
        discount: 0,
        purchasing_power_parity: false,
        pay_what_you_want: true,
        suggested_price: 79900,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }

  const product = await res.json();
  const pid = product.id || product.product_id || (typeof product === "string" ? product : undefined);
  console.log("Product created:", pid || "(see response)");

  let env = readFileSync(DOT_ENV, "utf-8");
  if (env.includes("DODO_PRODUCT_ID=")) {
    env = env.replace(/^DODO_PRODUCT_ID=.*$/m, `DODO_PRODUCT_ID=${pid}`);
  } else {
    env += `\nDODO_PRODUCT_ID=${pid}\n`;
  }
  writeFileSync(DOT_ENV, env);

  console.log(`DODO_PRODUCT_ID=${pid} written to .env.local`);
  console.log(`Preview: https://checkout.dodopayments.com/product/${pid}`);
}

main().catch(console.error);
