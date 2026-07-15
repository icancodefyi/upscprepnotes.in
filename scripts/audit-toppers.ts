import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;
const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Topper = mongoose.model("Topper", schema, "toppers");

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });

  for (const slug of ["rajeshwari-suve-m-rank-2-2025", "akansh-dhull-rank-3-2025"]) {
    const t = await Topper.findOne({ slug }).lean();
    if (!t) { console.log(`\n=== ${slug} NOT FOUND ===`); continue; }

    console.log(`\n=== ${t.firstName} ${t.lastName} (AIR ${t.rank}, ${t.year}) ===`);
    console.log(`Optional: ${t.optionalSubject}`);
    console.log(`Marks: Essay=${t.marks?.essay}, GS1=${t.marks?.gs1}, GS2=${t.marks?.gs2}, GS3=${t.marks?.gs3}, GS4=${t.marks?.gs4}`);
    console.log(`Opt1=${t.marks?.optional1}, Opt2=${t.marks?.optional2}`);
    console.log(`Written=${t.marks?.written}, Interview=${t.marks?.interview}, Total=${t.marks?.total}`);
    console.log(`isIndexed: ${t.isIndexed}`);
    console.log(`isFeatured: ${t.isFeatured}`);
    console.log(`Bio length: ${t.bio?.length || 0} chars`);
    console.log(`Strategy length: ${t.strategy?.length || 0} chars`);
    console.log(`Insights count: ${t.insights?.length || 0}`);
    console.log(`FAQs count: ${t.faqs?.length || 0}`);
    console.log(`Slug: ${t.slug}`);
  }

  await mongoose.disconnect();
}
main();
