// Run: node -r dotenv/config scripts/seed-shakti-dubey.mjs dotenv_config_path=.env.local
// Seeds Shakti Dubey's answer copies + freeAnswerCopyUrl for auto-send
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI not set.");
  process.exit(1);
}

const topperSchema = new mongoose.Schema({}, { strict: false, collection: "toppers" });
const Topper = mongoose.model("Topper", topperSchema);

const SHAKTI = {
  slug: "shakti-dubey",
  freeAnswerCopyUrl: "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_GS_1_T_01_SHAKTI_DUBEY_AIR_01_9e6e373cbd.pdf",
  answerCopies: {
    gs1: [
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_GS_1_T_01_SHAKTI_DUBEY_AIR_01_9e6e373cbd.pdf",
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_GS_1_T_05_SHAKTI_DUBEY_AIR_01_36db95f9ec.pdf",
    ],
    gs2: [
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_GS_2_T_02_SHAKTI_DUBEY_AIR_01_7a7739aae9.pdf",
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_2_T_10_SHAKTI_DUBEY_AIR_01_f49f437f48.pdf",
    ],
    gs3: [
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_GS_3_T_03_SHAKTI_DUBEY_AIR_01_a550150e9f.pdf",
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_3_T_11_SHAKTI_DUBEY_AIR_01_2d890a7415.pdf",
    ],
    gs4: [
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_GS_4_T_08_SHAKTI_DUBEY_AIR_01_aeb5119b93.pdf",
      "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/Sure_Shot_2024_GS_PAPER_4_T_12_SHAKTI_DUBEY_AIR_01_a4856b93ff.pdf",
    ],
    essay: [
      "https://forumias.com/blog/wp-content/uploads/2025/04/Shakti-Dubey-UPSC-2024-Rank-1-MGP-Sample-Copy-1.pdf",
    ],
  },
};

async function main() {
  await mongoose.connect(MONGO_URI, { dbName: process.env.DB_NAME || "upscprepnotes" });
  console.log("Connected to MongoDB (upscprepnotes)");

  const existing = await Topper.findOne({ slug: SHAKTI.slug });
  if (!existing) {
    console.log(`✗ Topper with slug "${SHAKTI.slug}" not found. Creating...`);
    await Topper.create({
      firstName: "Shakti",
      lastName: "Dubey",
      rank: 1,
      year: 2024,
      slug: SHAKTI.slug,
      optionalSubject: "Mathematics",
      isFeatured: true,
      isIndexed: true,
    });
    console.log("✓ Created Shakti Dubey topper record");
  }

  const result = await Topper.updateOne(
    { slug: SHAKTI.slug },
    {
      $set: {
        freeAnswerCopyUrl: SHAKTI.freeAnswerCopyUrl,
        answerCopies: SHAKTI.answerCopies,
      },
    }
  );

  if (result.matchedCount > 0) {
    console.log(`✓ freeAnswerCopyUrl set → ${SHAKTI.freeAnswerCopyUrl}`);
    console.log(`✓ answerCopies populated (GS1: ${SHAKTI.answerCopies.gs1.length}, GS2: ${SHAKTI.answerCopies.gs2.length}, GS3: ${SHAKTI.answerCopies.gs3.length}, GS4: ${SHAKTI.answerCopies.gs4.length}, Essay: ${SHAKTI.answerCopies.essay.length})`);
  } else {
    console.log(`✗ Topper "${SHAKTI.slug}" not found. Run seed-featured.cjs first.`);
  }

  await mongoose.disconnect();
  console.log("Done");
}

main().catch(console.error);
