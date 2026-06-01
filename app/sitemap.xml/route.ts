import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";

const SITE_URL = process.env.SITE_URL || "https://upscprepnotes.in";

export async function GET() {
  try {
    await connectDB();

    const toppers = await TopperModel.find({ isIndexed: true })
      .select("slug updatedAt createdAt")
      .lean()
      ;

    const pages = [
      { url: "", priority: 1.0 },
      { url: "about", priority: 0.7 },
      { url: "contact", priority: 0.5 },
      { url: "privacy-policy", priority: 0.5 },
      { url: "terms", priority: 0.5 },
      { url: "disclaimer", priority: 0.5 },
      { url: "optional/psir", priority: 0.9 },
      { url: "optional/public-administration", priority: 0.8 },
      { url: "optional/mathematics", priority: 0.8 },
      { url: "optional/sociology", priority: 0.8 },
      { url: "optional/geography", priority: 0.8 },
      { url: "optional/philosophy", priority: 0.8 },
      { url: "optional/anthropology", priority: 0.8 },
      { url: "optional/history", priority: 0.8 },
      { url: "ask", priority: 0.6 },
      { url: "toppers/toppers-copy-compilation", priority: 0.9 },
      { url: "pyq", priority: 0.9 },
    ];

    const urls = pages
      .map((p) => {
        return `<url><loc>${SITE_URL}/${p.url}</loc><priority>${p.priority}</priority></url>`;
      })
      .join("\n");

    const topperUrls = toppers
      .map((t: any) => {
        const loc = `${SITE_URL}/upsc-topper/${t.slug}`;
        const lastmod = t.updatedAt ? new Date(t.updatedAt).toISOString() : new Date(t.createdAt).toISOString();
        return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><priority>0.6</priority></url>`;
      })
      .join("\n");

    const yearUrls = [2022, 2023, 2024, 2025]
      .map((year) => {
        const loc = `${SITE_URL}/year/${year}`;
        return `<url><loc>${loc}</loc><priority>0.7</priority></url>`;
      })
      .join("\n");

    const pyqYearUrls = [2022, 2023, 2024, 2025]
      .map((year) => {
        const loc = `${SITE_URL}/pyq/${year}`;
        return `<url><loc>${loc}</loc><priority>0.8</priority></url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${topperUrls}
${yearUrls}
${pyqYearUrls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return new NextResponse("", { status: 500 });
  }
}
