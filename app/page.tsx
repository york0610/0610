'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import {
  FaArrowRight,
  FaBolt,
  FaBrain,
  FaBook,
  FaCheckCircle,
  FaChild,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaGamepad,
  FaHeart,
  FaPlay,
  FaVideo,
  FaUsers,
  FaVolumeUp,
  FaLightbulb,
  FaHeartbeat,
  FaComments,
  FaClipboard
} from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 英雄區塊 */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_50%)]" />
        </div>
        
        <header className="relative mx-auto max-w-7xl px-6 pb-20 pt-28">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 border border-blue-500/30 px-6 py-3 text-sm font-bold text-blue-300">
                <FaBrain className="animate-pulse" />
                認識注意力不足過動症
              </span>
            </motion.div>
            
            <motion.h1 
              className="mt-10 bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 bg-clip-text text-6xl font-black text-transparent sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              ADHD 知多少
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-2xl font-bold text-cyan-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              認識注意力不足過動症
            </motion.p>
            
            <motion.p 
              className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              注意力不足過動症（ADHD）是一種神經發展障礙，影響全球數百萬人。成人症狀常被低估，臨床辨識與就醫率顯著低於實際盛行率。
              <br /><br />
              <span className="font-bold text-cyan-300">症狀必須在 12 歲之前出現，持續至少六個月，並在多個生活情境中造成明顯的功能障礙。</span>
            </motion.p>

            {/* 核心數據 */}
            <motion.div 
              className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="rounded-2xl border border-blue-800/30 bg-blue-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-400">
                  <FaUsers />
                  <span>2–4%</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">成人盛行率</p>
                <p className="mt-1 text-xs text-slate-500">全球估計值</p>
              </div>
              <div className="rounded-2xl border border-cyan-800/30 bg-cyan-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-cyan-400">
                  <FaChild />
                  <span>5–10%</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">兒童盛行率</p>
                <p className="mt-1 text-xs text-slate-500">全球估計值</p>
              </div>
              <div className="rounded-2xl border border-teal-800/30 bg-teal-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-teal-400">
                  <FaExclamationTriangle />
                  <span>低識別</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">成人診斷率</p>
                <p className="mt-1 text-xs text-slate-500">遠低於實際盛行率</p>
              </div>
              <div className="rounded-2xl border border-orange-800/30 bg-orange-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-orange-400">
                  <FaHeartbeat />
                  <span>↑ 上升</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">台灣診斷率</p>
                <p className="mt-1 text-xs text-slate-500">2000–2011 年間</p>
              </div>
            </motion.div>
          </div>
        </header>
      </div>

      {/* 睡眠問題重要提示 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          className="rounded-3xl border border-amber-800/50 bg-gradient-to-r from-amber-900/30 to-orange-900/30 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20">
              <FaExclamationTriangle className="text-2xl text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-amber-300 mb-3">😴 睡眠問題是 ADHD 的重要共伴護理項目</h3>
              <p className="text-slate-300 mb-4">
                睡眠問題在青少年 ADHD 族群中顯著常見，並顯著影響日常與學業功能。建議在評估與介入中常見納入。
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex gap-2">
                  <FaCheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">改善睡眠有助提升日間功能與課業表現</span>
                </div>
                <div className="flex gap-2">
                  <FaCheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">睡眠不足會加重 ADHD 症狀</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ADHD 三種類型 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-4xl font-black text-white mb-12">ADHD 的三種類型</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* 類型 1：注意力不足型 */}
          <motion.div 
            className="rounded-3xl border border-blue-800/30 bg-blue-900/10 p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">
                <FaEye className="text-3xl text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">注意力不足型</h3>
                <p className="text-blue-300">Predominantly Inattentive</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              主要表現為注意力方面的困難，症狀較不明顯，常被誤認為懶惰或缺乏動力。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-400 mt-1" />
                <span className="text-sm text-slate-400">難以持續專注，容易分心</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-400 mt-1" />
                <span className="text-sm text-slate-400">經常遺失物品，做事缺乏組織性</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-400 mt-1" />
                <span className="text-sm text-slate-400">難以完成任務細節，常犯粗心錯誤</span>
              </div>
            </div>
          </motion.div>

          {/* 類型 2：過動-衝動型 */}
          <motion.div 
            className="rounded-3xl border border-purple-800/30 bg-purple-900/10 p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20">
                <FaBolt className="text-3xl text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">過動-衝動型</h3>
                <p className="text-purple-300">Predominantly Hyperactive-Impulsive</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              以過動和衝動行為為主，較容易被察覺，特別是在兒童時期。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-purple-400 mt-1" />
                <span className="text-sm text-slate-400">坐立不安，話多，難以安靜</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-purple-400 mt-1" />
                <span className="text-sm text-slate-400">經常打斷他人，難以等待</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-purple-400 mt-1" />
                <span className="text-sm text-slate-400">衝動行為，難以控制脾氣</span>
              </div>
            </div>
          </motion.div>

          {/* 類型 3：混合型 */}
          <motion.div 
            className="rounded-3xl border border-orange-800/30 bg-orange-900/10 p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20">
                <FaBrain className="text-3xl text-orange-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">混合型</h3>
                <p className="text-orange-300">Combined Presentation</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              同時具有注意力不足和過動-衝動的症狀，是最常見的類型。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-orange-400 mt-1" />
                <span className="text-sm text-slate-400">結合注意力不足的特徵</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-orange-400 mt-1" />
                <span className="text-sm text-slate-400">結合過動-衝動的特徵</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-orange-400 mt-1" />
                <span className="text-sm text-slate-400">症狀表現最為複雜多樣</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 開始體驗 CTA */}
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-4xl font-black text-white mb-6">準備好體驗了嗎？</h2>
        <p className="text-xl text-slate-300 mb-8">
          通過互動遊戲，親身體驗 ADHD 患者在日常生活中面臨的挑戰。
          <br />
          這不是遊戲，這是一場 60 秒的同理心之旅。
        </p>
        <Link
          href="/focus-finder/prototype"
          className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-12 py-6 text-xl font-black text-white shadow-2xl transition-all hover:scale-105"
        >
          <FaPlay className="text-2xl" />
          開始體驗
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}