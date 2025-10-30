import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,  // 在 Netlify 上建議設置為 true
  },
  output: 'standalone',  // 生成獨立的輸出目錄
  compress: true,       // 啟用 gzip 壓縮
  productionBrowserSourceMaps: true,  // 生產環境生成 source maps
  
  // 優化構建輸出
  experimental: {
    // 優化包導入
    optimizePackageImports: [
      'react-icons/fa',
      'framer-motion',
    ]
  },
  // 啟用 SWC 的優化
  swcMinify: true,
  
  // 編譯器選項
  compiler: {
    // 啟用 styled-components 的樣式組件名稱
    styledComponents: true,
    // 啟用 React 移除屬性引號
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  // 添加靜態頁面緩存控制
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

export default nextConfig;
