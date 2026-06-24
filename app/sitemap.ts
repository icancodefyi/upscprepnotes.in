import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

import { PRODUCTS } from "@/lib/store-products";
import { getAllPYQYears } from "@/data/upsc/pyq/cse-pyq";
import { getAllSlugs, getPage } from "@/data/content/registry";
import syllabusPage from "@/data/content/upsc-syllabus";
import fullFormPage from "@/data/content/upsc-full-form";
import freeMaterialPage from "@/data/content/upsc-free-material";
import fullFormHindiPage from "@/data/content/upsc-full-form-hindi";
import answerWritingPage from "@/data/content/how-to-write-upsc-mains-answers";
import syllabusHindiPage from "@/data/content/upsc-syllabus-hindi";
import freeMaterialHindiPage from "@/data/content/upsc-free-material-hindi";
import answerWritingHindiPage from "@/data/content/how-to-write-upsc-mains-answers-hindi";

const CONTENT_SLUGS = getAllSlugs();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://upscprepnotes.in";
  await connectDB();

  // Static pages (always current)
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/toppers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/toppers/marks-database`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/pyq`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/toppers/toppers-copy-compilation`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/ask`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.3 },
    { url: `${baseUrl}/free-materials`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/free-materials/vision-ias-test-series-2026-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/forum-ias-ethics-handouts-notes-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/manorama-year-book-2026-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/yojana-magazine-monthly-pdf-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/speedy-current-affairs-2026-book-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/psir-optional-test-series-upsc-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/drishti-ias-notes-2025-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/shankar-ias-environment-10th-edition-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/vision-ias-monthly-current-affairs-magazine-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/free-materials/daily-current-affairs-2025-hindi-english-v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/current-affairs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/current-affairs/may-2026`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/current-affairs/2025`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/current-affairs/download`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Content pages — use real lastUpdated from data files
  const contentMap: Record<string, string> = {
  "upsc-full-form": fullFormPage.lastUpdated,
  "upsc-syllabus": syllabusPage.lastUpdated,
  "upsc-free-material": freeMaterialPage.lastUpdated,
  "upsc-full-form-hindi": fullFormHindiPage.lastUpdated,
  "how-to-write-upsc-mains-answers": answerWritingPage.lastUpdated,
  "upsc-topper-answer-copies": "2026-06-13",
  "upsc-syllabus-hindi": "2026-06-16",
  "upsc-free-material-hindi": "2026-06-16",
  "how-to-write-upsc-mains-answers-hindi": "2026-06-16",
  };
  const contentPages: MetadataRoute.Sitemap = CONTENT_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(contentMap[slug] || "2026-06-24"),
    changeFrequency: "weekly",
    priority: slug.startsWith("how-to-score") || slug.includes("optional-300") ? 0.85 : 0.9,
  }));

  // Topper profile pages (from MongoDB)
  const toppers = await TopperModel.find({ isIndexed: true })
    .select("slug")
    .lean();
  const topperPages: MetadataRoute.Sitemap = toppers.map((t: any) => ({
    url: `${baseUrl}/upsc-topper/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // PYQ years (from DB)
  const pyqYears = await getAllPYQYears();
  const pyqPages: MetadataRoute.Sitemap = pyqYears.map((year) => ({
    url: `${baseUrl}/pyq/${year}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  // Optional subject pages
  const optionalSubjects = [
    "sociology", "psir", "anthropology", "geography", "history",
    "public-administration", "economics", "philosophy", "psychology",
    "law", "commerce", "agriculture", "medical-science",
  ];
  const optionalPages: MetadataRoute.Sitemap = optionalSubjects.map((subject) => ({
    url: `${baseUrl}/optional/${subject}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Store pages
  const storePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    ...PRODUCTS.map((p) => ({
      url: `${baseUrl}/store/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return [
    ...staticPages,
    ...contentPages,
    ...pyqPages,
    ...optionalPages,
    ...topperPages,
    ...storePages,
  ];
}
