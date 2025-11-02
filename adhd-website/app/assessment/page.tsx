'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

type ResponseScore = 0 | 1 | 2 | 3 | 4;

interface Question {
  id: number;
  text: string;
  category: 'inattention' | 'hyperactivity';
}

const ASRS_QUESTIONS: Question[] = [
  // 注意力不集中症狀（Part A）
  { id: 1, text: '在進行工作或活動時，是否經常無法注意細節，或因粗心而犯錯？', category: 'inattention' },
  { id: 2, text: '在工作或活動中，是否難以維持注意力？', category: 'inattention' },
  { id: 3, text: '當別人直接對你說話時，是否似乎沒有在聽？', category: 'inattention' },
  { id: 4, text: '是否難以組織工作或活動？', category: 'inattention' },
  { id: 5, text: '是否避免或不願意進行需要持續精神努力的工作或活動？', category: 'inattention' },
  { id: 6, text: '是否經常遺失工作或活動所需的物品（如鑰匙、錢包、手機）？', category: 'inattention' },
  { id: 7, text: '是否容易被無關的刺激分散注意力？', category: 'inattention' },
  { id: 8, text: '在日常活動中是否經常忘記事情？', category: 'inattention' },
  { id: 9, text: '是否難以完成多步驟的任務？', category: 'inattention' },

  // 過動/衝動症狀（Part B）
  { id: 10, text: '是否經常坐立不安或扭動手腳？', category: 'hyperactivity' },
  { id: 11, text: '是否難以在需要安靜的情況下保持靜止？', category: 'hyperactivity' },
  { id: 12, text: '是否感到過度活躍或像被馬達驅動一樣？', category: 'hyperactivity' },
  { id: 13, text: '是否難以進行需要安靜的活動？', category: 'hyperactivity' },
  { id: 14, text: '是否經常說話過多？', category: 'hyperactivity' },
  { id: 15, text: '當別人還在說話時，是否經常打斷或插嘴？', category: 'hyperactivity' },
  { id: 16, text: '是否難以等待輪流？', category: 'hyperactivity' },
  { id: 17, text: '是否經常打斷或干擾他人？', category: 'hyperactivity' },
  { id: 18, text: '是否難以控制衝動行為？', category: 'hyperactivity' },
];

const RESPONSE_OPTIONS = [
  { value: 0, label: '從不' },
  { value: 1, label: '很少' },
  { value: 2, label: '有時' },
  { value: 3, label: '經常' },
  { value: 4, label: '非常經常' },
];

export default function AssessmentPage() {
  const [responses, setResponses] = useState<Record<number, ResponseScore>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponse = useCallback((questionId: number, score: ResponseScore) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: score
    }));
  }, []);

  const calculateScores = () => {
    const inattentionScore = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .reduce((sum, id) => sum + (responses[id] || 0), 0);
    
    const hyperactivityScore = [10, 11, 12, 13, 14, 15, 16, 17, 18]
      .reduce((sum, id) => sum + (responses[id] || 0), 0);

    const totalScore = inattentionScore + hyperactivityScore;

    return {
      inattentionScore,
      hyperactivityScore,
      totalScore,
      maxScore: 36,
    };
  };

  const isComplete = Object.keys(responses).length === 18;
  const scores = calculateScores();

  const getInterpretation = () => {
    const { totalScore } = scores;
    if (totalScore >= 24) {
      return {
        level: '高風險',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        description: '您的分數表明可能存在 ADHD 症狀。建議您諮詢醫療專業人士進行進一步評估。',
      };
    } else if (totalScore >= 16) {
      return {
        level: '中等風險',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        description: '您的分數表明可能存在一些 ADHD 症狀。建議您進一步了解或諮詢專業人士。',
      };
    } else {
      return {
        level: '低風險',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        description: '您的分數表明 ADHD 症狀風險較低。但如果您有任何疑慮，仍建議諮詢專業人士。',
      };
    }
  };

  const interpretation = getInterpretation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          <FaArrowLeft /> 返回首頁
        </Link>

        {!showResults ? (
          <>
            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ASRS v1.1 ADHD 自評量表
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                這是聯合國世界衛生組織（WHO）推薦的 ADHD 篩查工具。請根據過去 6 個月的情況回答以下問題。
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-300">
                  已完成: {Object.keys(responses).length} / 18
                </span>
                <span className="text-sm font-medium text-cyan-400">
                  {Math.round((Object.keys(responses).length / 18) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(responses).length / 18) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {ASRS_QUESTIONS.map((question) => (
                <div key={question.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 font-bold text-sm">
                        {question.id}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-white font-medium mb-4">{question.text}</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {RESPONSE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleResponse(question.id, option.value as ResponseScore)}
                            className={`p-3 rounded-xl text-sm font-medium transition-all ${
                              responses[question.id] === option.value
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-12 flex gap-4">
              <button
                onClick={() => setShowResults(true)}
                disabled={!isComplete}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-2xl font-bold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-lg"
              >
                {isComplete ? '查看結果' : '請完成所有問題'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Results Page */}
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                您的評估結果
              </h1>
            </div>

            {/* Risk Level */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <FaExclamationTriangle className={`text-4xl ${interpretation.color === 'text-red-600' ? 'text-red-400' : interpretation.color === 'text-amber-600' ? 'text-amber-400' : 'text-green-400'}`} />
                <h2 className={`text-4xl font-bold ${interpretation.color === 'text-red-600' ? 'text-red-400' : interpretation.color === 'text-amber-600' ? 'text-amber-400' : 'text-green-400'}`}>
                  {interpretation.level}
                </h2>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">{interpretation.description}</p>
            </div>

            {/* Detailed Scores */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <p className="text-slate-400 text-sm font-medium mb-2">注意力不集中症狀</p>
                <p className="text-5xl font-bold text-blue-400">{scores.inattentionScore}</p>
                <p className="text-slate-500 text-sm mt-2">滿分: 36</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <p className="text-slate-400 text-sm font-medium mb-2">過動/衝動症狀</p>
                <p className="text-5xl font-bold text-purple-400">{scores.hyperactivityScore}</p>
                <p className="text-slate-500 text-sm mt-2">滿分: 36</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <p className="text-slate-400 text-sm font-medium mb-2">總分</p>
                <p className="text-5xl font-bold text-cyan-400">{scores.totalScore}</p>
                <p className="text-slate-500 text-sm mt-2">滿分: 72</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">建議</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0 text-xl" />
                  <span>本量表僅供參考，不能作為診斷依據</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0 text-xl" />
                  <span>如有疑慮，請諮詢醫療專業人士進行正式評估</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0 text-xl" />
                  <span>ADHD 是可以治療和管理的，早期干預效果更好</span>
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResponses({});
                  setShowResults(false);
                }}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
              >
                重新測試
              </button>
              <Link
                href="/"
                className="flex-1 bg-slate-700 text-white py-4 rounded-2xl font-bold hover:bg-slate-600 transition-colors text-center shadow-lg"
              >
                返回首頁
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
