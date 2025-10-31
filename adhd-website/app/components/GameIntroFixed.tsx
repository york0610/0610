'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaPlay, FaClock, FaBrain, FaBullseye } from 'react-icons/fa';

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
      duration: 4000,
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
      duration: 5000,
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
      duration: 5000,
    },
  ];

  const currentSceneData = scenes[currentScene];

  useEffect(() => {
    if (!isVisible) return;

    setDisplayText('');
    setIsTyping(true);

    const text = currentSceneData.text;
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);

        if (currentScene < scenes.length - 1) {
          const timer = setTimeout(() => {
            setCurrentScene(prev => prev + 1);
          }, currentSceneData.duration - 3000);

          return () => clearTimeout(timer);
        }
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentScene, isVisible, currentSceneData]);

  if (!isVisible) return null;

  const IconComponent = currentSceneData.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br ${currentSceneData.background}`}
        style={{ pointerEvents: 'auto' }}
      >
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

        {currentScene === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-96 h-64 bg-slate-100 rounded-lg shadow-2xl border-8 border-slate-800">
              <div className="h-8 bg-slate-200 rounded-t-md flex items-center px-4 gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-xs text-slate-600 ml-4">重要報告.docx</span>
              </div>
              <div className="p-6 h-full bg-white">
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-0.5 h-6 bg-slate-800"
                />
              </div>
            </div>
            
            <div className="absolute -bottom-8 left-4 w-12 h-6 bg-amber-800 rounded-lg shadow-lg" />
            <div className="absolute -bottom-16 right-8 w-8 h-8 bg-amber-600 rounded-full shadow-lg" />
            <div className="absolute -top-8 -right-16 w-6 h-16 bg-slate-600 rounded-full shadow-lg" />
          </motion.div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 ${currentSceneData.iconColor}`}
            >
              <IconComponent className="text-3xl" />
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-bold text-white"
              >
                {currentSceneData.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-slate-300"
              >
                {currentSceneData.subtitle}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="space-y-4"
            >
              <p className="text-2xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
                {displayText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </p>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                {currentSceneData.description}
              </p>
            </motion.div>

            <div className="flex justify-center gap-3 pt-8">
              {scenes.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentScene ? 'bg-white' : 'bg-slate-600'
                  }`}
                  animate={{
                    scale: index === currentScene ? 1.2 : 1,
                  }}
                />
              ))}
            </div>

            {currentScene === scenes.length - 1 && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex justify-center gap-4 pt-8"
              >
                <button
                  onClick={onStart}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform"
                >
                  <FaPlay />
                  開始挑戰
                </button>
                <button
                  onClick={onSkip}
                  className="px-6 py-4 text-slate-400 hover:text-white transition-colors"
                >
                  跳過介紹
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onSkip}
          className="absolute top-8 right-8 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          跳過 →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
