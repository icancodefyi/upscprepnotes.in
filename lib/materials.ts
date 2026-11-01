import { connectDB } from "@/lib/mongodb";
import { PDFModel } from "@/models/pdf.model";
import { FreeMaterialLeadModel } from "@/models/free-material-lead.model";

import { CATEGORY, CATEGORY_ORDER, type Collection, type Resource } from "@/lib/materials-meta";

export { CATEGORY, CATEGORY_ORDER };
export type { Collection, Resource };

/** Unique emails that asked for anything in a collection. Leads are stored per file as "{slug}" or "{slug}-{index}". */
async function requestCounts(slugs: string[]) {
  const rows = (await FreeMaterialLeadModel.aggregate([{ $group: { _id: "$pdfSlug", emails: { $addToSet: "$email" } } }])) as {
    _id: string;
    emails: string[];
  }[];
  // Longest slug first, so "vision-ias-test-series-2026" doesn't swallow a longer sibling slug.
  const ordered = [...slugs].sort((a, b) => b.length - a.length);
  const sets = new Map<string, Set<string>>();
  for (const r of rows) {
    const owner = ordered.find((s) => r._id === s || (r._id.startsWith(`${s}-`) && /^\d+$/.test(r._id.slice(s.length + 1))));
    if (!owner) continue;
    const set = sets.get(owner) ?? new Set<string>();
    r.emails.forEach((e) => set.add(e));
    sets.set(owner, set);
  }
  return new Map([...sets].map(([k, v]) => [k, v.size]));
}

type RawPdf = {
  slug: string;
  title: string;
  description?: string;
  category: string;
  brand?: string;
  language?: string;
  year?: number;
  fileSize?: string;
  pageCount?: number;
  tags?: string[];
  resources?: Resource[];
  updatedAt?: Date;
};

const toCollection = (p: RawPdf, requests: Map<string, number>): Collection => ({
  slug: p.slug,
  title: p.title,
  description: p.description ?? "",
  category: p.category,
  brand: p.brand ?? "",
  language: p.language ?? "en",
  year: p.year ?? null,
  fileSize: p.fileSize ?? "",
  pageCount: p.pageCount ?? 0,
  tags: p.tags ?? [],
  files: Math.max(p.resources?.length ?? 0, 1),
  requests: requests.get(p.slug) ?? 0,
  hindi: p.language === "hi" || p.language === "both" || (p.resources ?? []).some((r) => r.language === "hi" || r.language === "both"),
  updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
});

export async function getCollections() {
  await connectDB();
  const raw = (await PDFModel.find({}, { "resources.downloadUrl": 0, "resources.sourceUrl": 0 }).sort({ createdAt: -1 }).lean()) as unknown as RawPdf[];
  const requests = await requestCounts(raw.map((p) => p.slug));
  return raw.map((p) => toCollection(p, requests));
}

export async function getCollection(slug: string) {
  await connectDB();
  const p = (await PDFModel.findOne({ slug }).lean()) as unknown as (RawPdf & { downloadUrl?: string; imagekitUrl?: string; sourceUrl?: string }) | null;
  if (!p) return null;
  const all = (await PDFModel.find({}, { slug: 1 }).lean()) as unknown as { slug: string }[];
  const requests = await requestCounts(all.map((x) => x.slug));
  const files: Resource[] = p.resources?.length
    ? p.resources.map((r) => ({ name: r.name, downloadUrl: r.downloadUrl, section: r.section || "", language: r.language || "en" }))
    : [{ name: p.title, downloadUrl: p.downloadUrl || p.imagekitUrl || "", section: "", language: p.language || "en" }];
  return { meta: toCollection(p, requests), raw: p, files, single: !p.resources?.length };
}
