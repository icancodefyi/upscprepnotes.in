import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;
const OUTPUT_DIR = path.join(__dirname, "..", "public", "open-data");

const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Topper = mongoose.model("Topper", schema, "toppers");

interface TopperRow {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  essay: number | null;
  gs1: number | null;
  gs2: number | null;
  gs3: number | null;
  gs4: number | null;
  optional1: number | null;
  optional2: number | null;
  written: number | null;
  interview: number | null;
  total: number | null;
  slug: string;
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toppersToCsv(rows: TopperRow[]): string {
  const headers = [
    "firstName", "lastName", "rank", "year", "optionalSubject",
    "essay", "gs1", "gs2", "gs3", "gs4",
    "optional1", "optional2", "written", "interview", "total", "slug",
  ];

  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escapeCsv((r as any)[h])).join(","));
  }
  return lines.join("\n");
}

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });

  const allToppers = await Topper.find({}, {
    firstName: 1, lastName: 1, rank: 1, year: 1, optionalSubject: 1,
    marks: 1, slug: 1, _id: 0,
  })
    .sort({ year: -1, rank: 1 })
    .lean();

  console.log(`Found ${allToppers.length} toppers total`);

  const rows: TopperRow[] = allToppers.map((t: any) => ({
    firstName: t.firstName || "",
    lastName: t.lastName || "",
    rank: t.rank ?? 0,
    year: t.year ?? 0,
    optionalSubject: t.optionalSubject || "",
    essay: t.marks?.essay ?? null,
    gs1: t.marks?.gs1 ?? null,
    gs2: t.marks?.gs2 ?? null,
    gs3: t.marks?.gs3 ?? null,
    gs4: t.marks?.gs4 ?? null,
    optional1: t.marks?.optional1 ?? null,
    optional2: t.marks?.optional2 ?? null,
    written: t.marks?.written ?? null,
    interview: t.marks?.interview ?? null,
    total: t.marks?.total ?? null,
    slug: t.slug || "",
  }));

  const byYear: Record<number, TopperRow[]> = {};
  for (const r of rows) {
    if (!byYear[r.year]) byYear[r.year] = [];
    byYear[r.year].push(r);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write full dataset
  const fullCsv = toppersToCsv(rows);
  fs.writeFileSync(path.join(OUTPUT_DIR, "upsc-topper-marks.csv"), fullCsv);
  console.log(`Wrote upsc-topper-marks.csv (${rows.length} rows)`);

  // Write per-year files
  const readmeParts: string[] = [];
  readmeParts.push("# UPSC CSE Topper Marks — Open Dataset");
  readmeParts.push("");
  readmeParts.push("This dataset contains verified marks of UPSC Civil Services Examination toppers, sourced from official UPSC results and topper interviews.");
  readmeParts.push("");
  readmeParts.push("Data sourced from [UPSCPrepNotes.in](https://upscprepnotes.in). Full analysis at [upscprepnotes.in/upsc-syllabus](https://upscprepnotes.in/upsc-syllabus).");
  readmeParts.push("");
  readmeParts.push("## Schema");
  readmeParts.push("");
  readmeParts.push("| Column | Type | Description |");
  readmeParts.push("|--------|------|-------------|");
  readmeParts.push("| firstName | string | Topper's first name |");
  readmeParts.push("| lastName | string | Topper's last name |");
  readmeParts.push("| rank | int | UPSC CSE rank |");
  readmeParts.push("| year | int | Examination year |");
  readmeParts.push("| optionalSubject | string | Optional subject chosen |");
  readmeParts.push("| essay | int | Essay marks (out of 250) |");
  readmeParts.push("| gs1 | int | GS Paper 1 marks (out of 250) |");
  readmeParts.push("| gs2 | int | GS Paper 2 marks (out of 250) |");
  readmeParts.push("| gs3 | int | GS Paper 3 marks (out of 250) |");
  readmeParts.push("| gs4 | int | GS Paper 4 marks (out of 250) |");
  readmeParts.push("| optional1 | int | Optional Paper 1 marks |");
  readmeParts.push("| optional2 | int | Optional Paper 2 marks |");
  readmeParts.push("| written | int | Total written marks |");
  readmeParts.push("| interview | int | Interview/personality test marks |");
  readmeParts.push("| total | int | Final total marks |");
  readmeParts.push("| slug | string | Profile slug on UPSCPrepNotes |");
  readmeParts.push("");
  readmeParts.push("## Files");
  readmeParts.push("");
  readmeParts.push("| File | Contents |");
  readmeParts.push("|------|----------|");
  readmeParts.push(`| upsc-topper-marks.csv | Complete dataset (${rows.length} toppers) |`);

  for (const year of Object.keys(byYear).sort((a, b) => Number(b) - Number(a))) {
    const yearRows = byYear[Number(year)];
    const yCsv = toppersToCsv(yearRows);
    fs.writeFileSync(path.join(OUTPUT_DIR, `upsc-topper-marks-${year}.csv`), yCsv);
    console.log(`Wrote upsc-topper-marks-${year}.csv (${yearRows.length} rows)`);
    readmeParts.push(`| upsc-topper-marks-${year}.csv | ${year} toppers (${yearRows.length}) |`);
  }

  readmeParts.push("");
  readmeParts.push("## License");
  readmeParts.push("");
  readmeParts.push("This data is compiled from publicly available UPSC results. No copyright claimed.");
  readmeParts.push("Source: [UPSCPrepNotes.in](https://upscprepnotes.in)");

  fs.writeFileSync(path.join(OUTPUT_DIR, "README.md"), readmeParts.join("\n"));
  console.log("Wrote README.md");

  console.log(`\nDataset ready at ${OUTPUT_DIR}`);
  console.log("To publish to GitHub:");
  console.log("  cd public/open-data");
  console.log("  git init && git add . && git commit -m 'initial topper marks dataset'");
  console.log("  gh repo create upsc-topper-marks --public --push --source=.");

  await mongoose.disconnect();
}

main();
