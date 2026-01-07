import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Cloudflare Pages handles the build automatically
  // No need for 'output: standalone' - it breaks local dev
  images: {
    unoptimized: true, // Cloudflare handles image optimization
  },
};

export default nextConfig;
