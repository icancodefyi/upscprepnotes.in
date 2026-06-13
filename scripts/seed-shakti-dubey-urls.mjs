import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("MONGODB_URI not set. Run with: node -r dotenv/config scripts/seed-shakti-dubey-urls.mjs dotenv_config_path=.env.local");
  process.exit(1);
}

const SHAKTI_URLS = [
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER_GS1_T01_SHAKTI_DUBEY_AIR01_9e6e373cbd.pdf",
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER_GS1_T05_SHAKTI_DUBEY_AIR01_36db95f9ec.pdf",
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER_GS2_T02_SHAKTI_DUBEY_AIR01_7a7739aae9.pdf",
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER2_T10_SHAKTI_DUBEY_AIR01_f49f437f48.pdf",
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER_GS3_T03_SHAKTI_DUBEY_AIR01_a550150e9f.pdf",
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER3_T11_SHAKTI_DUBEY_AIR01_2d890a7415.pdf",
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER_GS4_T08_SHAKTI_DUBEY_AIR01_aeb5119b93.pdf",
  "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot2024_GS_PAPER4_T12_SHAKTI_DUBEY_AIR01_a4856b93ff.pdf",
  "https://forumias.com/blog/wp-content/uploads/2025/04/Shakti-Dubey-UPSC-2024-Rank-1-MGP-Sample-Copy-1.pdf",
  "https://forumias.com/blog/wp-content/uploads/2025/04/MGP-2023-Open-Test-GS-Paper-3-QP.pdf",
];

const SLUG = "shakti-dubey-rank-1-2024";

async function main() {
  await mongoose.connect(MONGO_URI, { dbName: "upscprepnotes" });
  console.log("Connected");

  const Topper = mongoose.connection.db.collection("toppers");

  const existing = await Topper.findOne({ slug: SLUG });
  if (!existing) {
    console.log(`✗ ${SLUG} not found`);
    process.exit(1);
  }

  await Topper.updateOne(
    { slug: SLUG },
    {
      $set: {
        freeAnswerCopyUrls: SHAKTI_URLS,
        freeAnswerCopyUrl: SHAKTI_URLS[0],
      },
    }
  );

  console.log(`✓ ${SLUG} seeded with ${SHAKTI_URLS.length} URLs`);
  await mongoose.disconnect();
}

main().catch(console.error);
