import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker production builds
  images: {
    unoptimized: true, // Cloudflare handles image optimization
  },
};

export default nextConfig;
