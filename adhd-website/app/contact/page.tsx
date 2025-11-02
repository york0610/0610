'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle, FaQuestionCircle, FaComments } from 'react-icons/fa';
import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { FloatingText, GradientText } from '../components/AnimatedText';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const faqs = [
    {
      question: 'ADHD 是教養或意志力問題嗎？',
      answer: '不是。ADHD 屬於神經發展差異，涉及多巴胺調節與前額葉功能等生物學基礎。與教養方式或個人意志力無關。'
    },
    {
      question: '成人也會有 ADHD 嗎？',
      answer: '會。成人族群具有可觀盛行率（2-4%），且常因補償策略被延遲辨識。許多成人在兒時未被診斷，直到成年才發現。'
    },
    {
      question: '一定需要吃藥嗎？',
      answer: '不一定。治療為個別化評估；藥物與心理社會介入可單獨或合併使用，視功能受影響程度與偏好決定。'
    },
    {
      question: '睡不好會加重症狀嗎？',
      answer: '睡眠問題與 ADHD 互為影響。改善睡眠有助提升日間功能與課業表現。建議在評估中常規納入睡眠評估。'
    },
    {
      question: '量表分數高就是確診嗎？',
      answer: '否。量表是篩檢工具，需結合臨床訪談與跨情境資訊方能診斷。完整診斷需含臨床評估與功能影響評估。'
    },
    {
      question: '如何尋求專業評估？',
      answer: '可聯絡當地精神科、兒童青少年心智科或臨床心理師。建議先進行初步篩檢（如本站 ASRS 量表），再預約專業評估。'
    }
  ];

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
        <header className="mb-16 text-center">
          <FloatingText delay={0}>
            <h1 className="text-6xl font-black mb-6">
              <GradientText gradient="from-cyan-400 via-blue-400 to-purple-400">
                聯絡我們
              </GradientText>
            </h1>
          </FloatingText>
          <FloatingText delay={0.2}>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              有任何問題或建議嗎？我們很樂意聽取您的意見。
              <br />
              預估回覆時間為 1-3 個工作日。
            </p>
          </FloatingText>
        </header>

        <section className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <GlassCard gradient className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">聯絡方式</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <FaEnvelope className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">電子郵件</p>
                    <p className="text-slate-300">iui45866804qq@gmail.com</p>
                    <p className="text-xs text-slate-500 mt-1">預估回覆 1-3 個工作日</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <FaComments className="text-2xl text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">合作</p>
                    <p className="text-slate-300">講座、內容授權、研究合作</p>
                    <p className="text-xs text-slate-500 mt-1">來信說明需求，統一回覆</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
                    <FaCheckCircle className="text-2xl text-teal-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">隱私與保密</p>
                    <p className="text-slate-300">來信資訊僅用於回覆與網頁問題</p>
                    <p className="text-xs text-slate-500 mt-1">詳見隱私政策</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard gradient className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">發送訊息</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-300 mb-2">姓名</label>
                  <input id="contact-name" name="name" type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="您的姓名" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-300 mb-2">電子郵件</label>
                  <input id="contact-email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="您的電子郵件" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-300 mb-2">主題</label>
                  <input id="contact-subject" name="subject" type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="訊息主題" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-300 mb-2">訊息</label>
                  <textarea id="contact-message" name="message" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-32 resize-none transition-colors" placeholder="請輸入您的訊息..." />
                </div>
                <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50">發送訊息</button>
                {submitted && (
                  <div className="rounded-xl bg-green-900/50 border border-green-700 p-4 text-sm text-green-200">✓ 訊息已發送！感謝您的聯絡。</div>
                )}
              </form>
            </GlassCard>
          </div>

          <GlassCard gradient className="p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <FaQuestionCircle className="text-2xl text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">常見問題 (FAQ)</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <h3 className="font-semibold text-white mb-3 flex items-start gap-2">
                    <FaQuestionCircle className="text-purple-400 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </section>
      </main>

      <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm py-12 text-center text-slate-400 mt-16">
        <p>© {new Date().getFullYear()} ADHD 知多少. 版權所有。</p>
      </footer>
    </div>
  );
}