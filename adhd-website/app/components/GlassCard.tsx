'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  blur = 'md'
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-2xl border border-white/10
        ${blurClasses[blur]}
        ${gradient 
          ? 'bg-gradient-to-br from-white/10 via-white/5 to-transparent' 
          : 'bg-white/5'
        }
        shadow-xl
        ${hover ? 'hover:border-white/20 hover:shadow-2xl' : ''}
        ${className}
      `}
    >
      {/* 光澤效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* 內容 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'blue' | 'purple' | 'cyan' | 'teal' | 'orange' | 'pink';
  className?: string;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  color = 'blue',
  className = '' 
}: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-2xl border
        bg-gradient-to-br backdrop-blur-md
        ${colorClasses[color]}
        p-6 shadow-lg hover:shadow-2xl
        ${className}
      `}
    >
      {/* 背景光暈 */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  icon: ReactNode;
  color?: 'blue' | 'purple' | 'cyan' | 'teal' | 'orange' | 'pink';
}

export function StatCard({ value, label, sublabel, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className={`
        rounded-2xl border bg-gradient-to-br backdrop-blur-md
        ${colorClasses[color]}
        p-6 text-center shadow-lg
      `}
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="text-3xl">{icon}</div>
        <div className="text-4xl font-black">{value}</div>
      </div>
      <div className="text-sm font-semibold text-slate-300">{label}</div>
      {sublabel && <div className="text-xs text-slate-400 mt-1">{sublabel}</div>}
    </motion.div>
  );
}

