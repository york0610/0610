'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaBrain, FaHeartbeat, FaBook, FaUsers, FaLightbulb } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 導航欄 */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              <FaArrowLeft className="text-cyan-400" /> ADHD 知多少
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 transition">首頁</Link>
              <Link href="/about" className="text-cyan-400 font-medium">關於ADHD</Link>
              <Link href="/assessment" className="text-slate-300 hover:text-cyan-400 transition">量表評估</Link>
              <Link href="/focus-finder" className="text-slate-300 hover:text-cyan-400 transition">遊戲體驗</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* 英雄區塊 */}
        <motion.section 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-6">關於 ADHD</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            注意力不足過動症是一種神經發展障礙，影響全球數百萬人。了解 ADHD 的科學基礎、診斷標準和治療方法。
          </p>
        </motion.section>

        <section className="max-w-6xl mx-auto">
          
          {/* ADHD 定義 */}
          <motion.div 
            className="mb-12 grid gap-8 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-3xl border border-cyan-800/50 bg-cyan-900/20 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FaBrain className="text-3xl text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">什麼是 ADHD？</h2>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                注意力不足過動症（ADHD）是一種神經發展障礙，主要特徵為持續的注意力不集中、過動和衝動行為。
              </p>
              <p className="text-slate-300 leading-relaxed">
                ADHD 不是教養不當或懶惰的結果，而是大腦功能運作方式的差異。研究顯示，ADHD 與大腦中神經傳導物質（如多巴胺和去甲腎上腺素）的調節異常有關。
              </p>
            </div>
            <div className="rounded-3xl border border-blue-800/50 bg-blue-900/20 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FaHeartbeat className="text-3xl text-blue-400" />
                <h2 className="text-2xl font-bold text-white">神經生物學基礎</h2>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>多巴胺調節異常</span></li>
                <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>執行功能受損</span></li>
                <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>前額葉皮層活動異常</span></li>
                <li className="flex gap-2"><FaCheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" /><span>遺傳因素影響</span></li>
              </ul>
            </div>
          </motion.div>

          {/* ADHD 類型 */}
          <motion.div 
            className="mb-12 grid gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-cyan-300 mb-3">注意力不集中型</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                主要表現為注意力不集中、容易分心、遺失物品、做事缺乏組織性。症狀較不明顯，常被誤認為懶惰。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-blue-300 mb-3">過動-衝動型</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                以過動和衝動行為為主，表現為坐立不安、話多、難以安靜、經常打斷他人。較容易被察覺。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
              <h3 className="text-lg font-bold text-purple-300 mb-3">混合型</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                同時具有注意力不足和過動-衝動的症狀。是最常見的類型，症狀表現最為複雜多樣。
              </p>
            </div>
          </motion.div>

          {/* 迷思澄清 */}
          <motion.div 
            className="mb-12 rounded-3xl border border-amber-800/50 bg-amber-900/20 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-amber-300 mb-6">常見迷思澄清</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <span className="text-2xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white">迷思：ADHD 只是孩子才會有的問題</p>
                  <p className="text-sm text-slate-300 mt-1">事實：約 60% 的兒童 ADHD 患者症狀會持續到成年期</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white">迷思：ADHD 是因為教養不當</p>
                  <p className="text-sm text-slate-300 mt-1">事實：ADHD 是神經生物學差異，與教養方式無關</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white">迷思：ADHD 患者只是懶惰</p>
                  <p className="text-sm text-slate-300 mt-1">事實：ADHD 患者努力工作，但執行功能受損導致困難</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl text-red-400 flex-shrink-0">✘</span>
                <div>
                  <p className="font-semibold text-white">迷思：ADHD 是現代社會的發明</p>
                  <p className="text-sm text-slate-300 mt-1">事實：ADHD 在歷史上已被記載，只是現在診斷更準確</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ADHD 的正面特質 */}
          <motion.div 
            className="mb-12 grid gap-6 md:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-2xl border border-emerald-800/50 bg-emerald-900/20 p-6">
              <h3 className="text-lg font-bold text-emerald-300 mb-3">🎨 創造力</h3>
              <p className="text-sm text-slate-300">思維跳躍，能提出獨特的解決方案和創新想法。</p>
            </div>
            <div className="rounded-2xl border border-orange-800/50 bg-orange-900/20 p-6">
              <h3 className="text-lg font-bold text-orange-300 mb-3">🔥 熱情</h3>
              <p className="text-sm text-slate-300">對感興趣的事物表現極大熱情和超強專注力。</p>
            </div>
            <div className="rounded-2xl border border-teal-800/50 bg-teal-900/20 p-6">
              <h3 className="text-lg font-bold text-teal-300 mb-3">⚡ 適應力</h3>
              <p className="text-sm text-slate-300">快速適應變化和突發情況，靈活應對挑戰。</p>
            </div>
            <div className="rounded-2xl border border-pink-800/50 bg-pink-900/20 p-6">
              <h3 className="text-lg font-bold text-pink-300 mb-3">💡 直覺</h3>
              <p className="text-sm text-slate-300">敏銳的直覺和快速的反應能力。</p>
            </div>
          </motion.div>

          {/* 診斷標準 */}
          <motion.div 
            className="mb-12 rounded-3xl border border-blue-800/50 bg-blue-900/20 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaBook className="text-3xl text-blue-400" />
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
          </motion.div>

          {/* 藥物治療詳解 */}
          <motion.div 
            className="mb-12 rounded-3xl border border-green-800/50 bg-green-900/20 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-green-300 mb-6">💊 藥物治療機轉</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold text-green-200 mb-3">刺激劑（常用）</h3>
                <p className="text-slate-300 text-sm mb-2">甲基芬丙酒酸鹿、安非他民類</p>
                <p className="text-slate-400 text-xs">主要提升前額葉–紅狀體路徑的兒茶酒胺可用性，改善專注、抱止控制。</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-200 mb-3">非刺激劑（替代）</h3>
                <p className="text-slate-300 text-sm mb-2">Atomoxetine 等</p>
                <p className="text-slate-400 text-xs">選擇性去甲腎上腺素回收抱止劑，對注意、過動、衝動亞有疗效。</p>
              </div>
            </div>
          </motion.div>

          {/* CBT 步驟 */}
          <motion.div 
            className="mb-12 rounded-3xl border border-indigo-800/50 bg-indigo-900/20 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-indigo-300 mb-6">📋 認知行為治療 (CBT) 步驟</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-300 font-bold">1</span>
                <div>
                  <p className="font-semibold text-white">心理教育與動機建立</p>
                  <p className="text-sm text-slate-400">認識 ADHD 的神經生物學基礎、症狀表現、治療方案</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-300 font-bold">2</span>
                <div>
                  <p className="font-semibold text-white">時間管理與任務切塔</p>
                  <p className="text-sm text-slate-400">學歸時間管理、任務分解成可管理的步驟</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-300 font-bold">3</span>
                <div>
                  <p className="font-semibold text-white">外部化工具</p>
                  <p className="text-sm text-slate-400">待辛、提醒、視覺化、棄事清單</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-300 font-bold">4</span>
                <div>
                  <p className="font-semibold text-white">認知重構與拖延處理</p>
                  <p className="text-sm text-slate-400">識別不合理信念、拖延機制、情緒調節</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-300 font-bold">5</span>
                <div>
                  <p className="font-semibold text-white">問題解決與情緒調節</p>
                  <p className="text-sm text-slate-400">教學泌理情緒、不安管理、人際關係技巧</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-indigo-300 font-bold">6</span>
                <div>
                  <p className="font-semibold text-white">情境演練、回家作業與複發預防</p>
                  <p className="text-sm text-slate-400">實際情境演練、設定回家作業、設計複發預防計畫</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 生活方式建議 */}
          <motion.div 
            className="mb-12 rounded-3xl border border-teal-800/50 bg-teal-900/20 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-teal-300 mb-6">🌟 生活方式調整建議</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="text-lg font-bold text-teal-200 mb-2">😴 睡眠衛生</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✓ 固定作息、減少睡前螢幕</li>
                  <li>✓ 規劃陋雜與遮光</li>
                  <li>✓ 減少咖啡因、酒精</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal-200 mb-2">🏃 規律運動</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✓ 週期性有氧運動</li>
                  <li>✓ 阻力訓練</li>
                  <li>✓ 時間區塊管理</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal-200 mb-2">🧘 正念訓練</h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✓ 短時段身體掃描</li>
                  <li>✓ 呼吸訓練</li>
                  <li>✓ 注意力調節</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 治療與支持 */}
          <motion.div 
            className="mb-12 grid gap-8 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="rounded-3xl border border-cyan-800/50 bg-cyan-900/20 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FaHeartbeat className="text-3xl text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">治療方法</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2"><FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" /><span>藥物治療（刺激劑或非刺激劑）</span></li>
                <li className="flex gap-2"><FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" /><span>認知行為治療（CBT）</span></li>
                <li className="flex gap-2"><FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" /><span>心理治療和諮詢</span></li>
                <li className="flex gap-2"><FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" /><span>教育和職業支持</span></li>
                <li className="flex gap-2"><FaCheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" /><span>生活方式調整</span></li>
              </ul>
            </div>
            <div className="rounded-3xl border border-purple-800/50 bg-purple-900/20 p-8">
              <div className="flex items-center gap-3 mb-4">
                <FaUsers className="text-3xl text-purple-400" />
                <h3 className="text-2xl font-bold text-white">尋求幫助</h3>
              </div>
              <p className="text-slate-300 mb-4">
                如果您懷疑自己或您的孩子可能有 ADHD，建議尋求專業醫療人員的評估和診斷。
              </p>
              <p className="text-slate-300 mb-6">
                記住，尋求幫助是邁向更好生活的第一步。早期診斷和適當的干預可以顯著改善預後。
              </p>
              <Link 
                href="/assessment" 
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white transition hover:shadow-lg hover:shadow-purple-500/50"
              >
                <FaLightbulb /> 進行 ASRS 量表評估
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 頁尾 */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12 text-center text-slate-400">
        <p>© {new Date().getFullYear()} ADHD 知多少. 版權所有。</p>
      </footer>
    </div>
  );
}
