import mongoose from "mongoose";

const UPSC_MONGO = "MONGODB_URI_FROM_ENV/upscprepnotes";
const AIRLIST_MONGO = "MONGODB_URI_FROM_ENV/airlist";

async function main() {
  // === UPSCPREPNOTES ===
  const u = await mongoose.createConnection(UPSC_MONGO).asPromise();
  const uToppers = u.collection("toppers");

  const invalid = await uToppers.findOne({ slug: "shakti-dubey" });
  const valid = await uToppers.findOne({ slug: "shakti-dubey-rank-1-2024" });

  console.log("=== UPSCPREPNOTES ===");
  console.log(`Invalid (slug: shakti-dubey): ${invalid ? "EXISTS" : "NOT FOUND"}`);
  console.log(`  optionalSubject: ${invalid?.optionalSubject}`);
  console.log(`  isFeatured: ${invalid?.isFeatured}`);
  console.log(`Valid (slug: shakti-dubey-rank-1-2024): ${valid ? "EXISTS" : "NOT FOUND"}`);
  console.log(`  optionalSub: ${valid?.optionalSub}`);
  console.log(`  strategy: ${valid?.strategy ? "HAS STRATEGY" : "NO STRATEGY"}`);

  if (invalid) {
    await uToppers.deleteOne({ slug: "shakti-dubey" });
    console.log("\n✅ Deleted invalid shakti-dubey record from upscprepnotes DB");
  }

  await u.close();

  // === AIRLIST ===
  const a = await mongoose.createConnection(AIRLIST_MONGO).asPromise();
  const aToppers = a.collection("toppers");

  const aInvalid = await aToppers.findOne({ slug: "shakti-dubey" });
  if (aInvalid) {
    await aToppers.deleteOne({ slug: "shakti-dubey" });
    console.log("✅ Deleted invalid shakti-dubey record from airlist DB");
  } else {
    console.log("No invalid record on airlist DB");
  }

  await a.close();
  process.exit(0);
}

main().catch(console.error);
