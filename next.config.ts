import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/upsc-full-form",
        destination: "/content/upsc-full-form",
      },
      {
        source: "/upsc-syllabus",
        destination: "/content/upsc-syllabus",
      },
      {
        source: "/upsc-free-material",
        destination: "/content/upsc-free-material",
      },
      {
        source: "/upsc-full-form-hindi",
        destination: "/content/upsc-full-form-hindi",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/pdf",
        destination: "/free-materials",
        permanent: true,
      },
      {
        source: "/pdf/:path*",
        destination: "/free-materials/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
