'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaSkull, FaExclamationTriangle, FaHeartBroken } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface DeathAnimationProps {
  isVisible: boolean;
  reason: string;
  onComplete: () => void;
}

export default function DeathAnimation({ isVisible, reason, onComplete }: DeathAnimationProps) {
  const [stage, setStage] = useState<'fade' | 'skull' | 'message' | 'complete'>('fade');

  useEffect(() => {
    if (!isVisible) {
      setStage('fade');
      return;
    }

    // 動畫序列
    const sequence: Array<{ stage: 'fade' | 'skull' | 'message' | 'complete', delay: number }> = [
      { stage: 'fade', delay: 0 },
      { stage: 'skull', delay: 500 },
      { stage: 'message', delay: 1500 },
      { stage: 'complete', delay: 3000 }
    ];

    const timers = sequence.map(({ stage: nextStage, delay }) =>
      setTimeout(() => {
        setStage(nextStage);
        if (nextStage === 'complete') {
          onComplete();
        }
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      >
        {/* 紅色閃爍背景 */}
        <motion.div
          animate={{
            backgroundColor: [
              'rgba(0, 0, 0, 1)',
              'rgba(139, 0, 0, 0.3)',
              'rgba(0, 0, 0, 1)',
              'rgba(139, 0, 0, 0.3)',
              'rgba(0, 0, 0, 1)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
        />

        {/* 主要內容 */}
        <div className="relative z-10 text-center">
          {/* 第一階段：淡入 */}
          {stage === 'fade' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-500"
            >
              <FaExclamationTriangle className="text-8xl mx-auto mb-4" />
            </motion.div>
          )}

          {/* 第二階段：骷髏頭 */}
          {stage === 'skull' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ 
                opacity: 1, 
                scale: [0.5, 1.2, 1], 
                rotate: 0 
              }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-red-500"
            >
              <FaSkull className="text-9xl mx-auto mb-6" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl font-bold text-red-400"
              >
                GAME OVER
              </motion.div>
            </motion.div>
          )}

          {/* 第三階段：死亡原因 */}
          {stage === 'message' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <FaHeartBroken className="text-6xl text-red-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-red-400 mb-4">專注力耗盡</h2>
              <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-lg text-red-200 leading-relaxed">
                  {reason}
                </p>
                <div className="mt-4 text-sm text-red-300">
                  這就是 ADHD 患者面臨的真實挑戰...
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 粒子效果 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              initial={{
                x: '50vw',
                y: '50vh',
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
            />
          ))}
        </div>

        {/* 震動效果文字 */}
        {stage !== 'fade' && (
          <motion.div
            animate={{
              x: [-2, 2, -2, 2, 0],
              y: [-1, 1, -1, 1, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-red-300 text-sm"
          >
            系統正在重新啟動...
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
