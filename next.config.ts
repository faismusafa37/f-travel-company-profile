import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    cpus: 1,
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
