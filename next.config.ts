import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.brigades.fr",
      },
    ],
  },
};

export default nextConfig;
