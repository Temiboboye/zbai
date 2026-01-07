import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // For Cloudflare Pages compatibility
  images: {
    unoptimized: true, // Cloudflare handles image optimization
  },
};

export default nextConfig;
