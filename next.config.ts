import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.leonardo.ai', pathname: '/users/**' },
      { protocol: 'https', hostname: 'leonardo-cdn.tryleonardo.com', pathname: '/users/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/users/**' },
      { protocol: 'https', hostname: 'pwugkhfjsrpplxmhoamh.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },

};

export default nextConfig;
