import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { PYQModel } from "@/models/pyq.model";
import { PDFModel } from "@/models/pdf.model";
import { getAllPYQYears } from "@/data/upsc/pyq/cse-pyq";
import syllabusPage from "@/data/content/upsc-syllabus";
import fullFormPage from "@/data/content/upsc-full-form";
import freeMaterialPage from "@/data/content/upsc-free-material";
import fullFormHindiPage from "@/data/content/upsc-full-form-hindi";
import answerWritingPage from "@/data/content/how-to-write-upsc-mains-answers";

const OPTIONAL_SUBJECTS = [
  "psir", "public-administration", "mathematics", "sociology",
  "geography", "philosophy", "anthropology", "history",
];

const CONTENT_SLUGS = [
  "upsc-full-form",
  "upsc-syllabus",
  "upsc-free-material",
  "upsc-full-form-hindi",
  "how-to-write-upsc-mains-answers",
  "upsc-topper-answer-copies",
];

const YEAR_KEYS = ["2022", "2023", "2024", "2025"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://upscprepnotes.in";
  await connectDB();

  // Static pages (always current)
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/toppers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/pyq`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/toppers/toppers-copy-compilation`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/ask`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/free-materials`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  // Content pages — use real lastUpdated from data files
  const contentMap: Record<string, string> = {
  "upsc-full-form": fullFormPage.lastUpdated,
  "upsc-syllabus": syllabusPage.lastUpdated,
  "upsc-free-material": freeMaterialPage.lastUpdated,
  "upsc-full-form-hindi": fullFormHindiPage.lastUpdated,
  "how-to-write-upsc-mains-answers": answerWritingPage.lastUpdated,
  "upsc-topper-answer-copies": "2026-06-13",
  };
  const contentPages: MetadataRoute.Sitemap = CONTENT_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(contentMap[slug]),
    changeFrequency: "weekly",
    priority: 0.9,
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

  // PYQ year pages — use latest PYQ model update as timestamp
  const latestPYQ = await PYQModel.findOne({}).sort({ updatedAt: -1 }).select("updatedAt").lean();
  const pyqLastModified = (latestPYQ as any)?.updatedAt || new Date();
  const pyqYears = await getAllPYQYears();
  const pyqPages: MetadataRoute.Sitemap = pyqYears.map((year) => ({
    url: `${baseUrl}/pyq/${year}`,
    lastModified: new Date(pyqLastModified),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Optional subject pages — use latest topper update as signal
  const latestOptionalTopper = await TopperModel.findOne({})
    .sort({ updatedAt: -1 })
    .select("updatedAt")
    .lean();
  const optionalLastModified = (latestOptionalTopper as any)?.updatedAt || new Date();
  const optionalPages: MetadataRoute.Sitemap = OPTIONAL_SUBJECTS.map((sub) => ({
    url: `${baseUrl}/optional/${sub}`,
    lastModified: new Date(optionalLastModified),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // PDF resource pages
  const pdfs = await PDFModel.find({}).select("slug updatedAt").lean();
  const pdfPages: MetadataRoute.Sitemap = pdfs.map((p: any) => ({
    url: `${baseUrl}/free-materials/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Year pages
  const yearPages: MetadataRoute.Sitemap = YEAR_KEYS.map((year) => ({
    url: `${baseUrl}/year/${year}`,
    lastModified: new Date(pyqLastModified),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...contentPages,
    ...topperPages,
    ...pyqPages,
    ...optionalPages,
    ...yearPages,
    ...pdfPages,
  ];
}
