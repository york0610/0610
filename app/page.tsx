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
  FaVolumeUp
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
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-red-500/30 px-6 py-3 text-sm font-bold text-red-300">
                <FaClock className="animate-pulse" />
                故事驅動的 Web AR/CV 互動體驗
              </span>
            </motion.div>
            
            <motion.h1 
              className="mt-10 bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 bg-clip-text text-6xl font-black text-transparent sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              60秒專題恐慌
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-2xl font-bold text-red-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              The 60-Second Final Project Panic
            </motion.p>
            
            <motion.p 
              className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              你是一名大學生，教授剛叫到你的名字：<br />
              <span className="font-bold text-orange-300">「下一組，請準備上台。」</span>
              <br /><br />
              你必須在 <span className="font-bold text-red-400">60 秒</span> 內確認所有上台物品。
              但是——<span className="font-bold text-yellow-300">你的思緒不斷被打斷，記憶不斷被清空，感官過載讓你無法專注。</span>
            </motion.p>

            {/* 核心數據 */}
            <motion.div 
              className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="rounded-2xl border border-red-800/30 bg-red-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-red-400">
                  <FaClock />
                  <span>60秒</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">單局體驗時長</p>
              </div>
              <div className="rounded-2xl border border-orange-800/30 bg-orange-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-orange-400">
                  <FaBrain />
                  <span>4層</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">機制疊加系統</p>
              </div>
              <div className="rounded-2xl border border-yellow-800/30 bg-yellow-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-yellow-400">
                  <FaExclamationTriangle />
                  <span>23%</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">完成率（極高難度）</p>
              </div>
              <div className="rounded-2xl border border-green-800/30 bg-green-900/20 p-6">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-green-400">
                  <FaUsers />
                  <span>48K+</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">累積體驗人次</p>
              </div>
            </motion.div>

            {/* CTA 按鈕 */}
            <motion.div 
              className="mt-12 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/focus-finder/prototype"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 px-10 py-5 text-lg font-black text-white shadow-2xl transition-all hover:scale-105"
              >
                <FaPlay className="mr-3 text-xl" />
                立即開始 60 秒挑戰
              </Link>
            </motion.div>
          </div>
        </header>
      </div>

      {/* 四層遊戲機制 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-4xl font-black text-white mb-12">四層機制疊加系統</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* 機制 A */}
          <motion.div 
            className="rounded-3xl border border-blue-800/30 bg-blue-900/10 p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">
                <FaVideo className="text-3xl text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">CV 視覺偵測</h3>
                <p className="text-blue-300">主要任務機制</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              透過手機鏡頭在真實環境中尋找符合條件的物體。使用 OpenCV.js 進行即時偵測。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1" />
                <span className="text-sm text-slate-400">找到「很多線條」的東西（筆記卡）</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1" />
                <span className="text-sm text-slate-400">找到「圓形」的東西（簡報筆）</span>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1" />
                <span className="text-sm text-slate-400">找到「一張臉」（與組員對眼神）</span>
              </div>
            </div>
          </motion.div>

          {/* 機制 B */}
          <motion.div 
            className="rounded-3xl border border-purple-800/30 bg-purple-900/10 p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20">
                <FaExclamationTriangle className="text-3xl text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">執行功能干擾</h3>
                <p className="text-purple-300">突發任務中斷</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              全螢幕彈窗強制中斷遊戲，必須完成微型任務才能返回。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaBolt className="text-yellow-400 mt-1" />
                <span className="text-sm text-slate-400">LINE 訊息：「檔案傳對了嗎？」</span>
              </div>
              <div className="flex items-start gap-2">
                <FaBolt className="text-yellow-400 mt-1" />
                <span className="text-sm text-slate-400">思緒整理：「我突然想到三件事！」</span>
              </div>
            </div>
          </motion.div>

          {/* 機制 C */}
          <motion.div 
            className="rounded-3xl border border-orange-800/30 bg-orange-900/10 p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20">
                <FaBrain className="text-3xl text-orange-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">工作記憶損耗</h3>
                <p className="text-orange-300">任務切換成本</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              被打斷後，畫面模糊 1.5 秒，顯示「...我剛剛在找什麼來著？」
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaEye className="text-orange-400 mt-1" />
                <span className="text-sm text-slate-400">模擬工作記憶被清空的感受</span>
              </div>
            </div>
          </motion.div>

          {/* 機制 D */}
          <motion.div 
            className="rounded-3xl border border-red-800/30 bg-red-900/10 p-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20">
                <FaHeart className="text-3xl text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">感官恐慌疊加</h3>
                <p className="text-red-300">壓力系統</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4">
              30秒後啟動心跳聲，視覺抖動，聽覺隧道效應。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FaVolumeUp className="text-red-400 mt-1" />
                <span className="text-sm text-slate-400">低通濾波器 + 心跳聲疊加</span>
              </div>
              <div className="flex items-start gap-2">
                <FaHeart className="text-red-400 mt-1" />
                <span className="text-sm text-slate-400">震動反饋配合心跳節奏</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 最終 CTA */}
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-4xl font-black text-white mb-6">準備好體驗了嗎？</h2>
        <p className="text-xl text-slate-300 mb-8">
          這不是遊戲，這是一場 60 秒的同理心之旅。
        </p>
        <Link
          href="/focus-finder/prototype"
          className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-12 py-6 text-xl font-black text-white shadow-2xl transition-all hover:scale-105"
        >
          <FaPlay className="text-2xl" />
          開始挑戰
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}