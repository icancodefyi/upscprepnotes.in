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

    const any = t as any;
    console.log(`\n=== ${any.firstName} ${any.lastName} (AIR ${any.rank}, ${any.year}) ===`);
    console.log(`Optional: ${any.optionalSubject}`);
    console.log(`Marks: Essay=${any.marks?.essay}, GS1=${any.marks?.gs1}, GS2=${any.marks?.gs2}, GS3=${any.marks?.gs3}, GS4=${any.marks?.gs4}`);
    console.log(`Opt1=${any.marks?.optional1}, Opt2=${any.marks?.optional2}`);
    console.log(`Written=${any.marks?.written}, Interview=${any.marks?.interview}, Total=${any.marks?.total}`);
    console.log(`isIndexed: ${any.isIndexed}`);
    console.log(`isFeatured: ${any.isFeatured}`);
    console.log(`Bio length: ${any.bio?.length || 0} chars`);
    console.log(`Strategy length: ${any.strategy?.length || 0} chars`);
    console.log(`Insights count: ${any.insights?.length || 0}`);
    console.log(`FAQs count: ${any.faqs?.length || 0}`);
    console.log(`Slug: ${any.slug}`);
  }

  await mongoose.disconnect();
}
main();
