import type { MetadataRoute } from "next";

// AI search and answer engines are welcome on public pages: being cited there sends us students.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "CCBot",
];

const PRIVATE = ["/api/", "/admin/", "/ask", "/download/", "/store/success", "/store/download-preparing"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://upscprepnotes.in/sitemap.xml",
    host: "https://upscprepnotes.in",
  };
}
