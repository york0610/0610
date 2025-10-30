'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import {
  FaArrowLeft,
  FaCube,
  FaBrain,
  FaHeart,
  FaUsers,
  FaBook,
  FaCheckCircle,
  FaLightbulb,
  FaClipboardList
} from 'react-icons/fa';

export default function Chapter1Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      
      {/* 返回按鈕 */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft />
          返回首頁
        </Link>
      </div>

      {/* 標題區塊 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaCube className="text-5xl text-blue-400" />
            <h1 className="text-5xl font-black text-white">第一章：立方體解析法</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            認識 ADHD 的多維度分析框架 - 從生物、心理、社會三個維度理解 ADHD
          </p>
        </motion.div>
      </div>

      {/* 核心內容 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 立方體解析法概述 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-blue-500/30 bg-blue-900/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaCube className="text-3xl text-blue-400" />
              <h3 className="text-2xl font-bold text-white">立方體解析法</h3>
            </div>
            <p className="text-slate-300 mb-4">
              ADHD 不是單一維度的問題，而是多個層面相互作用的結果。立方體解析法幫助我們從三個維度全面理解 ADHD。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">生物維度：神經生物學基礎</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">心理維度：認知和情緒過程</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">社會維度：環境和人際互動</span>
              </div>
            </div>
          </motion.div>

          {/* 生物維度 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaBrain className="text-3xl text-purple-400" />
              <h3 className="text-2xl font-bold text-white">生物維度</h3>
            </div>
            <p className="text-slate-300 mb-4">
              ADHD 的神經生物學基礎涉及神經遞質失衡和大腦結構差異。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">多巴胺和去甲腎上腺素失衡</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">前額葉皮質功能異常</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">遺傳因素的影響</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">神經影像學發現</span>
              </div>
            </div>
          </motion.div>

          {/* 心理維度 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-pink-500/30 bg-pink-900/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaLightbulb className="text-3xl text-pink-400" />
              <h3 className="text-2xl font-bold text-white">心理維度</h3>
            </div>
            <p className="text-slate-300 mb-4">
              ADHD 影響認知過程、情緒調節和行為控制。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-pink-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">注意力和專注困難</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-pink-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">執行功能障礙</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-pink-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">情緒調節困難</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-pink-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">衝動控制問題</span>
              </div>
            </div>
          </motion.div>

          {/* 社會維度 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-green-500/30 bg-green-900/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaUsers className="text-3xl text-green-400" />
              <h3 className="text-2xl font-bold text-white">社會維度</h3>
            </div>
            <p className="text-slate-300 mb-4">
              ADHD 在社會環境中的表現和人際互動的影響。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">家庭動態和養育方式</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">學校和工作環境適應</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">同儕關係和社交技能</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">文化和社會期望</span>
              </div>
            </div>
          </motion.div>

          {/* 診斷應用 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-orange-500/30 bg-orange-900/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaClipboardList className="text-3xl text-orange-400" />
              <h3 className="text-2xl font-bold text-white">診斷應用</h3>
            </div>
            <p className="text-slate-300 mb-4">
              立方體解析法在 ADHD 診斷中的實際應用。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">全面評估所有維度</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">識別個人特異性</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">制定個性化治療計劃</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">監測治療進展</span>
              </div>
            </div>
          </motion.div>

          {/* 實踐建議 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-cyan-500/30 bg-cyan-900/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaBook className="text-3xl text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">實踐建議</h3>
            </div>
            <p className="text-slate-300 mb-4">
              如何在日常生活中應用立方體解析法。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">了解自己的神經生物學特徵</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">發展心理應對策略</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">建立支持性社會環境</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-slate-300">定期評估和調整</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 深入了解 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-blue-500/30 bg-blue-900/20 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">🎯 核心要點</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-3">為什麼需要立方體解析法？</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>避免單一維度的片面理解</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>認識 ADHD 的複雜性和多樣性</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>制定更有效的治療方案</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>提高診斷的準確性和全面性</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-3">如何使用立方體解析法？</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>評估每個維度的特徵和強度</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>識別維度之間的相互作用</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>根據個人情況制定策略</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-blue-400">•</span>
                  <span>持續監測和調整方案</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
