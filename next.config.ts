import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/upsc-full-form",
        destination: "/content/upsc-full-form",
      },
    ];
  },
};

export default nextConfig;
