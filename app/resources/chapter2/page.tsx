'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import {
  FaArrowLeft,
  FaBrain,
  FaFlask,
  FaNetworkWired,
  FaDna,
  FaCheckCircle,
  FaLightbulb,
  FaBook,
  FaHeartbeat
} from 'react-icons/fa';

export default function Chapter2Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      
      {/* 返回按鈕 */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft />
          返回首頁
        </Link>
      </div>

      {/* 標題區塊 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaBrain className="text-5xl text-purple-400" />
            <h1 className="text-5xl font-black text-white">第二章：神經科學基礎</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            深入理解 ADHD 的大腦科學 - 從神經遞質到大腦結構的完整解析
          </p>
        </motion.div>
      </div>

      {/* 神經遞質系統 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
            <FaFlask className="text-purple-400" />
            神經遞質系統（訊號兵的失衡）
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* 多巴胺 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-blue-500/30 bg-blue-900/20 p-8"
            >
              <h3 className="text-3xl font-bold text-blue-300 mb-4">🎯 多巴胺 (Dopamine)</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-blue-200 mb-2">功能</h4>
                  <p className="text-slate-300">
                    負責「動機」、「獎勵」和「專注」。它是大腦的「Go!」訊號，讓您對目標產生興趣並採取行動。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-blue-200 mb-2">ADHD 的情況</h4>
                  <p className="text-slate-300 mb-3">
                    ADHD 的大腦並非「缺乏」多巴胺，而是其調節系統（特別是轉運體 DAT）過於活躍，導致多巴胺在神經突觸間的停留時間太短，訊號還沒被充分接收就被「回收」了。
                  </p>
                  <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-slate-300">
                      💡 <span className="font-semibold">簡單比喻</span>：就像一個快速傳送帶，訊息還沒被讀取就被帶走了。
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-blue-200 mb-2">結果</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">動機水平不穩定</span>
                    </li>
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">需要更高、更新鮮的刺激才能「啟動」系統</span>
                    </li>
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">對「有興趣」的事能極度專注</span>
                    </li>
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-blue-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">對「該做」的事卻難以啟動</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* 去甲腎上腺素 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-orange-500/30 bg-orange-900/20 p-8"
            >
              <h3 className="text-3xl font-bold text-orange-300 mb-4">⚡ 去甲腎上腺素 (Norepinephrine)</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-orange-200 mb-2">功能</h4>
                  <p className="text-slate-300">
                    負責「警覺」、「清醒」和「執行功能」。它是大腦的「Ready!」訊號，幫助過濾干擾，保持專注。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-orange-200 mb-2">ADHD 的情況</h4>
                  <p className="text-slate-300 mb-3">
                    同樣存在調節失衡，導致訊號「雜訊」過多，難以篩選重要信息。
                  </p>
                  <div className="bg-orange-900/40 border border-orange-500/30 rounded-lg p-4">
                    <p className="text-sm text-slate-300">
                      💡 <span className="font-semibold">簡單比喻</span>：就像一個收音機，所有頻道都在同時播放，無法聚焦在一個頻道上。
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-orange-200 mb-2">結果</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">容易分心</span>
                    </li>
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">警覺度忽高忽低</span>
                    </li>
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">有時很睏，有時極度亢奮</span>
                    </li>
                    <li className="flex gap-2">
                      <FaCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">難以過濾背景噪音</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 大腦結構差異 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
            <FaNetworkWired className="text-cyan-400" />
            大腦結構差異（指揮中心的差異）
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* 前額葉皮質 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-cyan-500/30 bg-cyan-900/20 p-8"
            >
              <h3 className="text-2xl font-bold text-cyan-300 mb-4">👔 前額葉皮質 (Prefrontal Cortex, PFC)</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-cyan-200 mb-2">大腦的「執行長 (CEO)」</h4>
                  <p className="text-slate-300 text-sm">
                    負責決策、計畫、抑制衝動（剎車）、工作記憶和情緒調節。
                  </p>
                </div>

                <div className="bg-cyan-900/40 border border-cyan-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-cyan-200 mb-2">ADHD 的情況</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>發育速度通常較慢（特別是右側）</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>活化程度在執行「枯燥」任務時偏低</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>與其他腦區的連結性異常</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    💡 <span className="font-semibold">影響</span>：「剎車」功能不足，導致衝動行為和難以抑制分心。
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 邊緣系統 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-pink-500/30 bg-pink-900/20 p-8"
            >
              <h3 className="text-2xl font-bold text-pink-300 mb-4">❤️ 邊緣系統 (Limbic System)</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-pink-200 mb-2">大腦的「情緒中心」</h4>
                  <p className="text-slate-300 text-sm">
                    包含杏仁核等結構，負責情緒處理和反應。
                  </p>
                </div>

                <div className="bg-pink-900/40 border border-pink-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-pink-200 mb-2">ADHD 的情況</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-pink-400">•</span>
                      <span>PFC 對邊緣系統的「管束」能力較弱</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-pink-400">•</span>
                      <span>情緒反應更直接、更強烈</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-pink-400">•</span>
                      <span>「情緒衝動」現象明顯</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-pink-900/20 border border-pink-500/20 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    💡 <span className="font-semibold">影響</span>：情緒波動大，難以控制脾氣，容易被情緒主導決策。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 執行功能障礙 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-purple-500/30 bg-purple-900/20 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <FaLightbulb className="text-purple-400" />
            執行功能障礙的神經機制
          </h2>
          
          <p className="text-slate-300 mb-6 text-lg">
            這不是「不會」，而是「叫不出來」。執行功能障礙是上述神經機制的「外在表現」。
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-3">🛑 行為抑制（剎車失靈）</h3>
              <p className="text-slate-300 text-sm">
                PFC 抑制衝動的能力不足。無法「停下來思考」，導致衝動行為和決策。
              </p>
            </div>

            <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-3">📦 工作記憶（暫存不足）</h3>
              <p className="text-slate-300 text-sm">
                無法在腦中同時記住並處理多項資訊。例如：一邊聽指示一邊拿東西會很困難。
              </p>
            </div>

            <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-3">⏰ 時間感知（內在時鐘不準）</h3>
              <p className="text-slate-300 text-sm">
                對時間流逝的感知異常。5 分鐘和 50 分鐘可能感覺差不多，導致時間管理問題。
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 遺傳和環境 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
            <FaDna className="text-green-400" />
            遺傳因素和環境影響
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-green-500/30 bg-green-900/20 p-8">
              <h3 className="text-2xl font-bold text-green-300 mb-4">🧬 遺傳因素</h3>
              <div className="space-y-4">
                <p className="text-slate-300">
                  ADHD 是神經科學中遺傳度最高的特質之一。
                </p>
                <div className="bg-green-900/40 border border-green-500/30 rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-300 mb-2">70-80%</p>
                  <p className="text-sm text-slate-300">
                    ADHD 的遺傳度，意味著如果父母一方有 ADHD，孩子有顯著更高的機率也擁有此特質。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/30 bg-orange-900/20 p-8">
              <h3 className="text-2xl font-bold text-orange-300 mb-4">🌍 環境影響</h3>
              <div className="space-y-4">
                <p className="text-slate-300">
                  遺傳奠定了基礎，但環境會「觸發」或「加劇」表現。
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-orange-400">•</span>
                    <span className="text-slate-300">孕期壓力</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-400">•</span>
                    <span className="text-slate-300">早產</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-400">•</span>
                    <span className="text-slate-300">高壓力的童年環境</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-orange-400">•</span>
                    <span className="text-slate-300">營養不良</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 神經影像學研究 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-blue-500/30 bg-blue-900/20 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <FaHeartbeat className="text-red-400" />
            神經影像學研究發現
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-4">🔬 fMRI（功能性核磁共振）</h3>
              <p className="text-slate-300 mb-4">
                ADHD 個體在執行需要「抑制」或「專注」的任務時，其前額葉皮質與相關腦區（如尾核）的活化模式與非 ADHD 者不同。
              </p>
              <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  💡 <span className="font-semibold">意義</span>：這提供了神經生物學證據，證明 ADHD 不是心理問題或行為問題，而是大腦功能的差異。
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-4">🧠 DMN（預設模式網路）</h3>
              <p className="text-slate-300 mb-4">
                DMN 是大腦「待機」時（如做白日夢）活躍的網路。ADHD 個體在需要「專注」時，DMN 常常無法被有效「關閉」。
              </p>
              <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  💡 <span className="font-semibold">結果</span>：導致「神遊」或分心，即使在需要專注的情況下。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 核心要點 */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-cyan-500/30 bg-cyan-900/20 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">🎯 核心要點</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold text-cyan-300 mb-3">為什麼理解神經科學很重要？</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>消除對 ADHD 的誤解和汙名</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>認識 ADHD 是神經生物學差異，不是道德缺陷</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>為治療和自我管理提供科學基礎</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  <span>幫助家人和朋友更好地理解和支持</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyan-300 mb-3">ADHD 大腦的特點</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">•</span>
                  <span>不是「壞」的大腦，而是「不同」的大腦</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">•</span>
                  <span>神經遞質調節系統運作方式不同</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">•</span>
                  <span>大腦結構和連結性存在差異</span>
                </li>
                <li className="flex gap-2 text-slate-300">
                  <span className="text-cyan-400">•</span>
                  <span>這些差異既是挑戰，也可能是優勢</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
