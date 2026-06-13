// Run: node -r dotenv/config scripts/seed-2023-toppers-pdfs.mjs dotenv_config_path=.env.local
// Seeds freeAnswerCopyUrls for 2023 batch toppers with ForumIAS PDFs (4+ each)
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

const SEED_DATA = [
  {
    slug: "shubhanshu-katiyar-rank-70-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/04/Shubhansu-Katiyar-UPSC-2023Rank-70MGP-Answer-Copy-GS-Paper-1.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Shubhansu-Katiyar-UPSC-2023Rank-70MGP-Answer-Copy-GS-Paper-2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Shubhansu-Katiyar-UPSC-2023Rank-70MGP-Answer-Copy-GS-Paper-3.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Shubhansu-Katiyar-UPSC-2023Rank-70MGP-Answer-Copy-Ethics-Paper.pdf",
    ],
  },
  {
    slug: "swati-sharma-rank-17-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/04/Swati-Sharma-UPSC-2023-Rank-17-MGP-Answer-Copy-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Swati-Sharma-UPSC-2023-Rank-17-MGP-Answer-Copy-GS-Paper2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Swati-Sharma-UPSC-2023-Rank-17-MGP-Answer-Copy-GS-Paper3.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Swati-Sharma-UPSC-2023-Rank-17-MGP-Answer-Copy-Ethics-Paper.pdf",
    ],
  },
  {
    slug: "saloni-chhabra-rank-29-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/04/Saloni-Chhabra-UPSC-2023-Rank-29-MGP-Answer-Copy-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Saloni-Chhabra-UPSC-2023-Rank-29-MGP-Answer-Copy-GS-Paper2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Saloni-Chhabra-UPSC-2023-Rank-29-MGP-Answer-Copy-GS-Paper3.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Saloni-Chhabra-UPSC-2023-Rank-29-MGP-Answer-Copy-Ethics-Paper.pdf",
    ],
  },
  {
    slug: "garima-mundra-rank-80-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/04/Garima-Mundra-UPSC-2023-Rank-80-MGP-Answer-Copy-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Garima-Mundra-UPSC-2023-Rank-80-MGP-Answer-Copy-Ethics-Paper-2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Garima-Mundra-UPSC-2023-Rank-80-MGP-Answer-Copy-Essay-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Garima-Mundra-UPSC-2023-Rank-80-MGP-Answer-Copy-Essay-Paper-2.pdf",
    ],
  },
  {
    slug: "kush-motwani-rank-11-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/05/KUSH-MOTWANI-UPSC-2023-Rank-11-MGP-Answer-Copy-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/KUSH-MOTWANI-UPSC-2023-Rank-11-MGP-Answer-Copy-GS-Paper-2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/KUSH-MOTWANI-UPSC-2023-Rank-11-MGP-Answer-Copy-Ethics-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/KUSH-MOTWANI-UPSC-2023-Rank-11-MGP-Answer-Copy-Essay-Paper.pdf",
    ],
  },
  {
    slug: "ayan-jain-rank-16-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/05/Ayan-Jain-UPSC-2023-Rank-16-MGP-Answer-Copy-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/Ayan-Jain-UPSC-2023-Rank-16-MGP-Answer-Copy-GS-Paper-2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/Ayan-Jain-UPSC-2023-Rank-16-MGP-Answer-Copy-GS-Paper-3.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/Ayan-Jain-UPSC-2023-Rank-16-MGP-Answer-Copy-Essay-Paper.pdf",
    ],
  },
  {
    slug: "kunal-rastogi-rank-15-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/04/Kunal-Rastogi-UPSC-2023-Rank-15-MGP-Answer-Copy-GS-Paper-1.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Kunal-Rastogi-UPSC-2023-Rank-15-MGP-Answer-Copy-GS-Paper-2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Kunal-Rastogi-UPSC-2023-Rank-15-MGP-Answer-Copy-Ethics-Paper-1-2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/04/Kunal-Rastogi-UPSC-2023-Rank-15-MGP-Answer-Copy-Essay-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/Kunal-Rastogi-UPSC-IAS-2023-Toppers-AIR-15-Sample-MGP-GS-Copy.pdf",
    ],
  },
  {
    slug: "priya-rani-rank-69-2023",
    urls: [
      "https://forumias.com/blog/wp-content/uploads/2024/05/Priya-RaniUPSC-2023-Rank-69-MGP-Answer-Copy-GS-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/Priya-RaniUPSC-2023-Rank-69-MGP-Answer-Copy-GS-Paper-2.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/Priya-RaniUPSC-2023-Rank-69-MGP-Answer-Copy-Ethics-Paper.pdf",
      "https://forumias.com/blog/wp-content/uploads/2024/05/Priya-RaniUPSC-2023-Rank-69-MGP-Answer-Copy-Ethics-Paper-2.pdf",
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
