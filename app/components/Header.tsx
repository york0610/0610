'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FaBrain, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <FaBrain className="text-2xl" />
              <span>ADHD 世界</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            <Link href="/" className="px-4 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              首頁
            </Link>
            <Link href="/focus-finder" className="px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors">
              尋焦挑戰
            </Link>
            <Link href="/#symptoms" className="px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors">
              症狀特徵
            </Link>
            
            {/* 資源分享下拉菜單 */}
            <div className="relative group">
              <button 
                className="px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                資源分享
                <FaChevronDown className="text-xs" />
              </button>
              
              {/* 下拉菜單內容 */}
              <div className="absolute left-0 mt-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link 
                    href="/resources/chapter1" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100"
                  >
                    <div className="font-semibold">📚 第一章：立方體解析法</div>
                    <div className="text-xs text-gray-500 mt-1">認識 ADHD 的多維度分析框架</div>
                  </Link>
                  <Link 
                    href="/resources/chapter2" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100"
                  >
                    <div className="font-semibold">🧠 第二章：神經科學基礎</div>
                    <div className="text-xs text-gray-500 mt-1">ADHD 的大腦科學解釋</div>
                  </Link>
                  <Link 
                    href="/resources/chapter3" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">💡 第三章：實踐策略</div>
                    <div className="text-xs text-gray-500 mt-1">日常生活中的應對技巧</div>
                  </Link>
                </div>
              </div>
            </div>
            <Link 
              href="/assessment" 
              className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              開始測驗
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            <Link 
              href="/" 
              className="block px-4 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              首頁
            </Link>
            <Link 
              href="/focus-finder" 
              className="block px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              尋焦挑戰
            </Link>
            <Link 
              href="/assessment" 
              className="block px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              ADHD 量表
            </Link>
            <Link 
              href="/#symptoms" 
              className="block px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              症狀特徵
            </Link>
            <div className="px-4 py-2">
              <button 
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                className="w-full text-left text-gray-600 hover:text-blue-600 font-medium flex items-center justify-between"
              >
                資源分享
                <FaChevronDown className={`text-xs transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesDropdownOpen && (
                <div className="mt-2 space-y-2 border-t border-gray-200 pt-2">
                  <Link 
                    href="/resources/chapter1" 
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setResourcesDropdownOpen(false);
                    }}
                  >
                    📚 第一章：立方體解析法
                  </Link>
                  <Link 
                    href="/resources/chapter2" 
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setResourcesDropdownOpen(false);
                    }}
                  >
                    🧠 第二章：神經科學基礎
                  </Link>
                  <Link 
                    href="/resources/chapter3" 
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setResourcesDropdownOpen(false);
                    }}
                  >
                    💡 第三章：實踐策略
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/assessment" 
              className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              開始測驗
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
