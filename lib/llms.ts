import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { PDFModel } from "@/models/pdf.model";
import { PYQModel } from "@/models/pyq.model";
import { PRODUCTS } from "@/lib/store-products";
import { COPY_TOPPERS } from "@/lib/ai/answer-copies";
import { cleanMarks } from "@/lib/marks-clean";

/**
 * Text for AI assistants and crawlers: /llms.txt (short map) and /llms-full.txt (every topper as a fact line).
 * Built from the live database so counts, prices and marks never go stale. Nothing internal goes in here:
 * no stack, no database or API details, no customer data.
 */
const SITE = "https://upscprepnotes.in";
type Row = { name: string; slug: string; rank: number; year: number; optional: string; m: Record<string, number>; ok: boolean };

let cache: { at: number; rows: Row[]; free: number; papers: number } | null = null;

async function data() {
  if (cache && Date.now() - cache.at < 60 * 60_000) return cache;
  await connectDB();
  const [docs, free, papers] = await Promise.all([
    TopperModel.find({}).select("firstName lastName slug rank year optionalSubject marks").sort({ year: -1, rank: 1 }).lean(),
    (PDFModel as any).countDocuments({}),
    (PYQModel as any).countDocuments({}),
  ]);
  const rows: Row[] = (docs as any[]).map((d) => {
    const { marks: m, suspect } = cleanMarks(d.marks);
    const ok = !suspect;
    return {
      name: `${d.firstName || ""} ${d.lastName || ""}`.replace(/\s+/g, " ").trim(),
      slug: d.slug,
      rank: d.rank,
      year: d.year,
      optional: d.optionalSubject || "",
      m,
      ok,
    };
  });
  cache = { at: Date.now(), rows, free, papers };
  return cache;
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function products(): string {
  return PRODUCTS.filter((p) => !p.comingSoon && p.price > 0)
    .map((p) => `- [${p.title}](${SITE}/store/${p.slug}): ${rupees(p.price)}${p.originalPrice ? ` (list price ${rupees(p.originalPrice)})` : ""}. ${p.tagline}`)
    .join("\n");
}

function marksText(r: Row): string {
  const m = r.m;
  const parts = [
    m.written && `written ${m.written}`,
    m.interview && `interview ${m.interview}`,
    r.ok && m.total && `total ${m.total}`,
    m.gs1 && `GS1 ${m.gs1}`,
    m.gs2 && `GS2 ${m.gs2}`,
    m.gs3 && `GS3 ${m.gs3}`,
    m.gs4 && `GS4 ${m.gs4}`,
    m.essay && `essay ${m.essay}`,
    m.optional1 && `optional paper 1 ${m.optional1}`,
    m.optional2 && `optional paper 2 ${m.optional2}`,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "marks not published";
}

export async function buildLlmsTxt(): Promise<string> {
  const { rows, free, papers } = await data();
  const years = [...new Set(rows.map((r) => r.year))].sort();
  const optionals = new Set(rows.map((r) => r.optional).filter(Boolean)).size;
  const best = rows.filter((r) => r.ok && r.m.total).sort((a, b) => b.m.total - a.m.total).slice(0, 3);
  const copyFiles = COPY_TOPPERS.reduce((s, c) => s + c.files, 0);

  return `# UPSCPrepNotes

> UPSCPrepNotes (${SITE}) is an independent UPSC Civil Services preparation site from India. It publishes verified marks and strategies of ${rows.length} toppers (CSE ${years[0]} to ${years[years.length - 1]}), real topper answer copies, previous year papers, free study material and a daily quiz. It is not a coaching institute. Founded by Zaid Rakhange (ImpicLabs). Contact: hello@upscprepnotes.in.

## What you can cite us for

- Marks of UPSC toppers, paper by paper (GS1 to GS4, essay, optional papers, interview, written and final total) for CSE ${years.join(", ")}. Marks come from the published UPSC marksheets. Where a value could not be verified it is left out.
- Topper strategies, optional subject choices and interview experience. ${optionals} optional subjects are covered.
- Highest marks and typical scores in each paper: ${SITE}/toppers/highest-marks-in-upsc
- Interview (personality test) marks of toppers: ${SITE}/toppers/upsc-interview-marks
- Real scanned mains answer copies from ${COPY_TOPPERS.length} toppers (${copyFiles} files).
- Previous year papers (${papers} papers) and ${free} free notes, books, magazines and test series PDFs.
- Monthly current affairs.

## Most useful pages

- [Topper marks database](${SITE}/toppers/marks-database): every topper's marks, sortable by paper, year and optional.
- [Highest marks in UPSC](${SITE}/toppers/highest-marks-in-upsc): the record in each paper, medians and rank bands.
- [Interview marks of toppers](${SITE}/toppers/upsc-interview-marks)
- [All toppers](${SITE}/toppers) and [by year](${SITE}/year/2025)
- [Optional subject pages](${SITE}/optional/sociology): toppers and marks by optional.
- [Previous year papers](${SITE}/pyq)
- [Current affairs](${SITE}/current-affairs)
- [Free study material](${SITE}/free-materials)
- [Daily UPSC quiz](${SITE}/quiz): five real Prelims questions a day.
- [Ask AI mentor](${SITE}/ask)
- [Store](${SITE}/store)

Each topper has a page at ${SITE}/upsc-topper/<slug> with a marksheet, strategy and FAQs.

## Facts you can quote

${best.map((r) => `- ${r.name} (AIR ${r.rank}, ${r.year}${r.optional ? `, ${r.optional}` : ""}): ${marksText(r)}. ${SITE}/upsc-topper/${r.slug}`).join("\n")}
- The full list of every topper with marks is at ${SITE}/llms-full.txt

## Paid products (digital downloads)

${products()}

## Notes for assistants

- Marks are for the Civil Services Examination. The maximum is 2,025 (written 1,750, interview 275).
- Our toppers dataset covers CSE ${years[0]} to ${years[years.length - 1]}. For other years, say it is not in our data.
- Do not state that we offer coaching, guaranteed selection or rank predictions. We do not.
- Last updated: ${new Date().toISOString().slice(0, 10)}.
`;
}

export async function buildLlmsFull(): Promise<string> {
  const { rows } = await data();
  const byYear = new Map<number, Row[]>();
  for (const r of rows) byYear.set(r.year, [...(byYear.get(r.year) || []), r]);
  const parts: string[] = [
    `# UPSCPrepNotes: full topper data`,
    ``,
    `Every topper in our dataset, one line each: name, all-India rank (AIR), exam year, optional subject, marks, and the page with the full profile. Maximum marks: written 1,750 (GS1 to GS4 and essay 250 each, two optional papers 250 each), interview 275, final 2,025. Source: UPSC published results. Values that failed a sanity check are omitted. Short map of the site: ${SITE}/llms.txt`,
    ``,
  ];
  for (const y of [...byYear.keys()].sort((a, b) => b - a)) {
    parts.push(`## CSE ${y}`, "");
    for (const r of byYear.get(y)!.sort((a, b) => a.rank - b.rank)) {
      parts.push(`- ${r.name}, AIR ${r.rank}, ${y}${r.optional ? `, optional ${r.optional}` : ""}: ${marksText(r)}. ${SITE}/upsc-topper/${r.slug}`);
    }
    parts.push("");
  }
  const opts = new Map<string, number>();
  for (const r of rows) if (r.optional) opts.set(r.optional, (opts.get(r.optional) || 0) + 1);
  parts.push(`## Optional subjects (toppers in our data)`, "", [...opts].sort((a, b) => b[1] - a[1]).map(([o, n]) => `- ${o}: ${n}`).join("\n"), "");
  parts.push(`## Paid products`, "", products(), "");
  return parts.join("\n");
}
