import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/ask"],
      },
    ],
    sitemap: "https://upscprepnotes.in/sitemap.xml",
  };
}
