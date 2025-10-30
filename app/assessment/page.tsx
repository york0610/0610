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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* 返回按鈕 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-700 font-medium"
        >
          <FaArrowLeft /> 返回首頁
        </Link>

        {!showResults ? (
          <>
            {/* 標題 */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">ASRS v1.1 ADHD 自評量表</h1>
              <p className="text-gray-600 text-lg">
                這是聯合國世界衛生組織（WHO）推薦的 ADHD 篩查工具。請根據過去 6 個月的情況回答以下問題。
              </p>
            </div>

            {/* 進度指示 */}
            <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  已完成: {Object.keys(responses).length} / 18
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round((Object.keys(responses).length / 18) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(responses).length / 18) * 100}%` }}
                />
              </div>
            </div>

            {/* 問卷 */}
            <div className="space-y-6">
              {ASRS_QUESTIONS.map((question) => (
                <div key={question.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                        {question.id}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800 font-medium mb-4">{question.text}</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {RESPONSE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleResponse(question.id, option.value as ResponseScore)}
                            className={`p-2 rounded-lg text-sm font-medium transition-all ${
                              responses[question.id] === option.value
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

            {/* 提交按鈕 */}
            <div className="mt-12 flex gap-4">
              <button
                onClick={() => setShowResults(true)}
                disabled={!isComplete}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isComplete ? '查看結果' : '請完成所有問題'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 結果頁面 */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">您的評估結果</h1>
            </div>

            {/* 風險等級 */}
            <div className={`${interpretation.bgColor} ${interpretation.borderColor} border-2 rounded-lg p-8 mb-8`}>
              <div className="flex items-center gap-4 mb-4">
                <FaExclamationTriangle className={`text-3xl ${interpretation.color}`} />
                <h2 className={`text-3xl font-bold ${interpretation.color}`}>
                  {interpretation.level}
                </h2>
              </div>
              <p className="text-gray-700 text-lg">{interpretation.description}</p>
            </div>

            {/* 詳細分數 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 text-sm font-medium mb-2">注意力不集中症狀</p>
                <p className="text-4xl font-bold text-blue-600">{scores.inattentionScore}</p>
                <p className="text-gray-500 text-sm mt-2">滿分: 36</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 text-sm font-medium mb-2">過動/衝動症狀</p>
                <p className="text-4xl font-bold text-purple-600">{scores.hyperactivityScore}</p>
                <p className="text-gray-500 text-sm mt-2">滿分: 36</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 text-sm font-medium mb-2">總分</p>
                <p className="text-4xl font-bold text-green-600">{scores.totalScore}</p>
                <p className="text-gray-500 text-sm mt-2">滿分: 72</p>
              </div>
            </div>

            {/* 建議 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">建議</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span>本量表僅供參考，不能作為診斷依據</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span>如有疑慮，請諮詢醫療專業人士進行正式評估</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span>ADHD 是可以治療和管理的，早期干預效果更好</span>
                </li>
              </ul>
            </div>

            {/* 按鈕 */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResponses({});
                  setShowResults(false);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                重新測試
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
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
