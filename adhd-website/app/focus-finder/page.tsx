'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FaClock,
  FaPlay,
  FaVideo,
  FaVolumeUp,
  FaMobileAlt,
  FaBolt,
  FaBrain,
  FaEye,
  FaHeart,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
  FaChartLine,
  FaUsers,
  FaDownload,
  FaShare,
  FaLightbulb,
  FaCode,
  FaRocket,
  FaGamepad,
  FaComments,
  FaShoppingCart,
  FaBullseye,
  FaTasks,
  FaCamera,
  FaHeadphones,
  FaMagic,
  FaStar
} from 'react-icons/fa';

// 定義難度等級類型
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// 定義挑戰卡片類型
interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  difficulty: DifficultyLevel;
  duration: string;
  participants: string;
  rating: number;
  features: string[];
  stats: { label: string; value: string }[];
}

// 難度顏色映射
const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  advanced: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  expert: 'bg-red-500/10 text-red-400 border-red-500/20',
} as const;

// 難度標籤映射
const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: '入門',
  intermediate: '中級',
  advanced: '進階',
  expert: '專家',
} as const;

type ChallengeCard = Challenge;

// 定義 challenges 數組 - 基於「60秒專題恐慌」遊戲企劃
const challenges: Challenge[] = [
  {
    id: 'environment-scan',
    title: '60秒環境掃描挑戰',
    subtitle: '體驗 ADHD 者在多任務下的認知負荷',
    description: '你需要在 60 秒內完成環境掃描任務：找到地板、天花板、牆壁、門和窗戶。但是——你會不斷被突發的干擾任務打斷，必須先完成干擾任務才能繼續。這就是 ADHD 者每天面對的挑戰：不斷被打斷，難以保持專注。',
    icon: <FaCamera className="text-cyan-400" />,
    color: 'cyan',
    gradient: 'from-cyan-500 via-blue-500 to-purple-500',
    difficulty: 'expert',
    duration: '60 秒',
    participants: '0',
    rating: 5.0,
    features: [
      '環境掃描：使用手機鏡頭掃描地板、天花板等',
      '強制中斷：突發任務必須先完成',
      '視覺雜訊：干擾時增加視覺失真',
      '分數系統：詳細的成績評估'
    ],
    stats: [
      { label: '遊戲時間', value: '60秒' },
      { label: '主任務', value: '5個' },
      { label: '干擾類型', value: '8種' }
    ]
  }
];

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
};

const missionStages: any[] = [
  {
    id: 'onboarding',
    title: '體驗暖身',
    highlight: '引導 + 權限',
    description:
      '透過短版導覽與互動教學，說明任務故事、請求鏡頭／音訊權限，並示範如何將虛擬物件置中並收集。',
    icon: <FaPlay className="text-sky-400" />,
  },
  {
    id: 'mission-loop',
    title: '任務迴圈',
    highlight: '尋找 × 收集 × 回饋',
    description:
      '每回合指派一個待尋物品。在鏡頭畫面中移動尋找 AR 目標，置中後點擊收集，並即時獲得聲光回饋。',
    icon: <FaBullseye className="text-emerald-400" />,
  },
  {
    id: 'summary',
    title: '結算與反思',
    highlight: '統計 × 同理心',
    description:
      '整理花費時間、干擾次數與衝動互動紀錄，搭配文字引導使用者回顧專注力耗損與情緒起伏。',
    icon: <FaClock className="text-amber-300" />,
  },
];

const distractionModules: any[] = [
  {
    title: '干擾 A：臨時任務彈窗',
    focus: '模擬工作記憶中斷',
    description:
      '以高優先的模態視窗打斷視覺流程，要求確認、推遲或暫存任務，再花時間找回原本的焦點。',
    actions: ['Next.js app router 管理狀態', 'Framer Motion 彈出 / 收合動畫', '結束後短暫隱藏任務提示'],
    icon: <FaTasks className="text-rose-400" />,
  },
  {
    title: '干擾 B：視覺與聽覺噪音',
    focus: '模擬感官過載',
    description:
      '透過靜電、色偏、亮度突變與高分貝環境噪音，迫使用戶重新調整視覺焦點與身體節奏。',
    actions: ['CSS filters / Canvas 疊層', 'Web Audio API 音量包絡', '干擾排程器避免重疊'],
    icon: <FaHeadphones className="text-indigo-300" />,
  },
  {
    title: '干擾 C：衝動誘惑',
    focus: '模擬注意力轉移',
    description:
      '在畫面角落飄出有趣圖示，點擊會觸發彩蛋內容與時間懲罰，不點則慢慢飄走，製造抉擇張力。',
    actions: ['SVG / Lottie 飄移動畫', '互動後記錄耗時', '以分數或提示呈現衝動成本'],
    icon: <FaMagic className="text-fuchsia-300" />,
  },
];



export default function FocusFinderPage() {
  // 狀態管理
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null);
  
  // 過濾挑戰
  const filteredChallenges = challenges.filter(challenge => 
    selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty
  );

  const [activeSection, setActiveSection] = useState<'story' | 'mechanics' | 'tech' | 'roadmap'>('story');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* 英雄區塊 - 遊戲標題 */}
      <div className="relative overflow-hidden">
        {/* 背景效果 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.1),transparent_50%)]" />
        </div>
        
        <header className="relative mx-auto max-w-7xl px-6 pb-20 pt-28">
          <div className="text-center">
            {/* 標籤 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-red-500/30 px-6 py-3 text-sm font-bold text-red-300 backdrop-blur-sm">
                <FaClock className="text-red-400 animate-pulse" />
                故事驅動的 Web AR/CV 互動體驗
              </span>
            </motion.div>
            
            {/* 主標題 */}
            <motion.h1
              className="mt-10 bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Focus Finder
            </motion.h1>

            {/* 副標題 */}
            <motion.p
              className="mt-4 text-2xl font-bold text-red-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ADHD 認知挑戰模擬器 - 90 秒沉浸式體驗
            </motion.p>
            
            {/* 描述 */}
            <motion.p
              className="mx-auto mt-8 max-w-4xl text-xl leading-relaxed text-slate-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              歡迎來到 <span className="font-bold text-cyan-400">Focus Finder</span> - 一個讓你親身體驗 ADHD 認知挑戰的互動遊戲。
              <br /><br />
              <span className="font-bold text-yellow-300">🎯 你的任務看似簡單</span>：在 90 秒內使用手機鏡頭找到 8 個日常物件 - 杯子、書本、椅子、門、窗戶等生活用品。
              <br /><br />
              <span className="font-bold text-red-400">⚡ 但現實很複雜</span>：你會不斷被突發的干擾任務打斷 - 社交媒體通知、電腦沒關、手機響了、口好渴、想上廁所...
              <br /><br />
              <span className="font-bold text-orange-300">🧠 這就是 ADHD 大腦的日常</span>：每個干擾都必須先處理，才能回到原本的任務。你會體驗到工作記憶的負荷、注意力的分散，以及執行功能的挑戰。
              <br /><br />
              <span className="text-lg font-semibold text-emerald-300">這不只是遊戲，這是一場 90 秒的同理心之旅。</span>
            </motion.p>

            {/* 核心數據 */}
            <motion.div
              className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="rounded-2xl border border-red-800/30 bg-red-900/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-red-400">
                  <FaClock />
                  <span>90秒</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">沉浸式體驗時長</p>
              </div>
              <div className="rounded-2xl border border-orange-800/30 bg-orange-900/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-orange-400">
                  <FaBrain />
                  <span>80+</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">真實干擾場景</p>
              </div>
              <div className="rounded-2xl border border-yellow-800/30 bg-yellow-900/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-yellow-400">
                  <FaExclamationTriangle />
                  <span>S-D</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">評級系統</p>
              </div>
              <div className="rounded-2xl border border-green-800/30 bg-green-900/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-green-400">
                  <FaUsers />
                  <span>40+</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">專業音效類型</p>
              </div>
            </motion.div>

            {/* CTA 按鈕 */}
            <motion.div 
              className="mt-12 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href="/focus-finder/prototype"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 px-10 py-5 text-lg font-black text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/50"
              >
                <FaPlay className="mr-3 text-xl" />
                開始 90 秒 ADHD 體驗
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-yellow-600 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
              <button
                onClick={() => setActiveSection('mechanics')}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border-2 border-red-700/50 bg-slate-800/50 px-10 py-5 text-lg font-bold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-red-600/50 hover:bg-slate-700/50"
              >
                <FaGamepad className="mr-3" />
                查看遊戲機制
              </button>
            </motion.div>
          </div>
        </header>
      </div>

      {/* 遊戲特色區塊 */}
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-12 text-center">🎮 遊戲亮點</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-900/20 p-8 backdrop-blur-sm">
              <div className="text-5xl mb-4 text-center">🎭</div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">沉浸式故事體驗</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                跟隨主角的內心獨白，從平靜的開始到逐漸失控的認知負荷。體驗真實的 ADHD 情緒波動與思維跳躍。
              </p>
            </div>
            <div className="rounded-2xl border border-orange-500/30 bg-orange-900/20 p-8 backdrop-blur-sm">
              <div className="text-5xl mb-4 text-center">🧠</div>
              <h3 className="text-xl font-bold text-orange-400 mb-4 text-center">科學化干擾系統</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                80+ 種真實干擾場景，包含社交媒體成癮、兔子洞效應、工作記憶失敗等特殊認知挑戰，涵蓋環境、生理、心理、社交四大維度。
              </p>
            </div>
            <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-8 backdrop-blur-sm">
              <div className="text-5xl mb-4 text-center">🎵</div>
              <h3 className="text-xl font-bold text-purple-400 mb-4 text-center">專業音效設計</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                40+ 種程序化音效搭配 Tuna.js 專業音效處理，從環境音樂到干擾音效，營造身臨其境的感官體驗。
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/20 p-8 backdrop-blur-sm">
              <div className="text-4xl mb-4 text-center">🏆</div>
              <h3 className="text-xl font-bold text-emerald-400 mb-4 text-center">S-A-B-C-D 評級系統</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                根據完成任務數、反應時間、死亡次數等多維度指標，提供詳細的表現分析與成就系統。
              </p>
            </div>
            <div className="rounded-2xl border border-pink-500/30 bg-pink-900/20 p-8 backdrop-blur-sm">
              <div className="text-4xl mb-4 text-center">💥</div>
              <h3 className="text-xl font-bold text-pink-400 mb-4 text-center">視覺特效與動畫</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                粒子效果、死亡動畫、全螢幕沉浸體驗，搭配 Framer Motion 流暢動畫，打造電影級遊戲體驗。
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ADHD 介紹區塊 */}
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">什麼是 ADHD？</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              注意力不足/過動症（ADHD）是一種神經發展障礙，影響著全球約 5-10% 的人口。
              它不是懶惰或缺乏意志力，而是大腦執行功能的差異。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="rounded-2xl border border-blue-500/30 bg-blue-900/20 p-8 backdrop-blur-sm">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-blue-300 mb-3">執行功能困難</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                難以規劃、組織和執行任務。時間感知扭曲，容易低估完成時間。
              </p>
            </div>
            <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-8 backdrop-blur-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-purple-300 mb-3">注意力調節障礙</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                無法維持注意力，容易被無關刺激分散。但在感興趣的事物上可能過度專注。
              </p>
            </div>
            <div className="rounded-2xl border border-pink-500/30 bg-pink-900/20 p-8 backdrop-blur-sm">
              <div className="text-4xl mb-4">💭</div>
              <h3 className="text-xl font-bold text-pink-300 mb-3">工作記憶限制</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                同時處理多個信息困難。一旦被打斷，很難回到原本的思路。
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/30 bg-amber-900/20 p-12 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-amber-300 mb-6">為什麼我們創建 Focus Finder？</h3>
            <div className="space-y-4 text-slate-300">
              <p className="leading-relaxed">
                <span className="font-semibold text-amber-200">沉浸式同理心體驗：</span>
                透過故事化的第一人稱視角，讓你親身體驗 ADHD 大腦的內在世界 - 從平靜的開始到逐漸失控的認知風暴。
                這不只是遊戲，而是一場 90 秒的情感與認知之旅。
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold text-amber-200">科學化模擬設計：</span>
                基於神經科學研究，精確模擬 ADHD 的執行功能障礙、工作記憶限制、注意力調節困難。
                80+ 種干擾場景包含社交媒體成癮、兔子洞效應等現代挑戰，涵蓋環境、生理、心理、社交四大維度。
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold text-amber-200">技術創新突破：</span>
                結合 AI 物件偵測、專業音效處理、粒子特效系統，打造前所未有的 ADHD 模擬體驗。
                每一個音效、每一個視覺效果都經過精心設計，為了讓你真正「感受」而非僅僅「理解」。
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold text-amber-200">社會影響使命：</span>
                消除對 ADHD 的誤解與偏見，建立更包容的社會環境。讓每個人都能理解：
                ADHD 不是缺陷，而是大腦的另一種美麗運作方式。
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 遊戲機制介紹區域 */}
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        {/* 難度篩選器 */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">🎮 選擇你的挑戰</h2>
            <p className="text-lg text-slate-400">根據難度等級，選擇最適合你的體驗。每個挑戰都模擬不同的 ADHD 情境。</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedDifficulty === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
              }`}
            >
              全部挑戰
            </button>
            {(Object.keys(difficultyLabels) as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedDifficulty === level
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                }`}
              >
                {difficultyLabels[level]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 挑戰卡片 */}
        <div className="grid gap-8 md:grid-cols-2">
          <AnimatePresence mode="wait">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredChallenge(challenge.id)}
                onMouseLeave={() => setHoveredChallenge(null)}
                className="group relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:border-slate-700/60 hover:shadow-2xl"
              >
                {/* 背景漸層 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                
                <div className="relative p-8">
                  {/* 標頭 */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${challenge.gradient} border border-slate-700/50`}>
                        {challenge.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{challenge.title}</h3>
                        <p className="text-sm text-slate-400">{challenge.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* 難度與評分 */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[challenge.difficulty]}`}>
                      {difficultyLabels[challenge.difficulty]}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <FaStar className="text-sm" />
                      <span className="font-semibold">{challenge.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <FaUsers className="text-xs" />
                      <span>{challenge.participants.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-slate-300 leading-relaxed mb-6">{challenge.description}</p>

                  {/* 功能特點 */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {challenge.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-slate-400">
                        <FaCheckCircle className="text-green-400 text-xs flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* 統計數據 */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    {challenge.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* 行動按鈕 */}
                  <div className="flex gap-3">
                    <Link
                      href="/focus-finder/prototype"
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${challenge.color} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                      <FaPlay />
                      開始挑戰
                    </Link>
                    <button className="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-all duration-300">
                      <FaLightbulb />
                    </button>
                  </div>

                  {/* 時間標記 */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <FaClock className="text-xs" />
                    <span>{challenge.duration}</span>
                  </div>
                </div>

                {/* hover 效果 */}
                {hoveredChallenge === challenge.id && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-500/50 rounded-3xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
