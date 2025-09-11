import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
  },
  eslint: {
    // ✅ Don’t fail the build on ESLint errors (like "no-explicit-any")
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
