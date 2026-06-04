// Run: node scripts/seed-free-pdfs.mjs
// Seed freeAnswerCopyUrl for toppers that have scanned PDFs available
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/upscprepnotes";

const topperSchema = new mongoose.Schema({}, { strict: false, collection: "toppers" });
const Topper = mongoose.model("Topper", topperSchema);

// Add PDF URLs here once scans are ready:
// Format: { slug: "divya-tanwar-rank-105-2022", url: "https://upscprepnotes.in/pdfs/answer-copies/divya-tanwar/gs1.pdf" }
const SEED_DATA = [];

async function main() {
  await mongoose.connect(MONGO_URI);
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
