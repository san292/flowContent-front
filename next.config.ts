import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.leonardo.ai', pathname: '/users/**' },
      { protocol: 'https', hostname: 'leonardo-cdn.tryleonardo.com', pathname: '/users/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/users/**' },
    ],
  },
 
};

export default nextConfig;
