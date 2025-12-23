import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname:"images.unsplash.com",
        pathname:"/**",
        port:"",
      }
    ]
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
