'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FaClock,
  FaPlay,
  FaBrain,
  FaExclamationTriangle,
  FaUsers,
  FaGamepad,
  FaBullseye,
  FaTasks,
  FaCamera,
  FaHeadphones,
  FaMagic,
  FaStar,
  FaArrowRight,
  FaChartLine,
  FaVolumeUp,
  FaEye,
  FaHeart
} from 'react-icons/fa';
import GlassCard, { FeatureCard, StatCard } from '../components/GlassCard';
import { FloatingText, GradientText } from '../components/AnimatedText';



export default function FocusFinderPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1),transparent_70%)]" />

        {/* Animated particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <header className="relative mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="text-center">
          {/* Badge */}
          <FloatingText delay={0}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-red-500/30 px-6 py-3 text-sm font-bold text-red-300 backdrop-blur-sm shadow-lg"
            >
              <FaClock className="animate-pulse" />
              <span>90 秒沉浸式 ADHD 體驗</span>
              <FaStar className="text-yellow-400 animate-pulse" />
            </motion.div>
          </FloatingText>

          {/* Title */}
          <FloatingText delay={0.2}>
            <h1 className="mt-12 text-6xl font-black sm:text-7xl lg:text-8xl">
              <GradientText gradient="from-red-400 via-orange-400 to-yellow-400">
                Focus Finder
              </GradientText>
            </h1>
          </FloatingText>

          {/* Subtitle */}
          <FloatingText delay={0.4}>
            <p className="mt-6 text-2xl font-bold">
              <GradientText gradient="from-orange-300 to-red-300">
                ADHD 認知挑戰模擬器
              </GradientText>
            </p>
          </FloatingText>

          {/* Description */}
          <FloatingText delay={0.6}>
            <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-slate-300">
              歡迎來到 <span className="text-cyan-400 font-semibold">Focus Finder</span> - 一個讓你親身體驗 ADHD 認知挑戰的互動遊戲。
              <br /><br />
              <span className="font-bold text-yellow-300">🎯 你的任務看似簡單</span>：在 90 秒內使用手機鏡頭找到日常物件。
              <br />
              <span className="font-bold text-red-400">⚡ 但現實很複雜</span>：你會不斷被突發的干擾任務打斷。
              <br />
              <span className="font-bold text-orange-300">🧠 這就是 ADHD 大腦的日常</span>：每個干擾都必須先處理，才能回到原本的任務。
              <br /><br />
              <span className="text-lg font-semibold text-emerald-300">這不只是遊戲，這是一場 90 秒的同理心之旅。</span>
            </p>
          </FloatingText>

          {/* Statistics */}
          <FloatingText delay={0.8}>
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              <StatCard
                value="90秒"
                label="沉浸式體驗"
                sublabel="完整遊戲時長"
                icon={<FaClock />}
                color="orange"
              />
              <StatCard
                value="80+"
                label="真實干擾場景"
                sublabel="四大維度模擬"
                icon={<FaBrain />}
                color="pink"
              />
              <StatCard
                value="S-D"
                label="評級系統"
                sublabel="多維度分析"
                icon={<FaChartLine />}
                color="cyan"
              />
              <StatCard
                value="40+"
                label="專業音效"
                sublabel="程序化生成"
                icon={<FaVolumeUp />}
                color="purple"
              />
            </div>
          </FloatingText>

          {/* CTA Buttons */}
          <FloatingText delay={1}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/focus-finder/prototype"
                className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 px-10 py-5 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 hover:shadow-red-500/50"
              >
                <FaPlay className="text-2xl group-hover:rotate-12 transition-transform" />
                <span>開始 90 秒體驗</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
              </Link>

              <Link
                href="/#learn-more"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-700 bg-slate-800/50 px-10 py-5 text-lg font-bold text-slate-300 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-slate-800"
              >
                <FaBrain />
                <span>了解 ADHD</span>
              </Link>
            </div>
          </FloatingText>
        </div>
      </header>

      {/* Game Features Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-white mb-6">
            <GradientText gradient="from-orange-400 to-red-400">
              🎮 遊戲亮點
            </GradientText>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            結合 AI 物件偵測、專業音效處理、粒子特效系統，打造前所未有的 ADHD 模擬體驗
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <FeatureCard
            icon="🎭"
            title="沉浸式故事體驗"
            description="跟隨主角的內心獨白，從平靜的開始到逐漸失控的認知負荷。體驗真實的 ADHD 情緒波動與思維跳躍。"
            color="cyan"
          />
          <FeatureCard
            icon="🧠"
            title="科學化干擾系統"
            description="80+ 種真實干擾場景，包含社交媒體成癮、兔子洞效應、工作記憶失敗等特殊認知挑戰，涵蓋環境、生理、心理、社交四大維度。"
            color="orange"
          />
          <FeatureCard
            icon="🎵"
            title="專業音效設計"
            description="40+ 種程序化音效搭配 Tuna.js 專業音效處理，從環境音樂到干擾音效，營造身臨其境的感官體驗。"
            color="purple"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <FeatureCard
            icon="🏆"
            title="S-A-B-C-D 評級系統"
            description="根據完成任務數、反應時間、死亡次數等多維度指標，提供詳細的表現分析與成就系統。"
            color="teal"
          />
          <FeatureCard
            icon="💥"
            title="視覺特效與動畫"
            description="粒子效果、死亡動畫、全螢幕沉浸體驗，搭配 Framer Motion 流暢動畫，打造電影級遊戲體驗。"
            color="pink"
          />
        </div>
      </div>

      {/* ADHD Introduction Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-white mb-6">
            <GradientText gradient="from-blue-400 to-purple-400">
              什麼是 ADHD？
            </GradientText>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            注意力不足/過動症（ADHD）是一種神經發展障礙，影響著全球約 5-10% 的人口。
            它不是懶惰或缺乏意志力，而是大腦執行功能的差異。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="🧠"
            title="執行功能困難"
            description="難以規劃、組織和執行任務。時間感知扭曲，容易低估完成時間。"
            color="blue"
          />
          <FeatureCard
            icon="⚡"
            title="注意力調節障礙"
            description="無法維持注意力，容易被無關刺激分散。但在感興趣的事物上可能過度專注。"
            color="purple"
          />
          <FeatureCard
            icon="💭"
            title="工作記憶限制"
            description="同時處理多個信息困難。一旦被打斷，很難回到原本的思路。"
            color="pink"
          />
        </div>

        <GlassCard gradient className="p-12">
          <h3 className="text-3xl font-bold mb-8">
            <GradientText gradient="from-amber-400 to-orange-400">
              為什麼我們創建 Focus Finder？
            </GradientText>
          </h3>
          <div className="space-y-6 text-slate-300">
            <p className="leading-relaxed">
              <span className="font-semibold text-amber-300">🎭 沉浸式同理心體驗：</span>
              透過故事化的第一人稱視角，讓你親身體驗 ADHD 大腦的內在世界 - 從平靜的開始到逐漸失控的認知風暴。
              這不只是遊戲，而是一場 90 秒的情感與認知之旅。
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold text-amber-300">🔬 科學化模擬設計：</span>
              基於神經科學研究，精確模擬 ADHD 的執行功能障礙、工作記憶限制、注意力調節困難。
              80+ 種干擾場景包含社交媒體成癮、兔子洞效應等現代挑戰，涵蓋環境、生理、心理、社交四大維度。
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold text-amber-300">💻 技術創新突破：</span>
              結合 AI 物件偵測、專業音效處理、粒子特效系統，打造前所未有的 ADHD 模擬體驗。
              每一個音效、每一個視覺效果都經過精心設計，為了讓你真正「感受」而非僅僅「理解」。
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold text-amber-300">🌍 社會影響使命：</span>
              消除對 ADHD 的誤解與偏見，建立更包容的社會環境。讓每個人都能理解：
              ADHD 不是缺陷，而是大腦的另一種美麗運作方式。
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Game Mechanics Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-white mb-6">
            <GradientText gradient="from-cyan-400 to-blue-400">
              🎯 遊戲機制
            </GradientText>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            三大核心機制，完整模擬 ADHD 認知挑戰
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <GlassCard gradient className="p-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6 mx-auto">
              <FaCamera className="text-3xl text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">物件偵測</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              使用 AI 物件偵測技術（MediaPipe + COCO-SSD），即時辨識鏡頭中的物件。
              找到指定物件即可完成任務。
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span>35+ 種可偵測物件</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span>即時信心度顯示</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span>0.35 偵測閾值</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard gradient className="p-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-6 mx-auto">
              <FaBullseye className="text-3xl text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">干擾系統</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              80+ 種真實干擾場景，涵蓋環境、生理、心理、社交四大維度。
              每個干擾都必須先處理，才能繼續主任務。
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span>動態權重系統</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span>漸進式難度調整</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span>特殊認知挑戰</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard gradient className="p-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 mx-auto">
              <FaChartLine className="text-3xl text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">評分系統</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              S-A-B-C-D 五級評分系統，根據完成任務數、反應時間、死亡次數等多維度指標評估表現。
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>多維度分析</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>成就系統</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>詳細統計數據</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <GlassCard gradient className="p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">
              <GradientText gradient="from-red-400 to-orange-400">
                準備好體驗了嗎？
              </GradientText>
            </h3>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              這不只是遊戲，這是一場 90 秒的同理心之旅。
              <br />
              讓我們一起理解 ADHD 大腦的美麗與挑戰。
            </p>
            <Link
              href="/focus-finder/prototype"
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 px-12 py-6 text-xl font-black text-white shadow-2xl transition-all hover:scale-105 hover:shadow-red-500/50"
            >
              <FaGamepad className="text-2xl group-hover:rotate-12 transition-transform" />
              <span>立即開始體驗</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
