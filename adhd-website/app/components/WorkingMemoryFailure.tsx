'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaBrain, FaQuestion, FaRedo } from 'react-icons/fa';

interface WorkingMemoryFailureProps {
  isActive: boolean;
  originalTask: string;
  onRecover: () => void;
  duration?: number; // 持續時間（毫秒）
}

export default function WorkingMemoryFailure({ 
  isActive, 
  originalTask, 
  onRecover, 
  duration = 6000 
}: WorkingMemoryFailureProps) {
  const [phase, setPhase] = useState<'dissolving' | 'confused' | 'recovering'>('dissolving');
  const [confusedText, setConfusedText] = useState('');
  const [showRecoverButton, setShowRecoverButton] = useState(false);

  // 混亂時的文字選項
  const confusedTexts = [
    '...咦？我剛才...要找什麼？',
    '...等等，我在做什麼？',
    '...嗯...我忘記了...',
    '...這是什麼任務？',
    '...我的大腦一片空白...',
    '...剛才的指示是什麼？',
  ];

  // 階段管理
  useEffect(() => {
    if (!isActive) {
      setPhase('dissolving');
      setShowRecoverButton(false);
      return;
    }

    // 階段1: 溶解階段 (2秒)
    setPhase('dissolving');
    const dissolveTimer = setTimeout(() => {
      // 階段2: 混亂階段 (3秒)
      setPhase('confused');
      setConfusedText(confusedTexts[Math.floor(Math.random() * confusedTexts.length)]);
      
      const confusedTimer = setTimeout(() => {
        // 階段3: 恢復階段
        setPhase('recovering');
        setShowRecoverButton(true);
      }, 3000);

      return () => clearTimeout(confusedTimer);
    }, 2000);

    // 自動恢復
    const autoRecoverTimer = setTimeout(() => {
      onRecover();
    }, duration);

    return () => {
      clearTimeout(dissolveTimer);
      clearTimeout(autoRecoverTimer);
    };
  }, [isActive, duration, onRecover]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <div className="max-w-2xl mx-auto px-8 text-center">
          {/* 階段1: 任務文字溶解 */}
          {phase === 'dissolving' && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: [1, 0.7, 0.3, 0],
                scale: [1, 1.05, 0.95, 0.8],
                filter: [
                  'blur(0px) brightness(1)',
                  'blur(2px) brightness(0.8)',
                  'blur(8px) brightness(0.5)',
                  'blur(20px) brightness(0.2)'
                ]
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="text-6xl">🧠</div>
              <div className="text-3xl font-bold text-white">
                找到 {originalTask}
              </div>
              
              {/* 像素化效果 */}
              <motion.div
                animate={{
                  background: [
                    'linear-gradient(45deg, transparent 0%, transparent 100%)',
                    'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%)',
                    'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%)'
                  ],
                  backgroundSize: ['0px 0px', '20px 20px', '40px 40px']
                }}
                transition={{ duration: 2 }}
                className="absolute inset-0 pointer-events-none"
              />
            </motion.div>
          )}

          {/* 階段2: 混亂狀態 */}
          {phase === 'confused' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* 混亂的大腦圖標 */}
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -5, 5, 0],
                  scale: [1, 0.9, 1.1, 0.95, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-8xl"
              >
                🤔
              </motion.div>

              {/* 混亂文字 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <motion.p
                  animate={{ 
                    opacity: [0.5, 1, 0.7, 1],
                    y: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-2xl text-slate-300 font-medium"
                >
                  {confusedText}
                </motion.p>
                
                <div className="text-lg text-slate-400">
                  工作記憶暫時失效中...
                </div>
              </motion.div>

              {/* 緩衝動畫 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <div className="w-8 h-8 border-4 border-slate-600 border-t-white rounded-full" />
              </motion.div>

              {/* 背景干擾效果 */}
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 pointer-events-none"
              />
            </motion.div>
          )}

          {/* 階段3: 恢復階段 */}
          {phase === 'recovering' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* 恢復圖標 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-8xl"
              >
                💡
              </motion.div>

              {/* 恢復文字 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold text-white">
                  啊！想起來了！
                </h2>
                <p className="text-xl text-slate-300">
                  你需要找到：<span className="font-bold text-cyan-400">{originalTask}</span>
                </p>
                <p className="text-sm text-slate-400">
                  這就是 ADHD 的工作記憶挑戰
                </p>
              </motion.div>

              {/* 恢復按鈕 */}
              {showRecoverButton && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRecover}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all"
                >
                  <FaRedo />
                  繼續任務
                </motion.button>
              )}

              {/* 成功光效 */}
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(34, 197, 94, 0) 0%, rgba(34, 197, 94, 0) 100%)',
                    'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 70%)',
                    'radial-gradient(circle, rgba(34, 197, 94, 0) 0%, rgba(34, 197, 94, 0) 100%)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 pointer-events-none"
              />
            </motion.div>
          )}
        </div>

        {/* 點擊任意處恢復 (僅在恢復階段) */}
        {phase === 'recovering' && (
          <motion.div
            className="absolute inset-0 cursor-pointer"
            onClick={onRecover}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
        )}

        {/* 邊緣暗化效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}
