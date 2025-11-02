'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FaArrowRight,
  FaBolt,
  FaBrain,
  FaCheckCircle,
  FaChild,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaGamepad,
  FaPlay,
  FaUsers,
  FaHeartbeat,
  FaComments,
  FaClipboard,
  FaRocket,
  FaStar,
  FaFire
} from 'react-icons/fa';
import { SplitText, GradientText, FloatingText } from './components/AnimatedText';
import GlassCard, { FeatureCard, StatCard } from './components/GlassCard';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 動態背景 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]" />

        {/* 動畫粒子 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 英雄區塊 */}
      <div className="relative">
        <header className="relative mx-auto max-w-7xl px-6 pb-20 pt-32">
          <div className="text-center">
            {/* 標籤 */}
            <FloatingText delay={0}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 border border-cyan-500/30 px-6 py-3 text-sm font-bold text-cyan-300 backdrop-blur-sm shadow-lg"
              >
                <FaBrain className="animate-pulse" />
                <span>認識注意力不足過動症</span>
                <FaStar className="text-yellow-400 animate-pulse" />
              </motion.div>
            </FloatingText>

            {/* 主標題 */}
            <FloatingText delay={0.2}>
              <h1 className="mt-12 text-6xl font-black sm:text-7xl lg:text-8xl">
                <GradientText gradient="from-blue-400 via-cyan-400 to-teal-400">
                  ADHD 知多少
                </GradientText>
              </h1>
            </FloatingText>

            {/* 副標題 */}
            <FloatingText delay={0.4}>
              <p className="mt-6 text-2xl font-bold">
                <GradientText gradient="from-cyan-300 to-blue-300">
                  探索大腦的奇妙世界
                </GradientText>
              </p>
            </FloatingText>

            {/* 描述 */}
            <FloatingText delay={0.6}>
              <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-300">
                注意力不足過動症（ADHD）是一種<span className="text-cyan-400 font-semibold">神經發展差異</span>，影響全球數百萬人。
                成人症狀常被低估，臨床辨識與就醫率顯著低於實際盛行率。
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <FaExclamationTriangle className="text-cyan-400" />
                  症狀必須在 12 歲之前出現，持續至少六個月，並在多個生活情境中造成明顯的功能障礙
                </span>
              </p>
            </FloatingText>

            {/* CTA 按鈕 */}
            <FloatingText delay={0.8}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/focus-finder/prototype"
                  className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 hover:shadow-cyan-500/50"
                >
                  <FaGamepad className="text-2xl group-hover:rotate-12 transition-transform" />
                  <span>開始體驗遊戲</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
                </Link>

                <Link
                  href="#learn-more"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-700 bg-slate-800/50 px-8 py-4 text-lg font-bold text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-slate-800"
                >
                  <FaBrain />
                  <span>了解更多</span>
                </Link>
              </div>
            </FloatingText>

            {/* 核心數據 */}
            <FloatingText delay={1}>
              <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                <StatCard
                  value="2–4%"
                  label="成人盛行率"
                  sublabel="全球估計值"
                  icon={<FaUsers />}
                  color="blue"
                />
                <StatCard
                  value="5–10%"
                  label="兒童盛行率"
                  sublabel="全球估計值"
                  icon={<FaChild />}
                  color="cyan"
                />
                <StatCard
                  value="低識別"
                  label="成人診斷率"
                  sublabel="遠低於實際盛行率"
                  icon={<FaExclamationTriangle />}
                  color="orange"
                />
                <StatCard
                  value="↑ 上升"
                  label="台灣診斷率"
                  sublabel="2000–2011 年間"
                  icon={<FaHeartbeat />}
                  color="pink"
                />
              </div>
            </FloatingText>
          </div>
        </header>
      </div>

      {/* 睡眠問題重要提示 */}
      <div id="learn-more" className="mx-auto max-w-7xl px-6 py-16">
        <GlassCard gradient className="p-8 border-amber-500/30">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <motion.div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">😴</span>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">
                <GradientText gradient="from-amber-400 to-orange-400">
                  睡眠問題是 ADHD 的重要共伴護理項目
                </GradientText>
              </h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                睡眠問題在青少年 ADHD 族群中顯著常見，並顯著影響日常與學業功能。建議在評估與介入中常規納入。
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <motion.div
                  className="flex gap-3 items-start p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaCheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">改善睡眠有助提升日間功能與課業表現</span>
                </motion.div>
                <motion.div
                  className="flex gap-3 items-start p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaCheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">睡眠不足會加重 ADHD 症狀</span>
                </motion.div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ADHD 三種類型 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <GradientText>ADHD 的三種類型</GradientText>
          </h2>
          <p className="text-slate-400 text-lg">了解不同的表現形式，找到最適合的支持方式</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 類型 1：注意力不足型 */}
          <GlassCard gradient className="p-8 border-blue-500/30">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 mb-6"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <FaEye className="text-4xl text-blue-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">注意力不足型</h3>
            <p className="text-blue-300 text-sm mb-4">Predominantly Inattentive</p>
            <p className="text-slate-300 mb-6 leading-relaxed">
              主要表現為注意力方面的困難，症狀較不明顯，常被誤認為懶惰或缺乏動力。
            </p>
            <div className="space-y-3">
              {[
                '難以持續專注，容易分心',
                '經常遺失物品，做事缺乏組織性',
                '難以完成任務細節，常犯粗心錯誤'
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <FaCheckCircle className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* 類型 2：過動-衝動型 */}
          <GlassCard gradient className="p-8 border-purple-500/30">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 mb-6"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <FaBolt className="text-4xl text-purple-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">過動-衝動型</h3>
            <p className="text-purple-300 text-sm mb-4">Predominantly Hyperactive-Impulsive</p>
            <p className="text-slate-300 mb-6 leading-relaxed">
              以過動和衝動行為為主，較容易被察覺，特別是在兒童時期。
            </p>
            <div className="space-y-3">
              {[
                '坐立不安，話多，難以安靜',
                '經常打斷他人，難以等待',
                '衝動行為，難以控制脾氣'
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <FaCheckCircle className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* 類型 3：混合型 */}
          <GlassCard gradient className="p-8 border-orange-500/30 md:col-span-2 lg:col-span-1">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30 mb-6"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <FaBrain className="text-4xl text-orange-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">混合型</h3>
            <p className="text-orange-300 text-sm mb-4">Combined Presentation</p>
            <p className="text-slate-300 mb-6 leading-relaxed">
              同時具有注意力不足和過動-衝動的症狀，是最常見的類型。
            </p>
            <div className="space-y-3">
              {[
                '結合注意力不足的特徵',
                '結合過動-衝動的特徵',
                '症狀表現最為複雜多樣'
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-500/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <FaCheckCircle className="text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ADHD 的成人症狀 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <GradientText>成人 ADHD 的常見症狀</GradientText>
          </h2>
          <p className="text-slate-400 text-lg">許多成人 ADHD 患者直到成年後才被診斷，因為症狀表現方式與兒童不同</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="⏰"
            title="時間管理困難"
            description="難以估計時間，經常遲到或錯過截止日期"
            color="cyan"
          />

          <FeatureCard
            icon="📋"
            title="組織能力弱"
            description="工作和生活空間混亂，難以制定計劃"
            color="blue"
          />

          <FeatureCard
            icon="🧠"
            title="記憶問題"
            description="短期記憶不佳，容易忘記重要信息"
            color="purple"
          />

          <FeatureCard
            icon="💓"
            title="情緒調節困難"
            description="情緒波動大，容易感到沮喪或過度興奮"
            color="orange"
          />

          <FeatureCard
            icon="💬"
            title="社交困難"
            description="難以傾聽他人，容易打斷或說話過多"
            color="teal"
          />

          <FeatureCard
            icon="⚡"
            title="衝動行為"
            description="做決定前缺乏思考，容易衝動消費"
            color="pink"
          />
        </div>
      </div>

      {/* ADHD 的診斷和治療 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* 診斷 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-5xl">🔍</span>
              <h2 className="text-3xl font-black">
                <GradientText gradient="from-blue-400 to-cyan-400">ADHD 的診斷</GradientText>
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { title: '臨床評估', desc: '由專業醫生進行詳細的病史採集和症狀評估', color: 'blue' },
                { title: '心理測試', desc: '使用標準化測試工具（如 ADHD-RS、CAARS）評估症狀嚴重程度', color: 'cyan' },
                { title: '排除其他疾病', desc: '確保症狀不是由其他醫學或心理健康狀況引起', color: 'teal' },
                { title: '多角度評估', desc: '收集來自家庭、工作或學校的多方面信息', color: 'blue' }
              ].map((item, idx) => (
                <GlassCard key={idx} gradient className={`p-5 border-${item.color}-500/30`}>
                  <h3 className={`font-bold text-${item.color}-300 mb-2 text-lg`}>{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* 治療 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-5xl">💊</span>
              <h2 className="text-3xl font-black">
                <GradientText gradient="from-purple-400 to-pink-400">ADHD 的治療方法</GradientText>
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { title: '藥物治療', desc: '刺激類或非刺激類藥物可幫助改善注意力和衝動控制', color: 'purple' },
                { title: '行為療法', desc: '認知行為療法（CBT）幫助改善組織能力和情緒管理', color: 'pink' },
                { title: '生活方式調整', desc: '規律作息、運動、冥想和時間管理技巧', color: 'orange' },
                { title: '教育和支持', desc: '了解 ADHD、加入支持小組、獲得工作或學校的適應措施', color: 'purple' }
              ].map((item, idx) => (
                <GlassCard key={idx} gradient className={`p-5 border-${item.color}-500/30`}>
                  <h3 className={`font-bold text-${item.color}-300 mb-2 text-lg`}>{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ADHD 的影響 */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <GlassCard gradient className="p-10 border-red-500/30">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black mb-4">
              <GradientText gradient="from-red-400 via-orange-400 to-yellow-400">
                ⚠️ ADHD 的長期影響
              </GradientText>
            </h2>
            <p className="text-slate-400">了解治療的重要性</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* 不治療的後果 */}
            <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">❌</span>
                <h3 className="text-2xl font-bold text-red-300">如果不進行治療</h3>
              </div>
              <ul className="space-y-3">
                {[
                  '學業成績下降或無法完成教育',
                  '工作表現不佳，頻繁換工作',
                  '人際關係困難和社交孤立',
                  '心理健康問題（焦慮、抑鬱）',
                  '物質濫用風險增加'
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex gap-3 items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="text-red-400 text-xl flex-shrink-0">•</span>
                    <span className="text-slate-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* 治療的好處 */}
            <div className="rounded-2xl border border-green-500/30 bg-green-900/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">✅</span>
                <h3 className="text-2xl font-bold text-green-300">通過適當治療和支持</h3>
              </div>
              <ul className="space-y-3">
                {[
                  '改善學業和工作表現',
                  '建立更好的人際關係',
                  '提升自尊和自信',
                  '減少心理健康問題',
                  '提高生活質量和滿意度'
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex gap-3 items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                    <span className="text-slate-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 重要提醒 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <GlassCard gradient className="p-8 border-cyan-500/30">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <motion.div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">💡</span>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">
                <GradientText gradient="from-cyan-400 to-blue-400">重要提醒</GradientText>
              </h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                ADHD 是一種<span className="text-cyan-400 font-semibold">神經發展差異</span>，不是性格缺陷或智力問題。
                許多成功的人士都有 ADHD，他們通過了解自己、尋求幫助和制定適應策略而蓬勃發展。
              </p>
              <p className="text-slate-300 leading-relaxed">
                如果你懷疑自己或親友可能患有 ADHD，請<span className="text-cyan-400 font-semibold">諮詢醫療專業人士</span>進行評估。
                早期診斷和干預可以顯著改善生活質量。
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 開始體驗 CTA */}
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <GradientText>準備好體驗了嗎？</GradientText>
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            通過互動遊戲，親身體驗 ADHD 患者在日常生活中面臨的挑戰。
            <br />
            <span className="text-cyan-400 font-semibold">這不是遊戲，這是一場 90 秒的同理心之旅。</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/focus-finder/prototype"
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-12 py-6 text-xl font-black text-white shadow-2xl transition-all hover:scale-105 hover:shadow-cyan-500/50"
            >
              <FaRocket className="text-2xl group-hover:translate-y-[-4px] transition-transform" />
              <span>開始體驗</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
            </Link>

            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-700 bg-slate-800/50 px-8 py-6 text-lg font-bold text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-slate-800"
            >
              <FaClipboard />
              <span>進行評估</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}