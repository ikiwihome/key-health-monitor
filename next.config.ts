import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 'export' 配置以支持 API 路由
  // output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
