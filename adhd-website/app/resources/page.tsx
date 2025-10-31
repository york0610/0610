'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaBook, FaHospital, FaUsers, FaLightbulb, FaGamepad } from 'react-icons/fa';

export default function ResourcesPage() {
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
              <Link href="/resources" className="text-cyan-400 font-medium">資源分享</Link>
              <Link href="/contact" className="text-slate-300 hover:text-cyan-400 transition">聯絡我們</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <motion.section className="mb-16 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-6">ADHD 資源分享</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">精選推薦資源、台灣支持服務、書籍文章和自助工具，幫助您更好地理解和管理 ADHD。</p>
        </motion.section>

        <section className="max-w-6xl mx-auto">
          <motion.div className="mb-12 rounded-3xl border border-blue-800/50 bg-blue-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <FaHospital className="text-3xl text-blue-400" />
              <h2 className="text-2xl font-bold text-white">官方與醫療資源</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-blue-300 mb-3">台灣衛生單位</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>各縣市社區心理衛生中心</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>醫院兒童青少年心智科</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>成人精神醫學部門</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>學校輔導室與特教資源</span></li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-blue-300 mb-3">尋求協助的步驟</h3>
                <ol className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2"><span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold">1</span><span>聯絡當地心理衛生中心或醫院</span></li>
                  <li className="flex gap-2"><span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold">2</span><span>進行初步評估與篩檢</span></li>
                  <li className="flex gap-2"><span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold">3</span><span>接受完整臨床診斷</span></li>
                  <li className="flex gap-2"><span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold">4</span><span>制定個性化治療計畫</span></li>
                </ol>
              </div>
            </div>
          </motion.div>

          <motion.div className="mb-12 rounded-3xl border border-cyan-800/50 bg-cyan-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-6">
              <FaBook className="text-3xl text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">科普與自助資源</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">👨‍👩‍👧 家長指南</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>✓ ADHD 兒童的養育策略</li>
                  <li>✓ 學校溝通與支持申請</li>
                  <li>✓ 家庭環境調整建議</li>
                  <li>✓ 情緒管理與親子關係</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">👨‍💼 成人自助</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>✓ 職場調整與時間管理</li>
                  <li>✓ 人際關係與溝通技巧</li>
                  <li>✓ 自我認識與接納</li>
                  <li>✓ 工作績效提升策略</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">🏫 教師資源</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>✓ 課堂管理與支持策略</li>
                  <li>✓ 通用學習設計 (UDL)</li>
                  <li>✓ 行為支持與正面強化</li>
                  <li>✓ 學生評估與調整</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div className="mb-12 rounded-3xl border border-purple-800/50 bg-purple-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-6">
              <FaLightbulb className="text-3xl text-purple-400" />
              <h2 className="text-2xl font-bold text-white">推薦書籍與文章</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-purple-300 mb-4">📚 入門書籍</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div><p className="font-semibold text-white">《ADHD 完全指南》</p><p className="text-xs text-slate-400">全面介紹 ADHD 的定義、診斷、治療方法</p></div>
                  <div><p className="font-semibold text-white">《分心不是我的錯》</p><p className="text-xs text-slate-400">成人 ADHD 的自我理解與管理指南</p></div>
                  <div><p className="font-semibold text-white">《養育 ADHD 孩子的父母指南》</p><p className="text-xs text-slate-400">實用的家長養育策略與技巧</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-purple-300 mb-4">📖 進階資源</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div><p className="font-semibold text-white">《執行功能障礙與 ADHD》</p><p className="text-xs text-slate-400">深入探討 ADHD 的神經生物學基礎</p></div>
                  <div><p className="font-semibold text-white">《正念與 ADHD 治療》</p><p className="text-xs text-slate-400">整合正念冥想的 ADHD 管理方法</p></div>
                  <div><p className="font-semibold text-white">《工作場所的 ADHD 適應》</p><p className="text-xs text-slate-400">職場成功的策略與工作調整</p></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="mb-12 rounded-3xl border border-green-800/50 bg-green-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-6">
              <FaUsers className="text-3xl text-green-400" />
              <h2 className="text-2xl font-bold text-white">支持組織與社群</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-green-300 mb-3">台灣支持組織</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>台灣 ADHD 協會</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>各地心理衛生中心支持團體</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>學校特教資源中心</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>線上支持社群與論壇</span></li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="text-lg font-bold text-green-300 mb-3">國際資源</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>CHADD (美國)</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>ADHD UK</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>歐州 ADHD 聯盟</span></li>
                  <li className="flex gap-2"><FaCheckCircle className="text-green-400 flex-shrink-0 mt-0.5" /><span>線上支持社群</span></li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div className="mb-12 rounded-3xl border border-indigo-800/50 bg-indigo-900/20 p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <div className="flex items-center gap-3 mb-6">
              <FaBook className="text-3xl text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">深度學習章節</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/resources/chapter1" className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition hover:bg-slate-700/50">
                <h3 className="text-lg font-bold text-indigo-300 mb-3">第一章：立方體解析法</h3>
                <p className="text-sm text-slate-300">從生物、心理、社會三個維度全面理解 ADHD</p>
              </Link>
              <Link href="/resources/chapter2" className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition hover:bg-slate-700/50">
                <h3 className="text-lg font-bold text-indigo-300 mb-3">第二章：神經科學基礎</h3>
                <p className="text-sm text-slate-300">深入了解 ADHD 的大腦科學與神經機制</p>
              </Link>
              <Link href="/resources/chapter3" className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition hover:bg-slate-700/50">
                <h3 className="text-lg font-bold text-indigo-300 mb-3">第三章：實踐策略</h3>
                <p className="text-sm text-slate-300">ADHD 患者的日常應對技巧與自我管理</p>
              </Link>
            </div>
          </motion.div>

          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-4">準備好開始了嗎？</h3>
            <p className="text-slate-300 mb-6">進行 ASRS 量表評估，了解您的 ADHD 風險指標</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/assessment" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 font-bold text-white transition hover:shadow-lg hover:shadow-cyan-500/50">
                <FaLightbulb /> 進行量表評估
              </Link>
              <Link href="/focus-finder" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-bold text-white transition hover:shadow-lg hover:shadow-orange-500/50">
                <FaGamepad className="text-lg" /> 體驗 ADHD 模擬器
              </Link>
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