import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { getAllPYQYears } from "@/data/upsc/pyq/cse-pyq";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://upscprepnotes.in";

  // Static pages
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
  ];

  // Content pages
  const contentSlugs = [
    "upsc-full-form",
    "upsc-syllabus",
    "upsc-free-material",
    "upsc-full-form-hindi",
  ];
  const contentPages: MetadataRoute.Sitemap = contentSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Topper profile pages (from MongoDB)
  await connectDB();
  const toppers = await TopperModel.find({ isIndexed: true })
    .select("slug updatedAt")
    .lean();
  const topperPages: MetadataRoute.Sitemap = toppers.map((t: any) => ({
    url: `${baseUrl}/upsc-topper/${t.slug}`,
    lastModified: t.updatedAt || new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // PYQ year pages
  const pyqYears = await getAllPYQYears();
  const pyqPages: MetadataRoute.Sitemap = pyqYears.map((year) => ({
    url: `${baseUrl}/pyq/${year}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Optional subject pages
  const optionalSubjects = [
    "psir", "public-administration", "mathematics", "sociology",
    "geography", "philosophy", "anthropology", "history",
  ];
  const optionalPages: MetadataRoute.Sitemap = optionalSubjects.map((sub) => ({
    url: `${baseUrl}/optional/${sub}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...contentPages,
    ...topperPages,
    ...pyqPages,
    ...optionalPages,
  ];
}
