import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    return contentSlugs.map((slug) => ({
      source: `/${slug}`,
      destination: `/content/${slug}`,
    }));
  },
};

export default nextConfig;
