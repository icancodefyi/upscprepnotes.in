// Run: node -r dotenv/config scripts/seed-free-pdfs.mjs dotenv_config_path=.env.local
// Seed freeAnswerCopyUrl for toppers that have scanned PDFs available
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI not set. Run with: node -r dotenv/config scripts/seed-free-pdfs.mjs dotenv_config_path=.env.local");
  process.exit(1);
}

const topperSchema = new mongoose.Schema({}, { strict: false, collection: "toppers" });
const Topper = mongoose.model("Topper", topperSchema);

const SEED_DATA = [
  { slug: "divya-tanwar-rank-105-2022", url: "https://www.drishtiias.com/hindi/images/pdf/DIVYA-(438)-2021-GS.pdf" },
];

async function main() {
  await mongoose.connect(MONGO_URI, { dbName: process.env.DB_NAME || "upscprepnotes" });
  console.log("Connected to MongoDB");

  for (const { slug, url } of SEED_DATA) {
    const result = await Topper.updateOne({ slug }, { $set: { freeAnswerCopyUrl: url } });
    if (result.matchedCount > 0) {
      console.log(`✓ ${slug} → ${url}`);
    } else {
      console.log(`✗ ${slug} not found`);
    }
  }

  await mongoose.disconnect();
  console.log("Done");
}

main().catch(console.error);
