'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import {
  FaArrowLeft,
  FaLightbulb,
  FaClock,
  FaBrain,
  FaHeartbeat,
  FaUsers,
  FaPills,
  FaAppleAlt,
  FaCheckCircle,
  FaBook,
  FaBullseye
} from 'react-icons/fa';

export default function Chapter3Page() {
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
            <FaLightbulb className="text-5xl text-yellow-400" />
            <h1 className="text-5xl font-black text-white">第三章：實踐策略與自我管理</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            ADHD 患者的日常應對技巧 - 從時間管理到生活方式的完整實踐指南
          </p>
        </motion.div>
      </div>

      {/* 核心原則 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-yellow-500/30 bg-yellow-900/20 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">🎯 核心原則</h2>
          <p className="text-lg text-slate-300 mb-4">
            不要「對抗」大腦，而是「管理」大腦。
          </p>
          <p className="text-slate-300">
            我們需要建立一個「外部支架」(Scaffolding) 來輔助內在（PFC）功能的不足。這意味著創造環境、系統和習慣，來補償大腦的執行功能困難。
          </p>
        </motion.div>
      </div>

      {/* 時間管理 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
          <FaClock className="text-blue-400" />
          時間管理和組織策略
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-2xl border border-blue-500/30 bg-blue-900/20 p-6">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">⏱️ 戰勝「時間盲」</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">使用計時器（番茄鐘）</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">大型行事曆或白板</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">沙漏或視覺計時器</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">手機提醒和鬧鐘</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-900/20 p-6">
            <h3 className="text-2xl font-bold text-cyan-300 mb-4">📋 拆解任務</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">每個步驟 5 分鐘內完成</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">具體、可測量的目標</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">逐步完成，獲得成就感</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">使用檢查清單</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-6">
            <h3 className="text-2xl font-bold text-purple-300 mb-4">🎵 啟動儀式</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">工作前泡咖啡</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">聽同一首歌或播放清單</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">整理工作區域</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">深呼吸或簡短冥想</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 注意力提升 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
          <FaBrain className="text-green-400" />
          注意力提升技巧
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-2xl border border-green-500/30 bg-green-900/20 p-6">
            <h3 className="text-2xl font-bold text-green-300 mb-4">🏠 環境控制</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">使用降噪耳機</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">清理桌面</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">關閉通知和社交媒體</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">使用應用程式阻止工具</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-orange-500/30 bg-orange-900/20 p-6">
            <h3 className="text-2xl font-bold text-orange-300 mb-4">👥 身體雙重任務</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">在圖書館或咖啡廳工作</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">與朋友一起工作</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">線上共同工作空間</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">ADHD 支持小組</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-pink-500/30 bg-pink-900/20 p-6">
            <h3 className="text-2xl font-bold text-pink-300 mb-4">✍️ 主動式專注</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-pink-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">手寫筆記（優於打字）</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-pink-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">提出問題和討論</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-pink-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">製作心智圖或摘要</span>
              </li>
              <li className="flex gap-2 text-slate-300">
                <FaCheckCircle className="text-pink-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">教別人你學到的東西</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 情緒調節 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-red-500/30 bg-red-900/20 p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <FaHeartbeat className="text-red-400" />
            情緒調節方法
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-300 mb-3">🏷️ 命名情緒</h3>
              <p className="text-slate-300 text-sm">
                當情緒上來時，先辨識並命名它。這能啟動 PFC，拉回理智。
              </p>
            </div>

            <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-300 mb-3">⏸️ 建立「暫停空間」</h3>
              <p className="text-slate-300 text-sm">
                感覺要爆發時，立刻離開現場，給自己 10 分鐘冷卻。
              </p>
            </div>

            <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-300 mb-3">🎯 辨識「情緒飢餓」</h3>
              <p className="text-slate-300 text-sm">
                辨識自己是在尋求刺激還是在逃避壓力。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 生活方式調整 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
          <FaAppleAlt className="text-red-400" />
          生活方式調整（優化硬體效能）
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-500/30 bg-blue-900/20 p-6">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">😴 睡眠</h3>
            <p className="text-slate-300 mb-4">
              睡眠不足會使 PFC 功能「斷線」，是第一優先。
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>每晚 7-9 小時</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>固定睡眠時間</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>避免藍光</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-900/20 p-6">
            <h3 className="text-2xl font-bold text-green-300 mb-4">🏃 運動</h3>
            <p className="text-slate-300 mb-4">
              天然的利他能，立即提升多巴胺和去甲腎上腺素。
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-green-400">•</span>
                <span>每週 150 分鐘</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">•</span>
                <span>有氧運動效果最佳</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">•</span>
                <span>改善情緒和專注力</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-orange-500/30 bg-orange-900/20 p-6">
            <h3 className="text-2xl font-bold text-orange-300 mb-4">🍎 飲食</h3>
            <p className="text-slate-300 mb-4">
              足夠蛋白質、避免血糖劇烈波動。
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-orange-400">•</span>
                <span>足夠蛋白質（神經遞質原料）</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">•</span>
                <span>避免精緻澱粉和糖</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">•</span>
                <span>規律進食</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 最後的話 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-cyan-500/30 bg-cyan-900/20 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">💪 你可以做到</h2>
          <p className="text-lg text-slate-300 mb-4">
            ADHD 不是你的錯，但管理它是你的責任。
          </p>
          <p className="text-slate-300">
            這些策略不是「修復」你的大腦，而是幫助你與自己的大腦和諧共處。每個人的 ADHD 都不同，所以試驗不同的策略，找到最適合你的方法。記住：進展不是線性的，但每一小步都是勝利。
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
