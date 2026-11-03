/**
 * Adds official UPSC CSE Mains GS and Essay question paper links (upsc.gov.in) for years the PYQ
 * pages were missing. Existing rows are left alone.   npx tsx scripts/seed-mains-pyq-papers.mts [--dry]
 */
import fs from "node:fs";
import mongoose from "mongoose";
for (const l of fs.readFileSync(".env.local", "utf8").split("\n")) {
  if (!l.includes("=") || l.trim().startsWith("#")) continue;
  const i = l.indexOf("="); const k = l.slice(0, i).trim();
  if (!process.env[k]) process.env[k] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
}
const B = "https://www.upsc.gov.in/sites/default/files/";
const PAPERS: Record<number, [string, string][]> = {
  2019: [["Essay", "QP-CSM19-Essay.pdf"], ["GS PAPER I", "QP-CSM19-GeneralStudies-I.pdf"], ["GS PAPER II", "QP-CSM19-GeneralStudies-II.pdf"], ["GS PAPER III", "QP-CSM19-GeneralStudies-III.pdf"], ["GS PAPER IV", "QP-CSM19-GeneralStudies-IV.pdf"]],
  2021: [["Essay", "QP-CSM-21-ESSAY-110122.pdf"], ["GS PAPER I", "QP-CSM-21-GENSTUDIESPAPER-I-110122.pdf"], ["GS PAPER II", "QP-CSM-21-GENSTUDIESPAPER-II-110122.pdf"], ["GS PAPER III", "QP-CSM-21-GENSTUDIESPAPER-III-110122.pdf"], ["GS PAPER IV", "QP-CSM-21-GENSTUDIESPAPER-IV-110122.pdf"]],
  2022: [["Essay", "QP-CSM-22-ESSAY-190922.pdf"], ["GS PAPER I", "QP-CSM-22-GENERAL-STUDIES-PAPER%20I-190922.pdf"], ["GS PAPER II", "QP-CSM-22-GENERAL-STUDIES-PAPER-II-190922.pdf"], ["GS PAPER III", "QP-CSM-22-GENERAL-STUDIES-PAPER-III-190922.pdf"], ["GS PAPER IV", "QP-CSM-22-GENERAL-STUDIES-PAPER%20IV-190922.pdf"]],
  2026: [["Essay", "QP-CSM-26-010926-ESSAY.pdf"], ["GS PAPER I", "QP-CSM-26-010926-GENERAL%20STUDIES%20PAPER%20-%20I.pdf"], ["GS PAPER II", "QP-CSM-26-010926-GENERAL-STUDIES-PAPER%20-%20II.pdf"], ["GS PAPER III", "QP-CSM-26-010926-GENERAL-STUDIES-PAPER-III.pdf"], ["GS PAPER IV", "QP-CSM-26-010926-GENERAL-STUDIES-PAPER-IV.pdf"]],
};
await mongoose.connect(process.env.MONGODB_URI!, { dbName: process.env.DB_NAME });
const PYQ = mongoose.model("PYQ", new mongoose.Schema({}, { strict: false, timestamps: true }), "pyqs");
let n = 0;
for (const [y, list] of Object.entries(PAPERS)) for (const [title, file] of list) {
  const category = title === "Essay" ? "Mains – Essay" : "Mains – General Studies";
  const url = B + file;
  if (process.argv.includes("--dry")) { console.log(y, category, title, url); continue; }
  const r = await PYQ.updateOne({ year: Number(y), category, title }, { $setOnInsert: { year: Number(y), category, title, url } }, { upsert: true });
  n += r.upsertedCount;
}
console.log("added", n);
await mongoose.disconnect();
