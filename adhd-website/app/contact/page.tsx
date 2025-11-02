'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaCheckCircle, FaQuestionCircle, FaComments } from 'react-icons/fa';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              <FaArrowLeft className="text-cyan-400" /> ADHD 知多少
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 transition">首頁</Link>
              <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition">關於ADHD</Link>
              <Link href="/resources" className="text-slate-300 hover:text-cyan-400 transition">資源分享</Link>
              <Link href="/contact" className="text-cyan-400 font-medium">聯絡我們</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <motion.section className="mb-16 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-6">聯絡我們</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">有任何問題或建議嗎？我們很樂意聽取您的意見。預估回覆時間為 1-3 個工作日。</p>
        </motion.section>

        <section className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <motion.div className="rounded-3xl border border-blue-800/50 bg-blue-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-white mb-6">聯絡方式</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <FaEnvelope className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">電子郵件</p>
                    <p className="text-slate-300">iui45866804qq@gmail.com</p>
                    <p className="text-xs text-slate-500 mt-1">預估回覆 1-3 個工作日</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <FaComments className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">合作</p>
                    <p className="text-slate-300">講座、內容授權、研究合作</p>
                    <p className="text-xs text-slate-500 mt-1">來信說明需求，統一回覆</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <FaCheckCircle className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">隱私與保密</p>
                    <p className="text-slate-300">來信資訊僅用於回覆與網頁問題</p>
                    <p className="text-xs text-slate-500 mt-1">詳見隱私政策</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="rounded-3xl border border-cyan-800/50 bg-cyan-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold text-white mb-6">發送訊息</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-300 mb-2">姓名</label>
                  <input id="contact-name" name="name" type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" placeholder="您的姓名" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-300 mb-2">電子郵件</label>
                  <input id="contact-email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" placeholder="您的電子郵件" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-300 mb-2">主題</label>
                  <input id="contact-subject" name="subject" type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" placeholder="訊息主題" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-300 mb-2">訊息</label>
                  <textarea id="contact-message" name="message" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 h-32 resize-none" placeholder="請輸入您的訊息..." />
                </div>
                <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white transition hover:shadow-lg hover:shadow-cyan-500/50">發送訊息</button>
                {submitted && (
                  <div className="rounded-lg bg-green-900/50 border border-green-700 p-3 text-sm text-green-200">✓ 訊息已發送！感謝您的聯絡。</div>
                )}
              </form>
            </motion.div>
          </div>

          <motion.div className="rounded-3xl border border-purple-800/50 bg-purple-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-8">
              <FaQuestionCircle className="text-3xl text-purple-400" />
              <h2 className="text-2xl font-bold text-white">常見問題 (FAQ)</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <motion.div key={index} className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + index * 0.05 }}>
                  <h3 className="font-semibold text-white mb-2 flex items-start gap-2">
                    <FaQuestionCircle className="text-purple-400 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-12 text-center text-slate-400 mt-16">
        <p>© {new Date().getFullYear()} ADHD 知多少. 版權所有。</p>
      </footer>
    </div>
  );
}