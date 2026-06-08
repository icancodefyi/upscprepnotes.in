import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const contentSlugs = [
      "upsc-full-form",
      "upsc-syllabus",
      "upsc-free-material",
      "upsc-full-form-hindi",
      "how-to-write-upsc-mains-answers",
    ];
    return contentSlugs.map((slug) => ({
      source: `/${slug}`,
      destination: `/content/${slug}`,
    }));
  },
};

export default nextConfig;
