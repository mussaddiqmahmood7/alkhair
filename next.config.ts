import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'u5ashl9c87vsngao.public.blob.vercel-storage.com',
        port: '',
        pathname: '/products/**',
      },
    ],
  },
};

export default nextConfig;
