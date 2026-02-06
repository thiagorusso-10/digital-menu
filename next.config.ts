import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite qualquer domínio para MVP
      },
    ],
  },
};

export default nextConfig;
