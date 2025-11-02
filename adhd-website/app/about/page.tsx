'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBrain, FaHeartbeat, FaBook, FaUsers, FaLightbulb } from 'react-icons/fa';
import GlassCard, { FeatureCard } from '../components/GlassCard';
import { FloatingText, GradientText } from '../components/AnimatedText';

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.15),transparent_50%)]" />

        {/* Animated particles */}
        {[...Array(10)].map((_, i) => (
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

      <main className="mx-auto max-w-7xl px-6 py-24">
        {/* Hero Section */}
        <header className="mb-24 text-center">
          <FloatingText delay={0}>
            <h1 className="text-6xl font-black mb-6">
              <GradientText gradient="from-cyan-400 via-blue-400 to-purple-400">
                關於 ADHD
              </GradientText>
            </h1>
          </FloatingText>
          <FloatingText delay={0.2}>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              注意力不足過動症是一種神經發展障礙，影響全球數百萬人。
              <br />
              了解 ADHD 的科學基礎、診斷標準和治療方法。
            </p>
          </FloatingText>
        </header>

        <section className="max-w-6xl mx-auto">

          {/* ADHD Definition */}
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <GlassCard gradient className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <FaBrain className="text-2xl text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">什麼是 ADHD？</h2>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                注意力不足過動症（ADHD）是一種神經發展障礙，主要特徵為持續的注意力不集中、過動和衝動行為。
              </p>
              <p className="text-slate-300 leading-relaxed">
                ADHD 不是教養不當或懶惰的結果，而是大腦功能運作方式的差異。研究顯示，ADHD 與大腦中神經傳導物質（如多巴胺和去甲腎上腺素）的調節異常有關。
              </p>
            </GlassCard>

            <GlassCard gradient className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <FaHeartbeat className="text-2xl text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">神經生物學基礎</h2>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2">
                  <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>多巴胺調節異常</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>執行功能受損</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>前額葉皮層活動異常</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>遺傳因素影響</span>
                </li>
              </ul>
            </GlassCard>
          </div>

          {/* ADHD Types */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">
              <GradientText gradient="from-cyan-400 to-purple-400">
                ADHD 三種類型
              </GradientText>
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon="🎯"
                title="注意力不集中型"
                description="主要表現為注意力不集中、容易分心、遺失物品、做事缺乏組織性。症狀較不明顯，常被誤認為懶惰。"
                color="cyan"
              />
              <FeatureCard
                icon="⚡"
                title="過動-衝動型"
                description="以過動和衝動行為為主，表現為坐立不安、話多、難以安靜、經常打斷他人。較容易被察覺。"
                color="blue"
              />
              <FeatureCard
                icon="🌟"
                title="混合型"
                description="同時具有注意力不足和過動-衝動的症狀。是最常見的類型，症狀表現最為複雜多樣。"
                color="purple"
              />
            </div>
          </div>

          {/* Common Myths */}
          <GlassCard gradient className="p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8">
              <GradientText gradient="from-amber-400 to-orange-400">
                常見迷思澄清
              </GradientText>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <span className="text-3xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white mb-2">迷思：ADHD 只是孩子才會有的問題</p>
                  <p className="text-sm text-slate-300">事實：約 60% 的兒童 ADHD 患者症狀會持續到成年期</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white mb-2">迷思：ADHD 是因為教養不當</p>
                  <p className="text-sm text-slate-300">事實：ADHD 是神經生物學差異，與教養方式無關</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white mb-2">迷思：ADHD 患者只是懶惰</p>
                  <p className="text-sm text-slate-300">事實：ADHD 患者努力工作，但執行功能受損導致困難</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white mb-2">迷思：ADHD 是現代社會的發明</p>
                  <p className="text-sm text-slate-300">事實：ADHD 在歷史上已被記載，只是現在診斷更準確</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Positive Traits */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">
              <GradientText gradient="from-emerald-400 to-teal-400">
                ADHD 的正面特質
              </GradientText>
            </h2>
            <div className="grid gap-6 md:grid-cols-4">
              <FeatureCard
                icon="🎨"
                title="創造力"
                description="思維跳躍，能提出獨特的解決方案和創新想法。"
                color="teal"
              />
              <FeatureCard
                icon="🔥"
                title="熱情"
                description="對感興趣的事物表現極大熱情和超強專注力。"
                color="orange"
              />
              <FeatureCard
                icon="⚡"
                title="適應力"
                description="快速適應變化和突發情況，靈活應對挑戰。"
                color="cyan"
              />
              <FeatureCard
                icon="💡"
                title="直覺"
                description="敏銳的直覺和快速的反應能力。"
                color="pink"
              />
            </div>
          </div>

          {/* Diagnosis Criteria */}
          <GlassCard gradient className="p-8 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <FaBook className="text-2xl text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">診斷標準</h2>
            </div>
            <p className="text-slate-300 mb-6">
              根據 DSM-5（精神疾病診斷與統計手冊第五版），ADHD 診斷需要滿足以下條件：
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">症狀在 12 歲之前出現</span>
              </div>
              <div className="flex gap-3">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">症狀持續至少 6 個月</span>
              </div>
              <div className="flex gap-3">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">在多個生活情境中造成功能障礙</span>
              </div>
              <div className="flex gap-3">
                <FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">排除其他醫學或精神疾病</span>
              </div>
            </div>
          </GlassCard>

          {/* Treatment Methods */}
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <GlassCard gradient className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <FaHeartbeat className="text-2xl text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">治療方法</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2">
                  <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>藥物治療（刺激劑或非刺激劑）</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>認知行為治療（CBT）</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>心理治療和諮詢</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>教育和職業支持</span>
                </li>
                <li className="flex gap-2">
                  <FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>生活方式調整</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard gradient className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <FaUsers className="text-2xl text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">尋求幫助</h3>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                如果您懷疑自己或您的孩子可能有 ADHD，建議尋求專業醫療人員的評估和診斷。
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                記住，尋求幫助是邁向更好生活的第一步。早期診斷和適當的干預可以顯著改善預後。
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
              >
                <FaLightbulb /> 進行 ASRS 量表評估
              </Link>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm py-12 text-center text-slate-400">
        <p>© {new Date().getFullYear()} ADHD 知多少. 版權所有。</p>
      </footer>
    </div>
  );
}
