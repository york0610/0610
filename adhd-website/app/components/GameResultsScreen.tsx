'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamationTriangle, FaRedo, FaTrophy, FaStar, FaFire, FaBrain, FaClock, FaBullseye, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface GameStats {
  totalCompleted: number;
  totalTasks: number;
  skippedTasks: number;
  adjustedTime: number;
  totalDistractions: number;
  totalDistractionCost: number;
  playerScore: number;
  focusLevel: number;
}

interface GameResultsScreenProps {
  isVisible: boolean;
  isSuccess: boolean;
  stats: GameStats;
  onRestart: () => void;
  onReset: () => void;
}

export default function GameResultsScreen({ 
  isVisible, 
  isSuccess, 
  stats, 
  onRestart, 
  onReset 
}: GameResultsScreenProps) {
  const [showStats, setShowStats] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // 計算成就和評級 - 無限挑戰模式
  const completionRate = stats.totalTasks > 0 ? (stats.totalCompleted / stats.totalTasks) * 100 : 0;
  const efficiency = stats.adjustedTime > 0 ? (stats.totalCompleted / stats.adjustedTime) * 60 : 0; // 每分鐘完成任務數

  // 新的評級系統：基於完成任務數量和效率
  const getRating = () => {
    const tasksCompleted = stats.totalCompleted;

    // S級：完成12個以上任務，效率極高
    if (tasksCompleted >= 12 && efficiency >= 8) return { level: 'S', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };

    // A級：完成10-11個任務，效率高
    if (tasksCompleted >= 10 && efficiency >= 6.5) return { level: 'A', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };

    // B級：完成8-9個任務，效率中等
    if (tasksCompleted >= 8 && efficiency >= 5) return { level: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };

    // C級：完成6-7個任務
    if (tasksCompleted >= 6) return { level: 'C', color: 'text-purple-400', bg: 'bg-purple-500/20' };

    // D級：完成5個以下任務
    return { level: 'D', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const rating = getRating();

  const achievements = [
    {
      id: 'master',
      name: '極限挑戰者',
      description: '完成12個以上任務',
      achieved: stats.totalCompleted >= 12,
      icon: FaTrophy,
      color: 'text-yellow-400'
    },
    {
      id: 'speedster',
      name: '閃電俠',
      description: '平均每分鐘完成8個任務',
      achieved: efficiency >= 8,
      icon: FaFire,
      color: 'text-orange-400'
    },
    {
      id: 'focused',
      name: '專注大師',
      description: '保持高專注力',
      achieved: stats.focusLevel >= 80,
      icon: FaBrain,
      color: 'text-purple-400'
    },
    {
      id: 'resilient',
      name: '抗干擾戰士',
      description: '處理10次以上干擾',
      achieved: stats.totalDistractions >= 10,
      icon: FaHeart,
      color: 'text-pink-400'
    }
  ];

  const achievedCount = achievements.filter(a => a.achieved).length;

  const detailedStats = [
    { label: '完成任務', value: `${stats.totalCompleted} 個`, icon: FaBullseye, color: 'text-emerald-400' },
    { label: '效率', value: `${efficiency.toFixed(1)}/分鐘`, icon: FaClock, color: 'text-blue-400' },
    { label: '最終分數', value: `${stats.playerScore}`, icon: FaStar, color: 'text-yellow-400' },
    { label: '專注力', value: `${stats.focusLevel}%`, icon: FaBrain, color: 'text-purple-400' },
  ];

  useEffect(() => {
    if (isVisible) {
      // 延遲顯示統計數據
      setTimeout(() => setShowStats(true), 800);
      
      // 成功時顯示粒子效果
      if (isSuccess) {
        setTimeout(() => setShowParticles(true), 1200);
      }

      // 逐個顯示統計數據
      const interval = setInterval(() => {
        setCurrentStatIndex(prev => {
          if (prev < detailedStats.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      setShowStats(false);
      setShowParticles(false);
      setCurrentStatIndex(0);
    }
  }, [isVisible, isSuccess]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        {/* 背景粒子效果 */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                initial={{
                  x: '50vw',
                  y: '50vh',
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5
                }}
              />
            ))}
          </div>
        )}

        {/* 主要內容 */}
        <div className="relative z-10 w-full max-w-md mx-auto p-6 text-center">
          {/* 標題和圖標 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="mb-6"
          >
            {isSuccess ? (
              <div className="relative">
                <FaCheck className="text-8xl text-emerald-400 mx-auto mb-4" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-2xl"
                >
                  ✨
                </motion.div>
              </div>
            ) : (
              <FaExclamationTriangle className="text-8xl text-red-400 mx-auto mb-4" />
            )}
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {isSuccess ? '🎉 任務完成！' : '⏰ 時間到！'}
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-400"
            >
              {isSuccess 
                ? '恭喜你完成了 ADHD 專注力挑戰！' 
                : '這就是 ADHD 患者面對的真實挑戰...'}
            </motion.p>
          </motion.div>

          {/* 評級顯示 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: showStats ? 1 : 0 }}
            transition={{ type: 'spring', delay: 0.7 }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${rating.bg} border-2 border-current ${rating.color} mb-6`}
          >
            <span className="text-3xl font-bold">{rating.level}</span>
          </motion.div>

          {/* 詳細統計 */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                {detailedStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: index <= currentStatIndex ? 1 : 0,
                        opacity: index <= currentStatIndex ? 1 : 0
                      }}
                      transition={{ 
                        type: 'spring',
                        delay: 1.2 + (index * 0.2)
                      }}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4"
                    >
                      <Icon className={`text-2xl ${stat.color} mx-auto mb-2`} />
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 成就系統 */}
          <AnimatePresence>
            {showStats && achievedCount > 0 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  🏆 成就解鎖 ({achievedCount}/{achievements.length})
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {achievements.filter(a => a.achieved).map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: 'spring',
                          delay: 2.2 + (index * 0.1)
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 ${achievement.color}`}
                        title={achievement.description}
                      >
                        <Icon className="text-sm" />
                        <span className="text-xs font-medium">{achievement.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 操作按鈕 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => {
                // 退出全螢幕後重新開始
                if (document.fullscreenElement) {
                  document.exitFullscreen().then(() => {
                    setTimeout(onRestart, 100);
                  });
                } else {
                  onRestart();
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              <FaRedo /> 再次挑戰
            </button>
            <button
              onClick={() => {
                // 退出全螢幕後重設
                if (document.fullscreenElement) {
                  document.exitFullscreen().then(() => {
                    setTimeout(onReset, 100);
                  });
                } else {
                  onReset();
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-400 hover:bg-slate-800/50"
            >
              重設體驗
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
