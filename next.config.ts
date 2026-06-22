import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/upsc-topper/toppers-copy-compilation",
        destination: "/toppers/toppers-copy-compilation",
        permanent: true,
      },
      // Free materials — old slugs → new v2 slugs (Edward: new URL for fresh indexing)
      { source: "/free-materials/vision-ias-test-series-2026", destination: "/free-materials/vision-ias-test-series-2026-v2", permanent: true },
      { source: "/free-materials/forum-ias-ethics-handouts-notes", destination: "/free-materials/forum-ias-ethics-handouts-notes-v2", permanent: true },
      { source: "/free-materials/manorama-year-book-2026", destination: "/free-materials/manorama-year-book-2026-v2", permanent: true },
      { source: "/free-materials/yojana-magazine-monthly-pdf", destination: "/free-materials/yojana-magazine-monthly-pdf-v2", permanent: true },
      { source: "/free-materials/speedy-current-affairs-2026-book", destination: "/free-materials/speedy-current-affairs-2026-book-v2", permanent: true },
      { source: "/free-materials/psir-optional-test-series-upsc", destination: "/free-materials/psir-optional-test-series-upsc-v2", permanent: true },
      { source: "/free-materials/drishti-ias-notes-2025", destination: "/free-materials/drishti-ias-notes-2025-v2", permanent: true },
      { source: "/free-materials/shankar-ias-environment-10th-edition", destination: "/free-materials/shankar-ias-environment-10th-edition-v2", permanent: true },
      { source: "/free-materials/vision-ias-monthly-current-affairs-magazine", destination: "/free-materials/vision-ias-monthly-current-affairs-magazine-v2", permanent: true },
      { source: "/free-materials/daily-current-affairs-2025-hindi-english", destination: "/free-materials/daily-current-affairs-2025-hindi-english-v2", permanent: true },
    ];
  },
  async rewrites() {
    const contentSlugs = [
      "upsc-full-form",
      "upsc-syllabus",
      "upsc-free-material",
      "upsc-full-form-hindi",
      "how-to-write-upsc-mains-answers",
      "upsc-topper-answer-copies",
    ];
    const contentRewrites = contentSlugs.map((slug) => ({
      source: `/${slug}`,
      destination: `/content/${slug}`,
    }));
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      ...contentRewrites,
    ];
  },
};

export default nextConfig;
