'use client';

import Link from 'next/link';
import { FaPlay, FaBrain } from 'react-icons/fa';

export default function FocusFinderBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">專注力訓練體驗</h1>
            <p className="text-xl text-blue-100 mb-6">
              在虛擬干擾中鍛鍊您的專注力，提升工作效率與生活品質
            </p>
            <Link
              href="/focus-finder"
              className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaPlay className="mr-2" />
              開始專注挑戰
            </Link>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
              <FaBrain className="text-white text-5xl md:text-6xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
