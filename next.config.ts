import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-mariadb", "mariadb"],
  // Hostinger deploys only traced files, and Prisma loads its query compiler
  // .wasm via a dynamic path the tracer can't see, so include it explicitly.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/query_compiler_bg.wasm"],
  },
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
