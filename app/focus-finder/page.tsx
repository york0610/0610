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
    id: 'final-project-panic',
    title: '60秒專題恐慌',
    subtitle: '模擬 ADHD 者在高壓情境下的內在感受',
    description: '你是一名大學生，教授剛叫到你的名字。你必須在 60 秒的緩衝時間內，確認所有上台物品。但是——你的思緒不斷被打斷，記憶不斷被清空，感官過載讓你無法專注。',
    icon: <FaClock className="text-red-400" />,
    color: 'red',
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    difficulty: 'expert',
    duration: '60 秒',
    participants: '48,293',
    rating: 4.9,
    features: [
      'CV 視覺偵測：透過鏡頭尋找真實物品',
      '執行功能干擾：突發任務強制中斷',
      '工作記憶損耗：被打斷後必須重新載入',
      '感官恐慌疊加：視覺與聽覺的失控感'
    ],
    stats: [
      { label: '完成率', value: '23%' },
      { label: '平均中斷次數', value: '4.2 次' },
      { label: '體驗人數', value: '48,293' }
    ]
  },
  {
    id: 'conversation-tracking',
    title: '對話追蹤戰',
    subtitle: '在多人對話中保持專注',
    description: '你正在參加一場重要的小組討論。但是當多人同時發言時，你發現自己無法追蹤誰在說什麼。背景的各種聲音不斷吸引你的注意力。',
    icon: <FaComments className="text-purple-400" />,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    difficulty: 'advanced',
    duration: '5 分鐘',
    participants: '31,847',
    rating: 4.7,
    features: [
      '多音軌混合：同時播放多段對話',
      '選擇性注意力：必須篩選關鍵訊息',
      '干擾音策略：背景雜訊動態調整',
      '即時理解測驗：測試你的記憶保留'
    ],
    stats: [
      { label: '完成率', value: '42%' },
      { label: '平均注意力', value: '6.5/10' },
      { label: '體驗人數', value: '31,847' }
    ]
  },
  {
    id: 'supermarket-memory',
    title: '超市記憶戰',
    subtitle: '在複雜環境中完成購物清單',
    description: '你有一張 8 項物品的購物清單，但是在超市的各種視覺與聽覺干擾下，你不斷忘記自己要買什麼。每次重新查看清單，你都感到沮喪。',
    icon: <FaShoppingCart className="text-green-400" />,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    difficulty: 'intermediate',
    duration: '8 分鐘',
    participants: '27,561',
    rating: 4.6,
    features: [
      '工作記憶負載：同時記住多項任務',
      '視覺雜訊：超市貨架的視覺過載',
      '衝動控制：抵抗購買非清單物品',
      '記憶重載：模擬忘記後的重新思考'
    ],
    stats: [
      { label: '完成率', value: '58%' },
      { label: '平均重查次數', value: '5.3 次' },
      { label: '體驗人數', value: '27,561' }
    ]
  },
  {
    id: 'homework-battle',
    title: '作業之戰',
    subtitle: '在家中完成作業的挑戰',
    description: '你有一份明天就要交的作業。但是家中的每一個聲音、每一個物品都在誤惑你。你不斷告訴自己「再 5 分鐘就開始」，但時間一分一秒流逝。',
    icon: <FaBrain className="text-blue-400" />,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    difficulty: 'beginner',
    duration: '10 分鐘',
    participants: '35,829',
    rating: 4.5,
    features: [
      '時間知覚障礙：時間過得比想像中快',
      '拖延行為模擬：各種誤惑與逾避',
      '啟動困難：很難真正「開始」作業',
      '分心追蹤：記錄你被什麼分心'
    ],
    stats: [
      { label: '完成率', value: '71%' },
      { label: '平均分心', value: '8.7 次' },
      { label: '體驗人數', value: '35,829' }
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
              60秒專題恐慌
            </motion.h1>
            
            {/* 副標題 */}
            <motion.p 
              className="mt-4 text-2xl font-bold text-red-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The 60-Second Final Project Panic
            </motion.p>
            
            {/* 描述 */}
            <motion.p 
              className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              你是一名大學生，正坐在教室裡。教授叫到你的名字：<br />
              <span className="font-bold text-orange-300">「下一組，[你的名字]，請準備上台。」</span>
              <br /><br />
              你突然意識到自己還沒準備好。你必須在 <span className="font-bold text-red-400">60 秒</span> 的緩衝時間內，
              確認所有上台物品都已就位。
              <br /><br />
              但是——<span className="font-bold text-yellow-300">你的思緒不斷被打斷，記憶不斷被清空，感官過載讓你無法專注。</span>
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
                  <span>60秒</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">單局體驗時長</p>
              </div>
              <div className="rounded-2xl border border-orange-800/30 bg-orange-900/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-orange-400">
                  <FaBrain />
                  <span>4層</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">機制疊加系統</p>
              </div>
              <div className="rounded-2xl border border-yellow-800/30 bg-yellow-900/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-yellow-400">
                  <FaExclamationTriangle />
                  <span>23%</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">完成率（極高難度）</p>
              </div>
              <div className="rounded-2xl border border-green-800/30 bg-green-900/20 p-6 backdrop-blur-sm">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href="/focus-finder/prototype"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 px-10 py-5 text-lg font-black text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/50"
              >
                <FaPlay className="mr-3 text-xl" />
                立即開始 60 秒挑戰
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
            <h2 className="text-4xl font-bold text-white mb-4">選擇你的挑戰</h2>
            <p className="text-lg text-slate-400">根據難度等級，選擇最適合你的體驗</p>
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
