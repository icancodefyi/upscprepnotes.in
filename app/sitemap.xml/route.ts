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
      .limit(30);

    const pages = [
      { url: "", priority: 1.0 },
      { url: "toppers", priority: 0.8 },
      { url: "optional/psir", priority: 0.7 },
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

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${topperUrls}
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
