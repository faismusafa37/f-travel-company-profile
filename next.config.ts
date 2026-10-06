import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-mariadb", "mariadb"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      }
    ],
  },
  experimental: {
    // Hostinger kills extra build processes under its process/memory limits,
    // so keep the build to a single worker with lower peak memory.
    cpus: 1,
    webpackMemoryOptimizations: true,
    optimizePackageImports: ["lucide-react", "recharts"],
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
