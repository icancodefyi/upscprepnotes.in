import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;

const schema = new mongoose.Schema({}, { strict: false });
const Topper = mongoose.model("Topper", schema, "toppers");

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  const toppers = await Topper.find({ year: 2025 }).sort({ rank: 1 }).lean();
  console.log(`Total 2025 toppers: ${toppers.length}\n`);
  for (const t of toppers) {
    const any = t as any;
    const hasFree = any.freeAnswerCopyUrl || (any.freeAnswerCopyUrls?.length > 0) ? "✅ download" : "";
    const hasBio = any.bio?.trim() ? "✅ bio" : "";
    const hasStrategy = any.strategy?.trim() ? "✅ strategy" : "";
    console.log(`AIR ${any.rank} | ${any.firstName} ${any.lastName} | ${any.slug} | ${any.optionalSubject || "N/A"} ${hasFree} ${hasBio} ${hasStrategy}`);
  }
  await mongoose.disconnect();
}
main();
