import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

const ORIGINAL_INDEXED: [number, number][] = [
  [2025, 1], [2025, 2], [2025, 3], [2025, 4], [2025, 5], [2025, 6], [2025, 7],
  [2025, 8], [2025, 9], [2025, 10], [2025, 15],
  [2024, 2], [2024, 6], [2024, 11], [2024, 13], [2024, 18], [2024, 20], [2024, 21],
  [2024, 26], [2024, 27], [2024, 35], [2024, 37], [2024, 38], [2024, 40],
  [2023, 11], [2023, 15], [2023, 16], [2023, 17], [2023, 18], [2023, 25], [2023, 29],
  [2023, 69], [2023, 70], [2023, 80], [2023, 156], [2023, 342], [2023, 372],
  [2023, 389], [2023, 470], [2023, 578], [2023, 662],
  [2022, 1], [2022, 2], [2022, 3], [2022, 4], [2022, 5], [2022, 18], [2022, 21],
  [2022, 23], [2022, 36], [2022, 76], [2022, 105], [2022, 110], [2022, 130],
  [2022, 148], [2022, 303], [2022, 374], [2022, 397], [2022, 516], [2022, 610],
];

async function main() {
  await connectDB();

  const reset = await TopperModel.updateMany({}, { $set: { isIndexed: false } });
  console.log("RESET_ALL_TO_FALSE:", reset.modifiedCount);

  let restored = 0;
  for (const [year, rank] of ORIGINAL_INDEXED) {
    const r = await TopperModel.updateOne({ year, rank }, { $set: { isIndexed: true } });
    if (r.modifiedCount > 0) restored++;
    else {
      const found = await TopperModel.findOne({ year, rank }).select("firstName lastName rank year").lean();
      console.log(`NOT_FOUND year=${year} rank=${rank} → ${found ? `${(found as any).firstName} ${(found as any).lastName}` : "no record"}`);
    }
  }
  console.log("RESTORED:", restored);

  const total = await TopperModel.countDocuments({});
  const indexed = await TopperModel.countDocuments({ isIndexed: true });
  const hidden = await TopperModel.countDocuments({ isIndexed: { $ne: true } });
  console.log("TOTAL:", total, "INDEXED:", indexed, "HIDDEN:", hidden);

  const hiddenWithCopies = await TopperModel.find({
    isIndexed: { $ne: true },
    $or: [{ freeAnswerCopyUrl: { $nin: [null, ""] } }, { freeAnswerCopyUrls: { $nin: [[], null] } }],
  })
    .select("firstName lastName rank year")
    .lean();
  console.log("STILL_HIDDEN (incl with copies):", hiddenWithCopies.length);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
