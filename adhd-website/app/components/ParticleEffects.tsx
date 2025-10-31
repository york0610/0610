'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ParticleEffectsProps {
  isActive: boolean;
  type: 'success' | 'error' | 'distraction' | 'focus' | 'detection';
  intensity?: number;
  position?: { x: number; y: number };
}

export default function ParticleEffects({ 
  isActive, 
  type, 
  intensity = 1, 
  position 
}: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getParticleConfig = (type: string) => {
    switch (type) {
      case 'success':
        return {
          colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
          count: Math.floor(15 * intensity),
          speed: 3,
          life: 2000,
          size: { min: 2, max: 6 }
        };
      case 'error':
        return {
          colors: ['#ef4444', '#f87171', '#fca5a5', '#fb7185', '#f43f5e'],
          count: Math.floor(10 * intensity),
          speed: 2,
          life: 1500,
          size: { min: 1, max: 4 }
        };
      case 'distraction':
        return {
          colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fb923c', '#f97316'],
          count: Math.floor(8 * intensity),
          speed: 1.5,
          life: 3000,
          size: { min: 1, max: 3 }
        };
      case 'focus':
        return {
          colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#8b5cf6', '#a78bfa'],
          count: Math.floor(12 * intensity),
          speed: 1,
          life: 4000,
          size: { min: 1, max: 5 }
        };
      case 'detection':
        return {
          colors: ['#06b6d4', '#22d3ee', '#67e8f9', '#10b981', '#34d399'],
          count: Math.floor(6 * intensity),
          speed: 2.5,
          life: 1000,
          size: { min: 2, max: 4 }
        };
      default:
        return {
          colors: ['#64748b', '#94a3b8', '#cbd5e1'],
          count: 5,
          speed: 1,
          life: 2000,
          size: { min: 1, max: 3 }
        };
    }
  };

  const createParticles = () => {
    const config = getParticleConfig(type);
    const newParticles: Particle[] = [];
    
    const centerX = position?.x ?? window.innerWidth / 2;
    const centerY = position?.y ?? window.innerHeight / 2;

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 * i) / config.count + Math.random() * 0.5;
      const speed = config.speed * (0.5 + Math.random() * 0.5);
      const size = config.size.min + Math.random() * (config.size.max - config.size.min);
      
      newParticles.push({
        id: `${type}-${Date.now()}-${i}`,
        x: centerX + (Math.random() - 0.5) * 50,
        y: centerY + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: config.life,
        maxLife: config.life,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size
      });
    }

    setParticles(newParticles);
  };

  useEffect(() => {
    if (isActive) {
      createParticles();
    } else {
      setParticles([]);
    }
  }, [isActive, type, intensity, position]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prevParticles => {
        return prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 16, // 60fps
            vy: particle.vy + 0.1, // 重力效果
          }))
          .filter(particle => particle.life > 0);
      });
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life / particle.maxLife,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// 螢幕震動效果組件
interface ScreenShakeProps {
  isActive: boolean;
  intensity?: number;
  duration?: number;
  children: React.ReactNode;
}

export function ScreenShake({ 
  isActive, 
  intensity = 5, 
  duration = 500, 
  children 
}: ScreenShakeProps) {
  return (
    <motion.div
      animate={isActive ? {
        x: [0, -intensity, intensity, -intensity, intensity, 0],
        y: [0, intensity, -intensity, intensity, -intensity, 0],
      } : { x: 0, y: 0 }}
      transition={{
        duration: duration / 1000,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

// 模糊效果組件
interface BlurOverlayProps {
  isActive: boolean;
  intensity?: number;
  color?: string;
}

export function BlurOverlay({ 
  isActive, 
  intensity = 4, 
  color = 'rgba(0, 0, 0, 0.3)' 
}: BlurOverlayProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ 
            opacity: 1, 
            backdropFilter: `blur(${intensity}px)` 
          }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-30 pointer-events-none"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
}

// 脈衝效果組件
interface PulseEffectProps {
  isActive: boolean;
  color?: string;
  intensity?: number;
  children: React.ReactNode;
}

export function PulseEffect({ 
  isActive, 
  color = '#ef4444', 
  intensity = 0.2, 
  children 
}: PulseEffectProps) {
  return (
    <motion.div
      animate={isActive ? {
        boxShadow: [
          `0 0 0 0 ${color}00`,
          `0 0 0 10px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`,
          `0 0 0 20px ${color}00`,
        ]
      } : {}}
      transition={{
        duration: 1,
        repeat: isActive ? Infinity : 0,
        ease: "easeOut"
      }}
      className="rounded-full"
    >
      {children}
    </motion.div>
  );
}

// 成功檢測動畫
interface DetectionSuccessProps {
  isVisible: boolean;
  position: { x: number; y: number };
  objectName: string;
}

export function DetectionSuccess({ isVisible, position, objectName }: DetectionSuccessProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x - 50,
            top: position.y - 50,
          }}
        >
          <div className="relative">
            {/* 外圈動畫 */}
            <motion.div
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-20 h-20 border-4 border-emerald-400 rounded-full"
            />
            
            {/* 內圈 */}
            <div className="w-20 h-20 bg-emerald-500/20 backdrop-blur-sm border-2 border-emerald-400 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ✓
              </motion.div>
            </div>
            
            {/* 物體名稱 */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap"
            >
              找到 {objectName}！
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
