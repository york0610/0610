'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaBolt, FaExclamationTriangle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface FocusBarProps {
  focusLevel: number; // 0-100
  isVisible?: boolean;
  onCriticalLevel?: () => void; // 當專注力過低時觸發
}

export default function FocusBar({ 
  focusLevel, 
  isVisible = true, 
  onCriticalLevel 
}: FocusBarProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);
  
  // 計算專注力狀態
  const getFocusState = (level: number) => {
    if (level > 70) return 'excellent';
    if (level > 50) return 'good';
    if (level > 30) return 'warning';
    if (level > 15) return 'critical';
    return 'danger';
  };

  const focusState = getFocusState(focusLevel);

  // 專注力狀態配置
  const stateConfig = {
    excellent: {
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      glowColor: 'shadow-blue-500/50',
      icon: FaBrain,
      iconColor: 'text-blue-400',
      bgOpacity: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      pulseColor: 'bg-blue-400',
    },
    good: {
      gradient: 'from-emerald-400 via-green-400 to-teal-400',
      glowColor: 'shadow-emerald-500/50',
      icon: FaBrain,
      iconColor: 'text-emerald-400',
      bgOpacity: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      pulseColor: 'bg-emerald-400',
    },
    warning: {
      gradient: 'from-yellow-400 via-amber-400 to-orange-400',
      glowColor: 'shadow-yellow-500/50',
      icon: FaBolt,
      iconColor: 'text-yellow-400',
      bgOpacity: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      pulseColor: 'bg-yellow-400',
    },
    critical: {
      gradient: 'from-orange-400 via-red-400 to-pink-400',
      glowColor: 'shadow-red-500/50',
      icon: FaExclamationTriangle,
      iconColor: 'text-red-400',
      bgOpacity: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      pulseColor: 'bg-red-400',
    },
    danger: {
      gradient: 'from-red-500 via-pink-500 to-purple-500',
      glowColor: 'shadow-red-500/70',
      icon: FaExclamationTriangle,
      iconColor: 'text-red-500',
      bgOpacity: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      pulseColor: 'bg-red-500',
    },
  };

  const config = stateConfig[focusState];
  const IconComponent = config.icon;

  // 處理震動和警告效果
  useEffect(() => {
    if (focusLevel <= 30 && focusLevel > 0) {
      setIsShaking(true);
      const shakeTimer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(shakeTimer);
    }
  }, [focusLevel]);

  useEffect(() => {
    if (focusLevel <= 15 && focusLevel > 0) {
      setShowCriticalWarning(true);
      onCriticalLevel?.();
      const warningTimer = setTimeout(() => setShowCriticalWarning(false), 2000);
      return () => clearTimeout(warningTimer);
    }
  }, [focusLevel, onCriticalLevel]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isShaking ? [1, 1.02, 0.98, 1.01, 0.99, 1] : 1
        }}
        transition={{ 
          duration: 0.5,
          scale: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
        }}
        className={`
          relative px-6 py-4 rounded-2xl border backdrop-blur-xl
          ${config.bgOpacity} ${config.borderColor} ${config.glowColor}
          ${focusLevel <= 30 ? 'shadow-2xl' : 'shadow-lg'}
          transition-all duration-300
        `}
      >
        {/* 玻璃擬態背景效果 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
        
        {/* 主要內容 */}
        <div className="relative flex items-center gap-4 min-w-[280px]">
          {/* 圖標 */}
          <div className={`relative ${config.iconColor}`}>
            <IconComponent className="text-2xl" />
            {focusLevel <= 15 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute -inset-1 rounded-full bg-red-500/20"
              />
            )}
          </div>

          {/* 專注力條容器 */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">專注力</span>
              <span className={`text-sm font-bold ${config.iconColor}`}>
                {Math.round(focusLevel)}%
              </span>
            </div>
            
            {/* 專注力條 */}
            <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
              {/* 背景脈衝效果 */}
              {focusLevel <= 30 && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`absolute inset-0 ${config.pulseColor} opacity-20`}
                />
              )}
              
              {/* 主要進度條 */}
              <motion.div
                className={`h-full bg-gradient-to-r ${config.gradient} relative overflow-hidden`}
                animate={{ width: `${focusLevel}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* 光澤效果 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 1,
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* 危險警告彈出 */}
        <AnimatePresence>
          {showCriticalWarning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                         px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-lg
                         text-white text-sm font-medium whitespace-nowrap
                         border border-red-400/50"
            >
              ⚠️ 專注力嚴重不足！
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
