import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // Correct format: use an empty object or configure with options
  },
};

export default nextConfig;
