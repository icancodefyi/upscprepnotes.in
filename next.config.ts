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
