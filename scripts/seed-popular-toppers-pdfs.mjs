// Run: node -r dotenv/config scripts/seed-popular-toppers-pdfs.mjs dotenv_config_path=.env.local
// Seeds freeAnswerCopyUrls for top 4 highest-search-volume toppers (2022 batch)
// Skips if freeAnswerCopyUrls already exists
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI not set. Run with: node -r dotenv/config scripts/seed-popular-toppers-pdfs.mjs dotenv_config_path=.env.local");
  process.exit(1);
}

const SEED_DATA = [
  {
    slug: "ishita-kishore-rank-1-2022",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2023/05/Ishita-Kishore-Rank-1-MGP-Copy-1-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Ishita-Kishore-Rank-1-MGP-Copy-7-Ethics.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Ishita-Kishore-Rank-1-MGP-Copy-8-Essay.pdf",
    ],
  },
  {
    slug: "garima-lohia-rank-2-2022",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2023/05/Garima-Lohia-Rank-2-MGP-Copy-1-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Garima-Lohia-Rank-2-MGP-Copy-2-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Garima-Lohia-Rank-2-MGP-Copy-3-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Garima-Lohia-Rank-2-MGP-Copy-4-Ethics.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Garima-Lohia-Rank-2-MGP-Copy-6-Essay.pdf",
    ],
  },
  {
    slug: "uma-harathi-rank-3-2022",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2023/05/Umaharathi-N-Rank-3-MGP-Copy-1-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Umaharathi-N-Rank-3-MGP-Copy-6-Ethics.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Umaharathi-N-Rank-3-MGP-Copy-1-Anthropology.pdf",
    ],
  },
  {
    slug: "smriti-mishra-rank-4-2022",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2023/05/Smriti-Mishra-Rank-4-MGP-Copy-1-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2023/05/Smriti-Mishra-Rank-4-MGP-Copy-7-Ethics.pdf",
    ],
  },
];

async function seedDB(mongoUri, dbName, label) {
  const conn = await mongoose.createConnection(mongoUri, { dbName }).asPromise();
  const toppers = conn.collection("toppers");

  for (const { slug, urls } of SEED_DATA) {
    const existing = await toppers.findOne({ slug });
    if (!existing) {
      console.log(`✗ ${slug} not found in ${label}`);
      continue;
    }
    if (existing.freeAnswerCopyUrls?.length > 0) {
      console.log(`✓ ${slug} — already has ${existing.freeAnswerCopyUrls.length} PDFs`);
      continue;
    }
    // Also keep existing single URL if present
    const allUrls = existing.freeAnswerCopyUrl
      ? [existing.freeAnswerCopyUrl, ...urls]
      : urls;
    await toppers.updateOne(
      { slug },
      {
        $set: {
          freeAnswerCopyUrls: allUrls,
          freeAnswerCopyUrl: urls[0],
        },
      }
    );
    console.log(`✓ ${slug} → ${urls.length} PDFs seeded`);
  }

  await conn.close();
}

async function main() {
  await seedDB(MONGO_URI, process.env.DB_NAME || "upscprepnotes", "UPSCPREPNOTES");

  const airlistUri = MONGO_URI.replace("upscprepnotes", "airlist");
  try {
    await seedDB(airlistUri, "airlist", "AIRLIST");
  } catch (e) {
    console.log("Skipping airlist DB:", e.message);
  }

  console.log("\nDone");
}

main().catch((err) => { console.error("Fatal:", err.message); process.exit(1); });
