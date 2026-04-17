import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.brigades.fr",
      },
      {
        protocol: "https",
        hostname: "chefmate-admin.zabar.fr", // legacy, keep during transition
      },
    ],
  },
};

export default nextConfig;
