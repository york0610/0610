import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除靜態導出（Netlify 使用自己的構建系統）
  // output: 'export',
  
  // 移除基礎路徑設置（Netlify 會自動處理）
  // basePath: process.env.NODE_ENV === 'production' ? '/0610' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/0610/' : '',
  
  // 圖像配置
  images: {
    unoptimized: true,  // 靜態導出時需要設置為 true
  },
  
  // 優化構建輸出
  experimental: {
    // 優化包導入
    optimizePackageImports: [
      'react-icons/fa',
      'framer-motion',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
    ]
  },
  
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
