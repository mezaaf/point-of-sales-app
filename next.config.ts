import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: [
      "https://zrfywyajdtqwwjiobeys.supabase.co",
      "https://zrfywyajdtqwwjiobeys.storage.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "udjnxminjlvhfmvlbhwy.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "udjnxminjlvhfmvlbhwy.storage.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
