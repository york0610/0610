'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCamera,
  FaClock,
  FaListUl,
  FaArrowLeft,
  FaLightbulb,
  FaCheck,
  FaRedo,
  FaExclamationTriangle,
  FaLocationArrow,
  FaVolumeUp,
  FaEyeSlash,
  FaHandPaper,
} from 'react-icons/fa';
import { getAudioManager } from '@/app/utils/audioManager';
import { getObjectDetector } from '@/app/utils/objectDetection';
import { getPlatformDetector, type Platform } from '@/app/utils/platformDetector';

type PermissionState = 'idle' | 'requesting' | 'granted' | 'denied';
type SessionState = 'idle' | 'running' | 'completed' | 'failed';
type DistractionType = 'environment' | 'biological' | 'social' | 'psychological';

type Task = {
  id: string;
  title: string;
  hint: string;
  prompt: string;
  emoji: string;
  difficulty: 'easy' | 'normal' | 'hard';
};

type SessionLog = {
  taskId: string;
  startedAt: number;
  completedAt: number | null;
};

type DistractionEvent = {
  id: string;
  type: DistractionType;
  triggeredAt: number;
  dismissedAt: number | null;
  cost: number;
  title: string;
};

// 情景干擾配置
const DISTRACTION_CONFIG = {
  environment: { minDelay: 12, maxDelay: 20, duration: 4000, cost: 2, title: '☀️ 陽光太刺眼' },
  biological: { minDelay: 15, maxDelay: 25, duration: 5000, cost: 2.5, title: '💧 口渴了，需要喝水' },
  social: { minDelay: 10, maxDelay: 18, duration: 3000, cost: 1.5, title: '📱 有人在叫你' },
  psychological: { minDelay: 8, maxDelay: 16, duration: 3500, cost: 1, title: '🤔 突然想到其他事' },
};

// 遊戲時間限制（秒）
const GAME_TIME_LIMIT = 90;

const TASKS: Task[] = [
  { id: 'keys', title: '找到鑰匙', hint: '通常在門邊或桌面', prompt: '掃過可能放置鑰匙的區域。', emoji: '🔑', difficulty: 'easy' },
  { id: 'wallet', title: '找到錢包', hint: '檢查褲子口袋或書堆', prompt: '仔細查看容易遺漏的地方。', emoji: '👛', difficulty: 'easy' },
  { id: 'phone', title: '找到手機', hint: '通常在充電器附近', prompt: '追蹤電源線的位置。', emoji: '📱', difficulty: 'normal' },
  { id: 'glasses', title: '找到眼鏡', hint: '可能在床頭或書桌', prompt: '檢查你經常放置的位置。', emoji: '👓', difficulty: 'normal' },
  { id: 'remote', title: '找到遙控器', hint: '通常在沙發附近', prompt: '掃過沙發周圍和抽屜下。', emoji: '📺', difficulty: 'normal' },
  { id: 'charger', title: '找到充電器', hint: '檢查插座附近', prompt: '追蹤電線的位置。', emoji: '🔌', difficulty: 'hard' },
  { id: 'headphones', title: '找到耳機', hint: '可能在抽屜或床上', prompt: '檢查你常放的地方。', emoji: '🎧', difficulty: 'hard' },
  { id: 'book', title: '找到書', hint: '書架或床頭櫃', prompt: '掃過書籍堆放的區域。', emoji: '📖', difficulty: 'easy' },
  { id: 'cup', title: '找到水杯', hint: '廚房或書桌', prompt: '檢查飲用區域。', emoji: '☕', difficulty: 'easy' },
  { id: 'watch', title: '找到手錶', hint: '床頭或洗手台', prompt: '檢查你脫下的地方。', emoji: '⌚', difficulty: 'hard' },
];

const formatSeconds = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Custom hook for distraction management
const useDistractions = (isActive: boolean, onDistractionTriggered: (type: DistractionType) => void) => {
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const activeDistractionsRef = useRef<Set<string>>(new Set());

  const scheduleDistraction = useCallback((type: DistractionType) => {
    if (activeDistractionsRef.current.has(type)) return;

    const config = DISTRACTION_CONFIG[type];
    const delay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);

    const timer = setTimeout(() => {
      if (isActive) {
        activeDistractionsRef.current.add(type);
        onDistractionTriggered(type);

        // Auto-dismiss after duration and reschedule
        setTimeout(() => {
          activeDistractionsRef.current.delete(type);
          // 重新排程下一次干擾
          if (isActive) {
            scheduleDistraction(type);
          }
        }, config.duration);
      }
    }, delay * 1000);

    timersRef.current.push(timer);
  }, [isActive, onDistractionTriggered]);

  const startDistractionCycle = useCallback(() => {
    activeDistractionsRef.current.clear();
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!isActive) return;

    // Schedule initial distractions
    scheduleDistraction('environment');
    scheduleDistraction('biological');
    scheduleDistraction('social');
    scheduleDistraction('psychological');
  }, [isActive, scheduleDistraction]);

  const stopDistractionCycle = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    activeDistractionsRef.current.clear();
  }, []);

  useEffect(() => {
    if (isActive) {
      startDistractionCycle();
    } else {
      stopDistractionCycle();
    }

    return stopDistractionCycle;
  }, [isActive, startDistractionCycle, stopDistractionCycle]);

  return { activeDistractions: activeDistractionsRef.current };
};

// Modal distraction component
const ModalDistraction = ({
  onDismiss,
  isVisible
}: {
  onDismiss: () => void;
  isVisible: boolean;
}) => {
  const messages = [
    { text: "🔔 緊急提醒：你記得鎖後門嗎？", type: "urgent" },
    { text: "💬 新訊息：媽媽傳訊息問你晚餐吃什麼？", type: "message" },
    { text: "📋 待辦事項：記得回覆同事的郵件", type: "task" },
    { text: "⚙️ 系統通知：應用程式需要更新", type: "system" },
    { text: "📱 來電：朋友打來", type: "call" },
    { text: "🔊 提醒：會議即將開始", type: "meeting" },
    { text: "💳 銀行通知：您有一筆新交易", type: "bank" },
    { text: "🎮 遊戲邀請：朋友邀請你玩遊戲", type: "game" },
    { text: "📺 Netflix：有新劇集上架", type: "entertainment" },
    { text: "🛍️ 購物提醒：您的購物車還有商品", type: "shopping" },
    { text: "📧 郵件：您有 5 封未讀郵件", type: "email" },
    { text: "⏰ 鬧鐘：該起床了！", type: "alarm" },
    { text: "🚗 導航：前方有交通擁堵", type: "navigation" },
    { text: "💪 健身提醒：今天還沒運動", type: "health" },
    { text: "🎵 音樂：您喜歡的歌手發布新歌", type: "music" },
    { text: "📰 新聞：有重要新聞更新", type: "news" },
    { text: "🏆 成就：您達成新的里程碑", type: "achievement" },
    { text: "⚡ 電量警告：電池電量低於 20%", type: "battery" },
  ];

  const [currentMessage] = useState(() => messages[Math.floor(Math.random() * messages.length)]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="max-w-sm rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl border border-amber-500/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaExclamationTriangle className="text-amber-400 text-2xl" />
              </motion.div>
              <h3 className="text-lg font-bold text-amber-300">任務中斷！</h3>
            </div>
            <p className="text-sm text-slate-100 mb-6 font-medium">{currentMessage.text}</p>
            <div className="flex gap-3">
              <button
                onClick={onDismiss}
                className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                稍後處理
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 rounded-full border-2 border-amber-400 px-4 py-3 text-sm font-bold text-amber-300 hover:bg-amber-400/10 transition-all"
              >
                馬上處理
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default function FocusFinderPrototype() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  // 平台和物體偵測狀態
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [isDetectionEnabled, setIsDetectionEnabled] = useState(false);
  const [detectedObject, setDetectedObject] = useState<string | null>(null);

  const [permissionState, setPermissionState] = useState<PermissionState>('idle');
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [distractions, setDistractions] = useState<DistractionEvent[]>([]);
  const [showHints, setShowHints] = useState(true);
  const [distractionSettings, setDistractionSettings] = useState({
    enabled: true,
    difficulty: 'normal',
  });
  const [focusLevel, setFocusLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [currentDistraction, setCurrentDistraction] = useState<DistractionEvent | null>(null);

  const difficultyIntensity = {
    easy: 0.5,
    normal: 1,
    hard: 1.5,
  }[distractionSettings.difficulty];

  const currentTask = TASKS[currentTaskIndex] ?? null;

  const { activeDistractions } = useDistractions(
    sessionState === 'running' && distractionSettings.enabled,
    useCallback((type: DistractionType) => {
      const audioManager = getAudioManager();
      const config = DISTRACTION_CONFIG[type];
      const intensity = difficultyIntensity || 1;
      
      const newDistraction: DistractionEvent = {
        id: `${type}-${Date.now()}`,
        type,
        triggeredAt: Date.now(),
        dismissedAt: null,
        cost: config.cost * intensity,
        title: config.title,
      };
      
      setDistractions(prev => [...prev, newDistraction]);
      setCurrentDistraction(newDistraction);
      
      // 降低專注力
      setFocusLevel(prev => Math.max(0, prev - 20));
      audioManager.playNotification();
      setActiveModal(true);
    }, [difficultyIntensity])
  );

  const dismissDistraction = useCallback(() => {
    setActiveModal(false);
    if (currentDistraction) {
      setDistractions(prev =>
        prev.map(d => d.id === currentDistraction.id
          ? { ...d, dismissedAt: Date.now() }
          : d
        )
      );
      // 恢復部分專注力
      setFocusLevel(prev => Math.min(100, prev + 15));
      setCurrentDistraction(null);
    }
  }, [currentDistraction]);

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleRequestCamera = useCallback(async () => {
    if (permissionState === 'requesting') {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('此裝置或瀏覽器不支援鏡頭串流。建議使用最新版本 Chrome 或 Safari。');
      setPermissionState('denied');
      return;
    }

    try {
      setPermissionState('requesting');
      setErrorMessage(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      setPermissionState('granted');
    } catch (error) {
      const message = error instanceof Error ? error.message : '授權失敗，請確認裝置已允許使用鏡頭。';
      setErrorMessage(message);
      setPermissionState('denied');
      stopStream();
    }
  }, [permissionState, stopStream]);

  const startSession = useCallback(() => {
    if (permissionState !== 'granted') {
      void handleRequestCamera();
      return;
    }

    setSessionState('running');
    setTimer(0);
    setCurrentTaskIndex(0);
    setDistractions([]);
    setFocusLevel(100);
    setIsFullscreen(true);
    setLogs([{ taskId: TASKS[0]?.id ?? 'unknown', startedAt: Date.now(), completedAt: null }]);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1;
        // 檢查是否超時
        if (newTime >= GAME_TIME_LIMIT) {
          setSessionState('failed');
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        return newTime;
      });
    }, 1000);
  }, [handleRequestCamera, permissionState]);

  const completeTask = useCallback(() => {
    const audioManager = getAudioManager();
    audioManager.playSuccess();
    
    // 恢復專注力
    setFocusLevel(prev => Math.min(100, prev + 25));
    
    setLogs((prev) => {
      const updated = [...prev];
      const index = updated.length - 1;
      if (updated[index] && updated[index].completedAt === null) {
        updated[index] = { ...updated[index], completedAt: Date.now() };
      }
      return updated;
    });

    setCurrentTaskIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= TASKS.length) {
        setSessionState('completed');
        setIsFullscreen(false);
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prev;
      }

      setLogs((prevLogs) => [
        ...prevLogs,
        {
          taskId: TASKS[nextIndex].id,
          startedAt: Date.now(),
          completedAt: null,
        },
      ]);

      return nextIndex;
    });
  }, []);

  const resetSession = useCallback(() => {
    setSessionState('idle');
    setTimer(0);
    setCurrentTaskIndex(0);
    setLogs([]);
    setDistractions([]);
    setErrorMessage(null);
    setIsFullscreen(false);
    setFocusLevel(100);
    setCurrentDistraction(null);
    stopStream();
    setPermissionState('idle');
  }, [stopStream]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  // 平台檢測
  useEffect(() => {
    const detector = getPlatformDetector();
    const info = detector.detect();
    setPlatform(info.platform);
    
    // 手機版自動啟用物體偵測
    if (info.platform === 'mobile') {
      setIsDetectionEnabled(true);
    }

    // 監聽窗口大小變化
    const handleResize = () => {
      const newInfo = detector.detect();
      setPlatform(newInfo.platform);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 物體偵測循環
  useEffect(() => {
    if (!isDetectionEnabled || !videoRef.current || sessionState !== 'running') {
      return;
    }

    const runDetection = async () => {
      try {
        const detector = getObjectDetector();
        await detector.initialize();

        const detectionIntervalId = window.setInterval(async () => {
          if (!videoRef.current) return;

          const result = await detector.detectObjects(videoRef.current);
          const currentTask = TASKS[currentTaskIndex];

          if (currentTask) {
            const taskId = currentTask.id as 'keys' | 'wallet' | 'phone';
            if (detector.checkForGameObject(result, taskId)) {
              setDetectedObject(taskId);
              // 自動完成任務
              completeTask();
            }
          }
        }, 500); // 每 500ms 檢測一次

        detectionIntervalRef.current = detectionIntervalId;
      } catch (error) {
        console.error('物體偵測錯誤:', error);
      }
    };

    runDetection();

    return () => {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isDetectionEnabled, sessionState, currentTaskIndex, completeTask]);

  const totalCompleted = logs.filter((log) => log.completedAt !== null).length;
  const totalDistractionCost = distractions
    .filter(d => d.dismissedAt !== null)
    .reduce((sum, d) => sum + d.cost, 0);

  const adjustedTime = Math.max(0, timer - totalDistractionCost);
  const focusPercentage = Math.max(0, focusLevel);

  return (
    <div className={`${isFullscreen && sessionState === 'running' ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-slate-950 text-slate-100`}>
      <div className={`${isFullscreen && sessionState === 'running' ? 'w-full h-full flex flex-col' : 'mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-12'}`}>
        <header className={`${isFullscreen && sessionState === 'running' ? 'hidden' : 'flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur'}`}>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <Link
              href="/focus-finder"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              <FaArrowLeft /> 返回體驗藍圖
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200">
              <FaCamera /> Prototype 1
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] md:items-start">
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Focus Finder Prototype 1</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                引入干擾模組，模擬 ADHD 者面對的認知負荷。體驗將在任務過程中隨機觸發中斷事件，測試專注力恢復能力。
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <FaExclamationTriangle className="mt-1 text-rose-400" />
                  模態干擾：隨機彈出任務提醒，要求立即處理
                </li>
                <li className="flex items-start gap-2">
                  <FaEyeSlash className="mt-1 text-indigo-400" />
                  視覺干擾：靜電、色彩失真等短暫視覺效果
                </li>
                <li className="flex items-start gap-2">
                  <FaVolumeUp className="mt-1 text-amber-400" />
                  聽覺干擾：環境噪音干擾（Prototype 1 階段預留）
                </li>
                <li className="flex items-start gap-2">
                  <FaHandPaper className="mt-1 text-fuchsia-400" />
                  衝動干擾：螢幕角落出現誘人圖示，點擊會增加時間懲罰
                </li>
              </ul>
            </div>
            <div className={`${isFullscreen && sessionState === 'running' ? 'hidden' : 'rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-300 shadow-xl'}`}>
              <h2 className="text-base font-semibold text-white">難度設定</h2>
              <div className="mt-4 space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={distractionSettings.enabled}
                    onChange={(e) => setDistractionSettings(prev => ({
                      ...prev,
                      enabled: e.target.checked
                    }))}
                    className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
                  />
                  <span>啟用干擾模組</span>
                </label>
                <div>
                  <label className="block text-xs font-medium mb-2">遊戲難度</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'normal', 'hard'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDistractionSettings(prev => ({
                          ...prev,
                          difficulty: level as 'easy' | 'normal' | 'hard'
                        }))}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          distractionSettings.difficulty === level
                            ? 'bg-blue-600 text-white border-2 border-blue-400'
                            : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {level === 'easy' && '簡單'}
                        {level === 'normal' && '普通'}
                        {level === 'hard' && '困難'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 p-3 rounded-2xl bg-slate-800/50">
                <p className="text-xs text-slate-400">
                  難度會影響干擾頻率與時間懲罰。實際 ADHD 體驗因人而異，此設定僅供參考。
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className={`${isFullscreen && sessionState === 'running' ? 'w-full h-full flex-1' : 'grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'}`}>
          <div className={`${isFullscreen && sessionState === 'running' ? 'w-full h-full flex flex-col' : 'flex flex-col gap-6'}`}>
            <div className={`${isFullscreen && sessionState === 'running' ? 'w-full h-full' : 'relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl'}`}>
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                {permissionState !== 'granted' && sessionState === 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center p-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaCamera className="text-6xl text-cyan-400" />
                    </motion.div>
                    <div className="max-w-md space-y-4">
                      <h3 className="text-3xl font-bold text-white">準備好了嗎？</h3>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        你將體驗 ADHD 者在高壓情境下的感受。
                        <br />
                        我們需要使用你的鏡頭來創建 AR 體驗。
                      </p>
                      <div className="flex flex-col gap-3 pt-4">
                        <button
                          onClick={handleRequestCamera}
                          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-105 hover:shadow-cyan-500/50"
                        >
                          <FaCamera className="text-2xl" />
                          啟用鏡頭開始
                        </button>
                        <p className="text-xs text-slate-500">
                          🔒 你的影像不會被儲存或上傳
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className={`${isFullscreen && sessionState === 'running' ? 'absolute inset-0' : 'relative h-[70vh] min-h-[400px]'} w-full`}>
                <div className="absolute inset-x-0 top-0 flex flex-col gap-3 p-4 text-xs font-semibold uppercase tracking-widest text-slate-200">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="rounded-full bg-slate-900/80 backdrop-blur px-3 py-1.5">{currentTask?.emoji} {currentTask?.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`rounded-full px-3 py-1.5 backdrop-blur ${
                        timer > GAME_TIME_LIMIT * 0.8 
                          ? 'bg-red-900/80 text-red-200 animate-pulse' 
                          : 'bg-slate-900/80'
                      }`}>
                        ⏱️ {formatSeconds(Math.max(0, GAME_TIME_LIMIT - timer))}
                      </span>
                    </div>
                  </div>
                  {/* 進度條和專注力 */}
                  {sessionState === 'running' && (
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(totalCompleted / TASKS.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">專注力</span>
                        <div className="flex-1 h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${
                              focusPercentage > 60 ? 'bg-emerald-500' :
                              focusPercentage > 30 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            animate={{ width: `${focusPercentage}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className="text-xs w-8 text-right">{Math.round(focusPercentage)}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {sessionState === 'running' && currentTask && (
                  <motion.div
                    key={currentTask.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-1/2 top-1/2 flex w-[min(90vw,480px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-3xl border-2 border-cyan-400/60 bg-gradient-to-br from-slate-950/95 to-slate-900/95 p-8 text-sm text-slate-100 shadow-[0_0_40px_rgba(34,211,238,0.4)] backdrop-blur-xl max-h-[70vh] overflow-y-auto"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{currentTask.emoji}</span>
                      <div>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                          <FaLocationArrow /> 任務目標
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">{currentTask.title}</h3>
                      </div>
                    </div>
                    <div className="border-t border-slate-700/50 pt-4">
                      {showHints && (
                        <p className="text-sm text-cyan-200 mb-3 font-semibold">💡 提示：{currentTask.hint}</p>
                      )}
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{currentTask.prompt}</p>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => completeTask()}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <FaCheck /> 標記已找到
                      </button>
                    </div>
                  </motion.div>
                )}

                {sessionState === 'completed' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/95 text-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <FaCheck className="text-6xl text-emerald-300" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">🎉 任務完成！</h3>
                    <div className="max-w-md space-y-3">
                      <div className="rounded-2xl bg-slate-800/50 p-4 border border-emerald-500/30">
                        <p className="text-lg font-semibold text-emerald-300">完成時間：{formatSeconds(adjustedTime)}</p>
                        <p className="text-sm text-slate-400 mt-1">找到 {TASKS.length} 個物品</p>
                      </div>
                      {distractionSettings.enabled && (
                        <div className="rounded-2xl bg-slate-800/50 p-4 border border-amber-500/30">
                          <p className="text-sm text-amber-300">處理了 {distractions.length} 次干擾事件</p>
                          <p className="text-sm text-slate-400 mt-1">時間懲罰：{totalDistractionCost.toFixed(1)}秒</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                      <button
                        type="button"
                        onClick={startSession}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
                      >
                        <FaRedo /> 再次挑戰
                      </button>
                      <button
                        type="button"
                        onClick={resetSession}
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-400"
                      >
                        重設體驗
                      </button>
                    </div>
                  </motion.div>
                )}

                {sessionState === 'failed' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/95 text-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <FaExclamationTriangle className="text-6xl text-red-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">⏰ 時間到！</h3>
                    <div className="max-w-md space-y-3">
                      <p className="text-slate-300">
                        你在 {GAME_TIME_LIMIT} 秒內只完成了 {totalCompleted}/{TASKS.length} 個任務。
                      </p>
                      {distractionSettings.enabled && (
                        <div className="rounded-2xl bg-slate-800/50 p-4 border border-red-500/30">
                          <p className="text-sm text-red-300">受到 {distractions.length} 次干擾影響</p>
                          <p className="text-sm text-slate-400 mt-1">這就是 ADHD 患者的日常挑戰</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                      <button
                        type="button"
                        onClick={startSession}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
                      >
                        <FaRedo /> 重新挑戰
                      </button>
                      <button
                        type="button"
                        onClick={resetSession}
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-400"
                      >
                        重設體驗
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

            {/* 側邊欄僅在非全螢幕時顯示 */}
            {!isFullscreen && sessionState !== 'running' && (
              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
                  <h2 className="text-lg font-semibold text-white">🎮 開始遊戲</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    點擊下方按鈕開始你的 ADHD 模擬體驗。遊戲將進入全螢幕模式。
                  </p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-200">
                    <button
                      type="button"
                      onClick={startSession}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                    >
                      <FaPlay /> {permissionState === 'granted' ? '重新開始' : '開始挑戰'}
                    </button>
                    {errorMessage && (
                      <p className="mt-2 rounded-2xl border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                {logs.length > 0 && (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
                    <h2 className="text-lg font-semibold text-white">📊 上次結果</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-200">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-widest text-slate-400">完成任務</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-400">
                      {totalCompleted}/{TASKS.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-widest text-slate-400">總時間</p>
                    <p className="mt-1 text-3xl font-bold text-sky-400">
                      {formatSeconds(adjustedTime)}
                    </p>
                  </div>
                </div>
              </div>
            )}
              <p className="mt-2 text-sm">
                與 MindAR 或 Three.js 整合，將虛擬物件固定於空間座標，讓「尋焦器」不再只是畫面疊層，而是真實世界的導引。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-widest text-amber-300/80">反思與分享</p>
              <p className="mt-2 text-sm">
                設計結束後的反思問答與分享介面，讓體驗者把心得轉化為對 ADHD 的理解與支持行動。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
