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

      {/* ADHD 的成人症狀 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-white mb-4">成人 ADHD 的常見症狀</h2>
          <p className="text-xl text-slate-300">許多成人 ADHD 患者直到成年後才被診斷，因為症狀表現方式與兒童不同</p>
        </motion.div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: FaClock, title: '時間管理困難', desc: '難以估計時間，經常遲到或錯過截止日期' },
            { icon: FaClipboard, title: '組織能力弱', desc: '工作和生活空間混亂，難以制定計劃' },
            { icon: FaBrain, title: '記憶問題', desc: '短期記憶不佳，容易忘記重要信息' },
            { icon: FaExclamationTriangle, title: '情緒調節困難', desc: '情緒波動大，容易感到沮喪或過度興奮' },
            { icon: FaComments, title: '社交困難', desc: '難以傾聽他人，容易打斷或說話過多' },
            { icon: FaHeartbeat, title: '衝動行為', desc: '做決定前缺乏思考，容易衝動消費' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-cyan-500/50 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="text-2xl text-cyan-400" />
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ADHD 的診斷和治療 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* 診斷 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-white mb-6">🔍 ADHD 的診斷</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-500/30 bg-blue-900/20 p-4">
                <h3 className="font-bold text-blue-300 mb-2">臨床評估</h3>
                <p className="text-sm text-slate-300">由專業醫生進行詳細的病史採集和症狀評估</p>
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4">
                <h3 className="font-bold text-cyan-300 mb-2">心理測試</h3>
                <p className="text-sm text-slate-300">使用標準化測試工具（如 ADHD-RS、CAARS）評估症狀嚴重程度</p>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-teal-900/20 p-4">
                <h3 className="font-bold text-teal-300 mb-2">排除其他疾病</h3>
                <p className="text-sm text-slate-300">確保症狀不是由其他醫學或心理健康狀況引起</p>
              </div>
              <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-4">
                <h3 className="font-bold text-green-300 mb-2">多角度評估</h3>
                <p className="text-sm text-slate-300">收集來自家庭、工作或學校的多方面信息</p>
              </div>
            </div>
          </motion.div>

          {/* 治療 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-white mb-6">💊 ADHD 的治療方法</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-purple-500/30 bg-purple-900/20 p-4">
                <h3 className="font-bold text-purple-300 mb-2">藥物治療</h3>
                <p className="text-sm text-slate-300">刺激類或非刺激類藥物可幫助改善注意力和衝動控制</p>
              </div>
              <div className="rounded-xl border border-pink-500/30 bg-pink-900/20 p-4">
                <h3 className="font-bold text-pink-300 mb-2">行為療法</h3>
                <p className="text-sm text-slate-300">認知行為療法（CBT）幫助改善組織能力和情緒管理</p>
              </div>
              <div className="rounded-xl border border-orange-500/30 bg-orange-900/20 p-4">
                <h3 className="font-bold text-orange-300 mb-2">生活方式調整</h3>
                <p className="text-sm text-slate-300">規律作息、運動、冥想和時間管理技巧</p>
              </div>
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4">
                <h3 className="font-bold text-yellow-300 mb-2">教育和支持</h3>
                <p className="text-sm text-slate-300">了解 ADHD、加入支持小組、獲得工作或學校的適應措施</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ADHD 的影響 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-red-800/30 bg-gradient-to-r from-red-900/20 to-orange-900/20 p-8"
        >
          <h2 className="text-3xl font-black text-white mb-6">⚠️ ADHD 的長期影響</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold text-red-300 mb-3">如果不進行治療</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-slate-300">
                  <span className="text-red-400">•</span>
                  <span>學業成績下降或無法完成教育</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-red-400">•</span>
                  <span>工作表現不佳，頻繁換工作</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-red-400">•</span>
                  <span>人際關係困難和社交孤立</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-red-400">•</span>
                  <span>心理健康問題（焦慮、抑鬱）</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-red-400">•</span>
                  <span>物質濫用風險增加</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-300 mb-3">通過適當治療和支持</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>改善學業和工作表現</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>建立更好的人際關係</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>提升自尊和自信</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>減少心理健康問題</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>提高生活質量和滿意度</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 重要提醒 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          className="rounded-3xl border border-cyan-800/50 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-cyan-300 mb-4">💡 重要提醒</h3>
          <p className="text-slate-300 mb-4">
            ADHD 是一種神經發展差異，不是性格缺陷或智力問題。許多成功的人士都有 ADHD，他們通過了解自己、尋求幫助和制定適應策略而蓬勃發展。
          </p>
          <p className="text-slate-300">
            如果你懷疑自己或親友可能患有 ADHD，請諮詢醫療專業人士進行評估。早期診斷和干預可以顯著改善生活質量。
          </p>
        </motion.div>
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