const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const NAMES = [
  "Ishita Kishore",
  "Garima Lohia",
  "Divya Tanwar",
  "Shakti Dubey",
  "UMA Harathi",
  "Smriti Mishra",
  "Harshita Goyal"
];


const topperSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    rank: Number,
    year: Number,
    optionalSubject: String,
    marks: {
      gs1: Number,
      gs2: Number,
      gs3: Number,
      gs4: Number,
      essay: Number,
      optional1: Number,
      optional2: Number,
      interview: Number,
      written: Number,
      total: Number,
    },
    bio: String,
    strategy: String,
    slug: { type: String, unique: true },
    ProfileImage: String,
    insights: [String],
    answerCopies: {
      gs1: [String],
      gs2: [String],
      gs3: [String],
      gs4: [String],
      essay: [String],
    },
    isFeatured: { type: Boolean, default: false },
    isIndexed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TopperModel = mongoose.model("Topper", topperSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.DB_NAME;

  if (!MONGODB_URI || !DB_NAME) {
    console.error("Missing MONGODB_URI or DB_NAME env vars");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });

  for (const fullName of NAMES) {
    const parts = fullName.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";
    const slug = slugify(fullName);

    const res = await TopperModel.updateOne(
      { $or: [{ slug }, { firstName, lastName }] },
      {
        $set: { isFeatured: true, isIndexed: true },
        $setOnInsert: {
          firstName,
          lastName,
          slug,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(
      `${fullName} -> updated (matched:${res.matchedCount}, upserted:${res.upsertedCount || 0})`
    );
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
