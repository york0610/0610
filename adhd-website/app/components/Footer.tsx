'use client';

import Link from 'next/link';
import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ADHD 知多少</h3>
            <p className="text-gray-400">
              提供專業、可靠的ADHD相關資訊與支持，幫助您更好地理解和管理ADHD。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">快速連結</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">關於ADHD</Link></li>
              <li><Link href="/symptoms" className="text-gray-400 hover:text-white">症狀特徵</Link></li>
              <li><Link href="/resources" className="text-gray-400 hover:text-white">資源分享</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">聯絡我們</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">聯絡我們</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>contact@adhd-help.com</span>
              </li>
              <li>電話: (02) 1234-5678</li>
              <li>地址: 台北市信義區信義路五段7號</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">訂閱電子報</h4>
            <p className="text-gray-400 mb-4">訂閱以獲取最新資訊與資源</p>
            <div className="flex">
              <input
                type="email"
                placeholder="您的電子郵件"
                className="px-4 py-2 rounded-l text-gray-800 w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r">
                訂閱
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} ADHD 知多少. 版權所有.</p>
        </div>
      </div>
    </footer>
  );
}