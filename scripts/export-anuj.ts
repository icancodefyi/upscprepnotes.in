require("dotenv").config({ path: ".env.local" });

const { connectDB } = require("@/lib/mongodb");
const { TopperModel } = require("@/models/topper.model");

async function main() {
  await connectDB();
  console.log("Connected to MongoDB");

  const topper = await TopperModel.findOne({
    slug: "anuj-agnihotri-rank-1-2025",
  }).lean();

  if (!topper) {
    console.error("Topper not found");
    process.exit(1);
  }

  console.log(JSON.stringify(topper, null, 2));
  process.exit(0);
}

main().catch(console.error);
