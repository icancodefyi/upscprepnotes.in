const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function migrate() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.DB_NAME;

  if (!MONGODB_URI || !DB_NAME) {
    console.error("Missing MONGODB_URI or DB_NAME env vars");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
  });

  const db = mongoose.connection.db;

  const toppers = await db
    .collection("toppers")
    .find({})
    .toArray();

  console.log(`Found ${toppers.length} toppers`);

  for (const topper of toppers) {
    await db.collection("toppers").updateOne(
      { _id: topper._id },
      {
        $set: {
          firstName: topper.firstname,
          lastName: topper.lastname,

          optionalSubject: topper.optionalSub,

          marks: {
            gs1: topper.gs1marks,
            gs2: topper.gs2marks,
            gs3: topper.gs3marks,
            gs4: topper.gs4marks,

            essay: topper.essayMarks,

            optional1: topper.optional1Marks,
            optional2: topper.optional2Marks,

            interview: topper.interviewMarks,
            written: topper.writtenMarks,
            total: topper.totalMarks,
          },

          resources: {
            essayLinks: topper.essayLinks || [],
            gs1Links: topper.gs1Links || [],
            gs2Links: topper.gs2Links || [],
            gs3Links: topper.gs3Links || [],
            gs4Links: topper.gs4Links || [],
          },

          image: {
            profileImage: topper.ProfileImage,
            imageUrl: topper.imageUrl,
          },

          metadata: {
            migratedAt: topper.migratedAt,
            enrichedAt: topper.enrichedAt,
            lastTriedAt: topper.lastTriedAt,
          },
        },
      }
    );

    console.log(
      `Migrated ${topper.firstname} ${topper.lastname}`
    );
  }

  console.log("Migration complete.");

  await mongoose.disconnect();

  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);

  process.exit(1);
});