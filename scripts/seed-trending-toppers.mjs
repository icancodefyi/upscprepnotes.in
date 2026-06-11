// Run: node -r dotenv/config scripts/seed-trending-toppers.mjs dotenv_config_path=.env.local
// Seeds freeAnswerCopyUrl for trending unseeded toppers with found ForumIAS PDFs
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI not set. Run with: node -r dotenv/config scripts/seed-trending-toppers.mjs dotenv_config_path=.env.local");
  process.exit(1);
}

const SEED_DATA = [
  {
    slug: "banna-venkatesh-rank-15-2025",
    url: "https://forumias.com/blog/wp-content/uploads/2025/04/BANNA-VENKATESH-UPSC-2024-Rank-15-MGP-Sample-Copy-1-2.pdf",
  },
  {
    slug: "kritika-goyal-rank-14-2022",
    url: "https://forumias.com/blog/wp-content/uploads/2023/05/Kritika-Goyal-Rank-14-MGP-Copy-1-Essay.pdf",
  },
];

async function seedDB(mongoUri, dbName, label) {
  const conn = await mongoose.createConnection(mongoUri, { dbName }).asPromise();
  const toppers = conn.collection("toppers");

  for (const { slug, url } of SEED_DATA) {
    const existing = await toppers.findOne({ slug });
    if (!existing) {
      console.log(`✗ ${slug} not found in ${label}`);
      continue;
    }
    if (existing.freeAnswerCopyUrl) {
      console.log(`✓ ${slug} — already seeded`);
      continue;
    }
    await toppers.updateOne({ slug }, { $set: { freeAnswerCopyUrl: url } });
    console.log(`✓ ${slug} → ${url}`);
  }

  await conn.close();
}

async function main() {
  await seedDB(MONGO_URI, process.env.DB_NAME || "upscprepnotes", "UPSCPREPNOTES");
  const airlistUri = MONGO_URI.replace("upscprepnotes", "airlist");
  await seedDB(airlistUri, "airlist", "AIRLIST");
  console.log("\nDone");
}

main().catch((err) => { console.error("Fatal:", err.message); process.exit(1); });
