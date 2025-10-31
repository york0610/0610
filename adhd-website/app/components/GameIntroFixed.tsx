'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaPlay, FaClock, FaBrain, FaBullseye, FaForward } from 'react-icons/fa';

interface GameIntroProps {
  isVisible: boolean;
  onStart: () => void;
  onSkip: () => void;
}

export default function GameIntro({ isVisible, onStart, onSkip }: GameIntroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scenes = [
    {
      id: 'setup',
      title: '下午 2:30 PM',
      subtitle: '辦公室 · 你的書桌前',
      text: '你準備開始那份拖了三天的重要報告...',
      description: '但是你的大腦總是不聽使喚',
      icon: FaClock,
      iconColor: 'text-blue-400',
      background: 'from-slate-900 via-blue-900/20 to-slate-900',
    },
    {
      id: 'challenge',
      title: '但是...',
      subtitle: 'ADHD 的挑戰',
      text: '你的大腦總是不聽使喚...各種干擾不斷出現，專注力像沙子一樣流失',
      description: '這就是 ADHD 患者每天面臨的現實',
      icon: FaBrain,
      iconColor: 'text-amber-400',
      background: 'from-slate-900 via-amber-900/20 to-slate-900',
    },
    {
      id: 'mission',
      title: '你的任務',
      subtitle: '體驗 ADHD 的日常挑戰',
      text: '找到指定的物件來完成任務，但要小心各種干擾...',
      description: '準備好體驗 ADHD 患者的認知負荷了嗎？',
      icon: FaBullseye,
      iconColor: 'text-green-400',
      background: 'from-slate-900 via-green-900/20 to-slate-900',
    },
  ];

  const currentSceneData = scenes[currentScene];

  // 重置狀態當組件變為不可見
  useEffect(() => {
    if (!isVisible) {
      setCurrentScene(0);
      setDisplayText('');
      setIsTyping(false);
      return;
    }
  }, [isVisible]);

  // 直接顯示完整文字，移除有問題的打字機效果
  useEffect(() => {
    if (!isVisible) return;

    console.log('[GameIntro] Starting scene:', currentScene, currentSceneData.title);

    // 直接設置完整文字，不使用打字機效果
    setDisplayText(currentSceneData.text);
    setIsTyping(false);

    console.log('[GameIntro] Scene text set immediately:', currentScene);
  }, [currentScene, isVisible, currentSceneData]);

  const handleNextScene = () => {
    console.log('[GameIntro] Next scene clicked, current:', currentScene);
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

  const handleStart = () => {
    console.log('[GameIntro] Start game clicked');
    onStart();
  };

  const handleSkip = () => {
    console.log('[GameIntro] Skip clicked');
    onSkip();
  };

  if (!isVisible) return null;

  const IconComponent = currentSceneData.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br ${currentSceneData.background} p-4 sm:p-8`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* 背景動畫 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center">
        {/* 圖標 */}
        <motion.div
          key={`icon-${currentScene}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-6"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 ${currentSceneData.iconColor}`}>
            <IconComponent className="text-2xl sm:text-3xl" />
          </div>
        </motion.div>

        {/* 標題 */}
        <motion.div
          key={`title-${currentScene}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {currentSceneData.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            {currentSceneData.subtitle}
          </p>
        </motion.div>

        {/* 文字內容 - 修正顯示問題 */}
        <motion.div
          key={`text-${currentScene}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 sm:p-6 min-h-[120px] flex flex-col justify-center">
            {/* 主要文字 */}
            <p className="text-base sm:text-lg text-white leading-relaxed text-center mb-3">
              {displayText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              )}
            </p>

            {/* 描述文字 */}
            {currentSceneData.description && (
              <p className="text-sm text-slate-300 text-center leading-relaxed">
                {currentSceneData.description}
              </p>
            )}
          </div>
        </motion.div>

        {/* 進度指示器 */}
        <div className="flex justify-center space-x-2 mb-6">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScene
                  ? 'bg-white scale-125'
                  : index < currentScene
                  ? 'bg-slate-400'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* 按鈕區域 - 總是顯示 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* 主要按鈕 */}
          {currentScene === scenes.length - 1 ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base hover:scale-105 transition-transform shadow-lg"
            >
              <FaPlay className="text-sm" />
              開始遊戲
            </button>
          ) : (
            <button
              onClick={handleNextScene}
              className="inline-flex items-center justify-center gap-2 bg-blue-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium text-base hover:bg-blue-500/80 transition-colors border border-blue-500/50 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaForward className="text-sm" />
              下一步
            </button>
          )}

          {/* 跳過按鈕 */}
          <button
            onClick={handleSkip}
            className="inline-flex items-center justify-center gap-2 bg-slate-800/50 backdrop-blur-sm text-slate-300 px-4 py-2 rounded-full font-medium text-sm hover:bg-slate-700/50 transition-colors border border-slate-700/50"
          >
            跳過介紹
          </button>
        </div>

        {/* Debug 信息 */}
        <div className="mt-4 text-xs text-slate-500">
          場景 {currentScene + 1} / {scenes.length} | 完成
        </div>
      </div>
    </motion.div>
  );
}
