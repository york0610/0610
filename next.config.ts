import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Netlify 部署配置
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
