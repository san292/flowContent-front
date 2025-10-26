import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.leonardo.ai' },
      { protocol: 'https', hostname: 'leonardo-cdn.tryleonardo.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
 
};

export default nextConfig;
