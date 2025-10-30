"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import Script from 'next/script';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { getAudioManager } from './utils/audioManager';

// 載入中文字體
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ADHD 知多少 - 認識注意力不足過動症',
  description: '提供專業的ADHD相關資訊、資源與支持',
};

// 預加載音頻的組件
function AudioPreloader() {
  useEffect(() => {
    // 只在客戶端執行
    if (typeof window !== 'undefined') {
      const audioManager = getAudioManager();
      // 預加載所有音頻
      audioManager.preloadAllAudio().catch(console.error);
    }
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-full`}>
        <Header />
        {children}
        <Footer />
        <AudioPreloader />
        
        {/* 添加性能監控 */}
        <Script
          id="performance-monitoring"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'performance' in window) {
                // 監聽頁面性能指標
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    console.log('[Performance]', entry.name, entry.duration);
                  }
                });
                observer.observe({ entryTypes: ['measure', 'paint', 'longtask'] });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
