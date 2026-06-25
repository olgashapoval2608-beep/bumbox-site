import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Linting is handled separately; never block a production build on lint noise.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Serve modern formats and let Next generate responsive sizes for the
    // many local photographs used across the experience.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

export default nextConfig;
