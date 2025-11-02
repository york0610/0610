'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FaBrain, FaBars, FaTimes, FaChevronDown, FaGamepad } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2 text-xl font-bold transition-all">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
              >
                <FaBrain className="text-2xl text-cyan-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ADHD 世界
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            <Link href="/" className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium rounded-lg hover:bg-slate-800/50 transition-all">
              首頁
            </Link>
            <Link href="/focus-finder" className="px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all">
              尋焦挑戰
            </Link>
            <Link href="/#learn-more" className="px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all">
              症狀特徵
            </Link>

            {/* 資源分享下拉菜單 */}
            <div className="relative group">
              <button
                className="px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all flex items-center gap-1"
              >
                資源分享
                <FaChevronDown className="text-xs group-hover:rotate-180 transition-transform" />
              </button>

              {/* 下拉菜單內容 */}
              <div className="absolute left-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/resources/chapter1"
                    className="block px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400 transition-all border-b border-slate-800/50"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <span>📚</span>
                      <span>第一章：立方體解析法</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">認識 ADHD 的多維度分析框架</div>
                  </Link>
                  <Link
                    href="/resources/chapter2"
                    className="block px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400 transition-all border-b border-slate-800/50"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <span>🧠</span>
                      <span>第二章：神經科學基礎</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">ADHD 的大腦科學解釋</div>
                  </Link>
                  <Link
                    href="/resources/chapter3"
                    className="block px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400 transition-all"
                  >
                    <div className="font-semibold flex items-center gap-2">
                      <span>💡</span>
                      <span>第三章：實踐策略</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">日常生活中的應對技巧</div>
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/assessment"
              className="px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all"
            >
              開始測驗
            </Link>
            <Link
              href="/focus-finder/prototype"
              className="ml-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:scale-105 transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
            >
              <FaGamepad />
              <span>開始遊戲</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-cyan-400 p-2"
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800/50"
          >
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-cyan-400 font-medium rounded-lg hover:bg-slate-800/50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                首頁
              </Link>
              <Link
                href="/focus-finder"
                className="block px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                尋焦挑戰
              </Link>
              <Link
                href="/assessment"
                className="block px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                ADHD 量表
              </Link>
              <Link
                href="/#learn-more"
                className="block px-4 py-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                症狀特徵
              </Link>
              <div className="px-4 py-2">
                <button
                  onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                  className="w-full text-left text-slate-300 hover:text-cyan-400 font-medium flex items-center justify-between"
                >
                  資源分享
                  <FaChevronDown className={`text-xs transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {resourcesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-2 border-t border-slate-800/50 pt-2"
                    >
                      <Link
                        href="/resources/chapter1"
                        className="block px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition-all"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setResourcesDropdownOpen(false);
                        }}
                      >
                        📚 第一章：立方體解析法
                      </Link>
                      <Link
                        href="/resources/chapter2"
                        className="block px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition-all"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setResourcesDropdownOpen(false);
                        }}
                      >
                        🧠 第二章：神經科學基礎
                      </Link>
                      <Link
                        href="/resources/chapter3"
                        className="block px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition-all"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setResourcesDropdownOpen(false);
                        }}
                      >
                        💡 第三章：實踐策略
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/focus-finder/prototype"
                className="block px-4 py-3 mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg text-center hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaGamepad />
                <span>開始遊戲</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
