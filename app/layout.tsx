import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

// 載入中文字體
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ADHD 知多少 - 認識注意力不足過動症',
  description: '提供專業的ADHD相關資訊、資源與支持',
};

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
      </body>
    </html>
  );
}
