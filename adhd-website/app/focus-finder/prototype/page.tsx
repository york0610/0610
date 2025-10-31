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
  FaPlay,
} from 'react-icons/fa';
import { getAudioManager } from '@/app/utils/audioManager';
import { getObjectDetector } from '@/app/utils/objectDetection';
import { getPlatformDetector, type Platform } from '@/app/utils/platformDetector';
import FocusBar from '../../components/FocusBar';
import GameIntro from '../../components/GameIntroFixed';
import RabbitHoleEffect from '../../components/RabbitHoleEffect';
import WorkingMemoryFailure from '../../components/WorkingMemoryFailure';

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
  skipped?: boolean;
};

type DistractionEvent = {
  id: string;
  type: DistractionType;
  triggeredAt: number;
  dismissedAt: number | null;
  cost: number;
  title: string;
  objectToFind?: string; // 需要找到的物體
  description?: string; // 任務描述
};

type InterruptionTask = {
  type: DistractionType;
  title: string;
  description: string;
  objectToFind: string;
  cost: number;
  emoji: string;
  special?: 'rabbit-hole' | 'memory-failure'; // 特殊效果標記
};

// 情景干擾配置
// 強制中斷型干擾任務：必須先完成才能繼續主任務
const INTERRUPTION_TASKS: InterruptionTask[] = [
  { 
    type: 'environment' as DistractionType, 
    title: '💻 電腦沒關！', 
    description: '你忘記關電腦了，必須先去關掉它。這是 ADHD 最常見的情形——你總是忘記關掉設備', 
    objectToFind: 'laptop',
    cost: 3,
    emoji: '💻'
  },
  { 
    type: 'biological' as DistractionType, 
    title: '💧 口好渴！', 
    description: '你非常口渴，必須先去找水杯營水。你的身體在提醒你需要照顧自己', 
    objectToFind: 'cup',
    cost: 2,
    emoji: '☕'
  },
  { 
    type: 'psychological' as DistractionType, 
    title: '😔 心情不好了', 
    description: '你突然感到心情不好，想看看天空或窗戶外面來較泯。這是 ADHD 患者常見的逃避機制——你需要抵抗這個誘惑', 
    objectToFind: 'sky',
    cost: 1.5,
    emoji: '😔'
  },
  { 
    type: 'environment' as DistractionType, 
    title: '📄 找不到東西了', 
    description: '你找不到你要的東西，想要開門去外面找找。這是 ADHD 的典型表現：尋找一樣東西時會失去焦點', 
    objectToFind: 'door',
    cost: 2,
    emoji: '📄'
  },
  { 
    type: 'psychological' as DistractionType, 
    title: '📺 突然想看電視', 
    description: '你突然想起了你最喜歡的電視節目。這是 ADHD 的衝動控制不佳——你需要抵抗這個誘惑來完成任務', 
    objectToFind: 'tv',
    cost: 2.5,
    emoji: '📺'
  },
  { 
    type: 'environment' as DistractionType, 
    title: '👀 窗戶外面太漂亮', 
    description: '你不由主地看了一眼窗戶外面。你需要將鏡頭對準窗戶來抵抗誘惑。環境干擾是 ADHD 最大的敵人', 
    objectToFind: 'window',
    cost: 1.5,
    emoji: '👀'
  },
  {
    type: 'social' as DistractionType,
    title: '👥 有人在叫你',
    description: '你聽到有人在叫你，想要去看看發生了什麼。社交互動總是會打斷你的專注力',
    objectToFind: 'person',
    cost: 2,
    emoji: '👥'
  },
  {
    type: 'biological' as DistractionType,
    title: '😴 突然很疲勞',
    description: '你感到疲勞，想要找個地方休息。這是 ADHD 患者常見的低能量狀態',
    objectToFind: 'chair',
    cost: 2.5,
    emoji: '😴'
  },
  {
    type: 'environment' as DistractionType,
    title: '🎧 找不到耳機了！',
    description: '你忽然想起你的耳機不見了。你需要找到耳機才能繼續工作。這是典型的 ADHD 遺漏症狀——你總是找不到東西',
    objectToFind: 'monitor',
    cost: 2.5,
    emoji: '🎧'
  },
  {
    type: 'environment' as DistractionType,
    title: '🔑 鑰匙呢？',
    description: '你要出門，但找不到鑰匙。你開始翻箱倒櫃地尋找。這個搜尋過程讓你完全分心',
    objectToFind: 'door',
    cost: 3,
    emoji: '🔑'
  },
  {
    type: 'psychological' as DistractionType,
    title: '📱 手機通知響了！',
    description: '你的手機響了，可能是重要訊息...你忍不住想要查看。這是現代 ADHD 最大的陷阱——社交媒體的無底洞',
    objectToFind: 'phone',
    cost: 4,
    emoji: '📱',
    special: 'rabbit-hole' // 特殊標記，觸發兔子洞特效
  },
  {
    type: 'psychological' as DistractionType,
    title: '🧠 大腦當機了',
    description: '你的工作記憶突然失效，完全忘記了當前的任務。這是 ADHD 最典型的症狀之一',
    objectToFind: 'brain', // 虛擬物體，不需要實際偵測
    cost: 3,
    emoji: '🧠',
    special: 'memory-failure' // 特殊標記，觸發工作記憶失敗特效
  },
  {
    type: 'social' as DistractionType,
    title: '📞 朋友來電',
    description: '你的朋友突然打來電話。你想接電話聊天，但你還有工作要做。社交誘惑太強了',
    objectToFind: 'person',
    cost: 2,
    emoji: '📞'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🍕 肚子餓了',
    description: '你突然感到飢餓，想起冰箱裡有披薩。你的大腦開始想著食物，無法專注',
    objectToFind: 'bottle',
    cost: 2.5,
    emoji: '🍕'
  },
  {
    type: 'environment' as DistractionType,
    title: '🧹 房間太亂了',
    description: '你看著周圍的混亂，突然想要整理房間。這種衝動性的行為打斷了你的主要任務',
    objectToFind: 'desk',
    cost: 2,
    emoji: '🧹'
  },
  {
    type: 'psychological' as DistractionType,
    title: '💭 想起重要的事',
    description: '你突然想起你忘記做某件重要的事。焦慮感湧上心頭，你需要立即處理它',
    objectToFind: 'book',
    cost: 2.5,
    emoji: '💭'
  },
  {
    type: 'biological' as DistractionType,
    title: '🚽 急著上廁所',
    description: '你突然感到尿急。這種生理需求無法忽視，你必須先去解決',
    objectToFind: 'door',
    cost: 1.5,
    emoji: '🚽'
  },
  {
    type: 'social' as DistractionType,
    title: '💬 群組訊息爆炸',
    description: '你的手機不停震動，群組裡有人在狂洗訊息。你忍不住想看看發生了什麼',
    objectToFind: 'monitor',
    cost: 2,
    emoji: '💬'
  },
  {
    type: 'environment' as DistractionType,
    title: '🔊 噪音太吵',
    description: '樓下傳來很大的噪音。你無法集中注意力，想要去看看發生了什麼',
    objectToFind: 'window',
    cost: 2,
    emoji: '🔊'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🎮 遊戲的誘惑',
    description: '你想起了你最喜歡的遊戲。衝動控制不佳的大腦開始蠢蠢欲動',
    objectToFind: 'monitor',
    cost: 2.5,
    emoji: '🎮'
  },
  {
    type: 'biological' as DistractionType,
    title: '🤧 突然過敏',
    description: '你開始打噴嚏，眼睛發癢。過敏症狀讓你無法專注，你需要找到紙巾',
    objectToFind: 'desk',
    cost: 1.5,
    emoji: '🤧'
  },
];

type DistractionConfigType = DistractionType | 'timeout';

const DISTRACTION_CONFIG: Record<DistractionConfigType, { minDelay: number; maxDelay: number; duration: number; cost: number; title: string; objectToFind?: string }> = {
  environment: { minDelay: 8, maxDelay: 12, duration: 0, cost: 2, title: '☀️ 陽光太刺眼', objectToFind: 'window' },
  biological: { minDelay: 10, maxDelay: 15, duration: 0, cost: 2.5, title: '💧 口渴了，需要喝水', objectToFind: 'cup' },
  social: { minDelay: 9, maxDelay: 13, duration: 0, cost: 1.5, title: '👥 有人在叫你', objectToFind: 'person' },
  timeout: { minDelay: 0, maxDelay: 0, duration: 0, cost: 5, title: '⏱️ 時間到！' },
  psychological: { minDelay: 7, maxDelay: 11, duration: 0, cost: 1, title: '🤔 突然想到其他事', objectToFind: 'tv' },
};

// 遊戲時間限制（秒）
const GAME_TIME_LIMIT = 45; // 45 秒時間限制，增加遊戲難度

// 單個任務的超時時間（秒）
const TASK_TIMEOUT = 15; // 15 秒內找不到物體就自動跳過

// 遊戲故事背景
const GAME_STORY = `
你是一位 ADHD 患者，今天有很多重要的事要完成。
但你的大腦總是不聽使喚...

環境充滿干擾，你的注意力被不斷打斷。
有時候你能集中精力，有時候卻完全無法專注。

這個遊戲模擬你日常的挑戰：
• 環境干擾：外部事物的中斷
• 身體需求：口渴、疲勞等
• 社交壓力：他人的打擾
• 心理困擾：心情不好、衝動控制不佳

你能在時間內完成多少任務呢？
`;

// 遊戲故事章節 - 每個章節有不同的背景故事和任務
const STORY_CHAPTERS = [
  {
    title: '早上的困擾',
    description: '你剛起床，腦子還很混亂。你需要找到一些日常用品來開始新的一天。你感到疲勞，但必須準備好迎接新的挑戰。',
    tasks: ['cup', 'book', 'bottle'],
    narrative: '早上 7:30 AM - 你的鬧鐘響了，但你的大腦還沒完全清醒。你需要找到水杯、書籍和瓶子來準備早餐。'
  },
  {
    title: '工作中的挑戰',
    description: '現在是工作時間，但干擾不斷。你試著集中精力完成任務，但環境充滿了誘惑。',
    tasks: ['keyboard', 'laptop', 'monitor'],
    narrative: '上午 9:00 AM - 工作開始了。你需要找到鍵盤、電腦和螢幕。周圍的同事在走動，你很難保持專注。'
  },
  {
    title: '下午的崩潰',
    description: '下午時段，你的專注力開始下降。周圍的一切都變成了干擾。你感到疲勞和沮喪。',
    tasks: ['mouse', 'bottle', 'chair'],
    narrative: '下午 2:00 PM - 午餐後的低谷時段。你需要找到滑鼠、水瓶和椅子。你的能量在下降，很難集中注意力。'
  },
  {
    title: '傍晚的逃避',
    description: '你開始逃避，看著窗外或其他東西，試著放鬆。工作即將結束，但還有最後的衝刺。',
    tasks: ['desk', 'door', 'window'],
    narrative: '傍晚 5:00 PM - 工作日即將結束。你需要找到桌子、門和窗戶。你渴望離開辦公室，但還需要完成最後的任務。'
  },
  {
    title: '夜間的反思',
    description: '夜晚來臨，你回到家中。你需要整理一些東西，準備休息。',
    tasks: ['cup', 'chair', 'book'],
    narrative: '晚上 8:00 PM - 你回到家中。你需要找到杯子、椅子和書籍。你感到疲勞，但也有些放鬆。'
  },
  {
    title: '週末的自由',
    description: '週末終於來了！你有更多的自由時間，但也有更多的誘惑。',
    tasks: ['monitor', 'keyboard', 'bottle'],
    narrative: '週末 - 你有更多的時間來做你喜歡的事情。你需要找到螢幕、鍵盤和水瓶。但社交媒體和遊戲在呼喚你。'
  },
];

// 常見物品任務 - 容易在身邊找到
// 這些任務代表了 ADHD 患者需要完成的日常活動
const TASKS: Task[] = [
  { id: 'cup', title: '找到杯子', hint: '桌上或廚房', prompt: '將鏡頭對準你的水杯或馬克杯。', emoji: '☕', difficulty: 'easy' },
  { id: 'book', title: '找到書', hint: '桌上或書架', prompt: '將鏡頭對準任何一本書。', emoji: '📖', difficulty: 'easy' },
  { id: 'keyboard', title: '找到鍵盤', hint: '電腦桌上', prompt: '將鏡頭對準你的鍵盤。', emoji: '⌨️', difficulty: 'normal' },
  { id: 'bottle', title: '找到瓶子', hint: '桌上或包包裡', prompt: '將鏡頭對準任何瓶子。', emoji: '🧪', difficulty: 'easy' },
  { id: 'laptop', title: '找到電腦', hint: '桌上或包包裡', prompt: '將鏡頭對準你的筆記本電腦。', emoji: '💻', difficulty: 'normal' },
  { id: 'mouse', title: '找到滑鼠', hint: '電腦桌上', prompt: '將鏡頭對準你的滑鼠。', emoji: '🖱️', difficulty: 'normal' },
  { id: 'monitor', title: '找到螢幕', hint: '電腦前面', prompt: '將鏡頭對準你的電腦螢幕。', emoji: '🖥️', difficulty: 'easy' },
  { id: 'chair', title: '找到椅子', hint: '你坐著的地方', prompt: '將鏡頭對準你的椅子。', emoji: '🪑', difficulty: 'easy' },
  { id: 'desk', title: '找到桌子', hint: '你面前', prompt: '將鏡頭對準你的桌子。', emoji: '🛏️', difficulty: 'easy' },
  { id: 'door', title: '找到門', hint: '房間的出口', prompt: '將鏡頭對準任何一扇門。', emoji: '🚪', difficulty: 'easy' },
  { id: 'window', title: '找到窗戶', hint: '房間的牆上', prompt: '將鏡頭對準任何一扇窗戶。', emoji: '🪟', difficulty: 'easy' },
];

const formatSeconds = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// 隨機選擇任務序列
const getRandomTaskSequence = (): Task[] => {
  // 隨機選擇一個故事章節
  const randomChapter = STORY_CHAPTERS[Math.floor(Math.random() * STORY_CHAPTERS.length)];
  
  // 根據故事章節的任務 ID 獲取對應的任務物件
  const selectedTasks = randomChapter.tasks
    .map(taskId => TASKS.find(t => t.id === taskId))
    .filter((task): task is Task => task !== undefined);
  
  // 如果任務不足，補充隨機任務
  while (selectedTasks.length < 3) {
    const randomTask = TASKS[Math.floor(Math.random() * TASKS.length)];
    if (!selectedTasks.find(t => t.id === randomTask.id)) {
      selectedTasks.push(randomTask);
    }
  }
  
  return selectedTasks;
};

// 獲取當前故事章節
const getCurrentStoryChapter = (taskSequence: Task[]): typeof STORY_CHAPTERS[0] | null => {
  if (taskSequence.length === 0) return null;
  
  // 根據第一個任務找到對應的故事章節
  const firstTaskId = taskSequence[0].id;
  return STORY_CHAPTERS.find(chapter => chapter.tasks.includes(firstTaskId)) || null;
};

// Custom hook for distraction management
const useDistractions = (isActive: boolean, onDistractionTriggered: (type: DistractionType | 'timeout') => void) => {
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const activeDistractionsRef = useRef<Set<string>>(new Set());

  const triggerDistraction = useCallback(
    (type?: DistractionType | 'timeout') => {
    if (!type || activeDistractionsRef.current.has(type)) return;

    const config = DISTRACTION_CONFIG[type];
    if (!config) return;
    
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
            triggerDistraction(type);
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
    triggerDistraction('environment');
    triggerDistraction('biological');
    triggerDistraction('social');
    triggerDistraction('psychological');
  }, [isActive, triggerDistraction]);

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
}

export default function FocusFinderPrototype() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  // 平台和物體偵測狀態
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [isDetectionEnabled, setIsDetectionEnabled] = useState(true); // 預設啟用
  const [detectedObject, setDetectedObject] = useState<string | null>(null);
  const [detectionDebug, setDetectionDebug] = useState<string[]>([]);

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
  const [taskStartTime, setTaskStartTime] = useState<number | null>(null);
  const [skippedTasks, setSkippedTasks] = useState(0);
  const [taskTimeoutRef, setTaskTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(false);
  const [currentDistraction, setCurrentDistraction] = useState<DistractionEvent | null>(null);
  const [isDistractedTaskActive, setIsDistractedTaskActive] = useState(false); // 是否有干擾任務進行中
  const [randomTaskSequence, setRandomTaskSequence] = useState<Task[]>([]);
  const [currentStoryChapter, setCurrentStoryChapter] = useState<typeof STORY_CHAPTERS[0] | null>(null);
  const [showGameIntro, setShowGameIntro] = useState(false);
  const [showRabbitHole, setShowRabbitHole] = useState(false);
  const [showWorkingMemoryFailure, setShowWorkingMemoryFailure] = useState(false);
  const [forgottenTask, setForgottenTask] = useState<string>('');

  const difficultyIntensity = {
    easy: 0.5,
    normal: 1,
    hard: 1.5,
  }[distractionSettings.difficulty];

  const currentTask = randomTaskSequence[currentTaskIndex] ?? null;

  const { activeDistractions } = useDistractions(
    sessionState === 'running' && distractionSettings.enabled && !isDistractedTaskActive,
    useCallback((type: DistractionType | 'timeout') => {
      const audioManager = getAudioManager();
      const intensity = difficultyIntensity || 1;
      
      // 隨機選擇一個中斷任務
      // 如果是超時，使用特殊的干擾任務
      let interruptionTask;
      if (type === 'timeout') {
        interruptionTask = {
          type: 'psychological' as DistractionType,
          title: '⏰ 時間壓力！',
          description: '你花太長時間在這個任務上了，開始感到焦慮和沮喪。',
          objectToFind: 'sky',
          cost: 5,
        };
      } else {
        interruptionTask = INTERRUPTION_TASKS[Math.floor(Math.random() * INTERRUPTION_TASKS.length)];
      }
      const newDistraction: DistractionEvent = {
        id: `${type}-${Date.now()}`,
        type: interruptionTask.type,
        triggeredAt: Date.now(),
        dismissedAt: null,
        cost: interruptionTask.cost * intensity,
        title: interruptionTask.title,
        objectToFind: interruptionTask.objectToFind,
        description: interruptionTask.description,
      };
      
      // 檢查是否為特殊任務
      if (interruptionTask.special === 'rabbit-hole') {
        console.log('[DEBUG] Rabbit hole effect triggered!');
        setShowRabbitHole(true);
        // 兔子洞特效不需要物體偵測，直接等待用戶逃脫
      } else if (interruptionTask.special === 'memory-failure') {
        console.log('[DEBUG] Working memory failure triggered!');
        const currentTask = randomTaskSequence[currentTaskIndex];
        if (currentTask) {
          setForgottenTask(currentTask.title);
          setShowWorkingMemoryFailure(true);
        }
        // 工作記憶失敗不需要物體偵測，直接等待用戶恢復
      } else {
        // 設置干擾任務為活躍狀態
        setIsDistractedTaskActive(true);
      }

      console.log('[DEBUG] Interruption task triggered:', interruptionTask.title);

      setDistractions(prev => [...prev, newDistraction]);
      setCurrentDistraction(newDistraction);
      
      // 降低專注力
      setFocusLevel(prev => Math.max(0, prev - 20));
      audioManager.playNotification();
      audioManager.playDistractionTask(); // 添加干擾任務音
      
      // 觸發震動效果
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]); // 多次震動
      }
      
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
    console.log('[DEBUG] handleRequestCamera called, current state:', permissionState);
    
    if (permissionState === 'requesting') {
      console.log('[DEBUG] Already requesting, returning');
      return;
    }

    // 檢查瀏覽器支援
    console.log('[DEBUG] Checking browser support...');
    console.log('[DEBUG] navigator:', typeof navigator);
    console.log('[DEBUG] navigator.mediaDevices:', typeof navigator?.mediaDevices);
    console.log('[DEBUG] getUserMedia:', typeof navigator?.mediaDevices?.getUserMedia);
    
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      const errorMsg = '此裝置或瀏覽器不支援鏡頭串流。建議使用最新版本 Chrome 或 Safari。';
      console.error('[DEBUG] Browser not supported:', errorMsg);
      setErrorMessage(errorMsg);
      setPermissionState('denied');
      return;
    }

    try {
      setPermissionState('requesting');
      setErrorMessage(null);
      console.log('[DEBUG] Requesting camera access...');

      const constraints = {
        video: {
          facingMode: { exact: 'environment' }, // 強制使用後置鏡頭
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      console.log('[DEBUG] Constraints:', JSON.stringify(constraints));

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('[DEBUG] Camera stream obtained:', stream);
      console.log('[DEBUG] Stream active:', stream.active);
      console.log('[DEBUG] Video tracks:', stream.getVideoTracks().length);

      streamRef.current = stream;

      if (videoRef.current) {
        console.log('[DEBUG] Setting video srcObject');
        videoRef.current.srcObject = stream;
        console.log('[DEBUG] Video element updated with stream');
        
        // 確保視頻開始播放
        videoRef.current.onloadedmetadata = () => {
          console.log('[DEBUG] Video metadata loaded');
          console.log('[DEBUG] Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          videoRef.current?.play().then(() => {
            console.log('[DEBUG] Video playing successfully');
          }).catch(err => {
            console.error('[DEBUG] Video play error:', err);
            setErrorMessage('視頻播放失敗：' + err.message);
          });
        };
        
        videoRef.current.onerror = (e) => {
          console.error('[DEBUG] Video element error:', e);
          setErrorMessage('視頻元素錯誤');
        };
      } else {
        console.error('[DEBUG] videoRef.current is null!');
        setErrorMessage('視頻元素未初始化');
      }

      setPermissionState('granted');
      console.log('[DEBUG] Camera permission granted, state updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : '授權失敗，請確認裝置已允許使用鏡頭。';
      console.error('[DEBUG] Camera access error:', error);
      console.error('[DEBUG] Error name:', error instanceof Error ? error.name : 'unknown');
      console.error('[DEBUG] Error message:', message);
      setErrorMessage('鏡頭錯誤： ' + message);
      setPermissionState('denied');
      stopStream();
    }
  }, [permissionState, stopStream]);

  // 顯示遊戲介紹
  const showIntro = useCallback(() => {
    setShowGameIntro(true);
  }, []);

  // 跳過介紹直接開始遊戲
  const skipIntroAndStart = useCallback(() => {
    setShowGameIntro(false);
    startGameSession();
  }, []);

  // 實際開始遊戲會話
  const startGameSession = useCallback(async () => {
    console.log('[DEBUG] Starting session');
    console.log('[DEBUG] videoRef.current:', videoRef.current);
    console.log('[DEBUG] streamRef.current:', streamRef.current);
    console.log('[DEBUG] streamRef.current?.active:', streamRef.current?.active);
    const audioManager = getAudioManager();
    audioManager.playFocus();
    
    // 生成隨機任務序列
    const newTaskSequence = getRandomTaskSequence();
    const storyChapter = getCurrentStoryChapter(newTaskSequence);
    setRandomTaskSequence(newTaskSequence);
    setCurrentStoryChapter(storyChapter);
    
    setSessionState('running');
    setCurrentTaskIndex(0);
    setTimer(0);
    setFocusLevel(100);
    setDistractions([]);
    setCurrentDistraction(null);
    setIsDistractedTaskActive(false);
    setDetectedObject(null);
    setLogs([{ taskId: newTaskSequence[0]?.id || TASKS[0].id, startedAt: Date.now(), completedAt: null }]);
    setShowHints(false);
    setSkippedTasks(0);
    
    // 進入全屏模式
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('無法進入全屏:', err);
      });
    }
    setIsFullscreen(true);
    
    // 記錄任務開始時間
    setTaskStartTime(Date.now());
    
    // 啟動計時器
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1;
        if (newTime >= GAME_TIME_LIMIT) {
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setSessionState('failed');
          setIsFullscreen(false);
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          return GAME_TIME_LIMIT;
        }
        return newTime;
      });
    }, 1000);
  }, []);

  // 主要的開始遊戲函數 (顯示介紹)
  const startSession = useCallback(() => {
    showIntro();
  }, [showIntro]);

  const completeInterruptionTask = useCallback(() => {
    console.log('[DEBUG] Completing interruption task');
    const audioManager = getAudioManager();
    audioManager.playSuccess();
    audioManager.playDetection(); // 添加物體偵測音
    
    // 解除干擾任務鎖定
    setIsDistractedTaskActive(false);
    
    // 標記干擾任務為已完成
    if (currentDistraction) {
      setDistractions(prev => 
        prev.map(d => 
          d.id === currentDistraction.id 
            ? { ...d, dismissedAt: Date.now() } 
            : d
        )
      );
      setCurrentDistraction(null);
    }
    
    // 恢複一些專注力
    setFocusLevel(prev => Math.min(100, prev + 15));
    console.log('[DEBUG] Interruption task completed, resuming main task');
  }, [currentDistraction]);

  // 處理兔子洞逃脫
  const escapeRabbitHole = useCallback(() => {
    console.log('[DEBUG] Escaping rabbit hole');
    const audioManager = getAudioManager();
    audioManager.playSuccess();

    setShowRabbitHole(false);

    // 標記干擾任務為已完成
    if (currentDistraction) {
      setDistractions(prev =>
        prev.map(d =>
          d.id === currentDistraction.id
            ? { ...d, dismissedAt: Date.now() }
            : d
        )
      );
      setCurrentDistraction(null);
    }

    // 恢復一些專注力（但比正常完成任務少一些，因為被分心了）
    setFocusLevel(prev => Math.min(100, prev + 10));
    console.log('[DEBUG] Escaped from rabbit hole, resuming main task');
  }, [currentDistraction]);

  // 處理工作記憶恢復
  const recoverWorkingMemory = useCallback(() => {
    console.log('[DEBUG] Recovering working memory');
    const audioManager = getAudioManager();
    audioManager.playSuccess();

    setShowWorkingMemoryFailure(false);
    setForgottenTask('');

    // 標記干擾任務為已完成
    if (currentDistraction) {
      setDistractions(prev =>
        prev.map(d =>
          d.id === currentDistraction.id
            ? { ...d, dismissedAt: Date.now() }
            : d
        )
      );
      setCurrentDistraction(null);
    }

    // 恢復一些專注力（但比正常完成任務少，因為記憶中斷很消耗精力）
    setFocusLevel(prev => Math.min(100, prev + 5));
    console.log('[DEBUG] Working memory recovered, resuming main task');
  }, [currentDistraction]);

  const skipCurrentTask = useCallback(() => {
    console.log('[DEBUG] Skipping current task');
    setSkippedTasks(prev => prev + 1);
    setFocusLevel(prev => Math.max(0, prev - 15)); // 扣分
    
    // 觸發震動效果
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]); // 震動模式
    }
    
    setLogs((prev) => {
      const updated = [...prev];
      const index = updated.length - 1;
      if (updated[index] && updated[index].completedAt === null) {
        updated[index] = { ...updated[index], completedAt: Date.now(), skipped: true };
      }
      return updated;
    });

    setCurrentTaskIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= randomTaskSequence.length) {
        setSessionState('completed');
        setIsFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prev;
      }

      setLogs((prevLogs) => [
        ...prevLogs,
        {
          taskId: randomTaskSequence[nextIndex]?.id || TASKS[0].id,
          startedAt: Date.now(),
          completedAt: null,
        },
      ]);
      
      // 重置任務開始時間
      setTaskStartTime(Date.now());
      
      // 清除之前的超時計時器
      if (taskTimeoutRef) {
        clearTimeout(taskTimeoutRef);
      }
      
      // 設置新的超時計時器
      const timeout = setTimeout(() => {
        console.log('[DEBUG] Task timeout - skipping task');
        const audioMgr = getAudioManager();
        audioMgr.playError();
        skipCurrentTask();
      }, TASK_TIMEOUT * 1000);
      setTaskTimeoutRef(timeout);

      return nextIndex;
    });
  }, [taskTimeoutRef]);

  const completeTask = useCallback(() => {
    const audioManager = getAudioManager();
    audioManager.playSuccess();
    audioManager.playDetection(); // 添加物體偵測音
    
    // 清除超時計時器
    if (taskTimeoutRef) {
      clearTimeout(taskTimeoutRef);
      setTaskTimeoutRef(null);
    }
    
    // 恢複專注力
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
      if (nextIndex >= randomTaskSequence.length) {
        const audioMgr = getAudioManager();
        audioMgr.playVictory(); // 添加勝利音
        setSessionState('completed');
        setIsFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prev;
      }

      setLogs((prevLogs) => [
        ...prevLogs,
        {
          taskId: randomTaskSequence[nextIndex]?.id || TASKS[0].id,
          startedAt: Date.now(),
          completedAt: null,
        },
      ]);
      
      // 重置任務開始時間
      setTaskStartTime(Date.now());
      
      // 顯示故事
      const storyIndex = Math.floor(nextIndex / 3); // 每 3 個任務顯示一個故事
      if (storyIndex < STORY_CHAPTERS.length && storyIndex !== currentStoryIndex) {
        setCurrentStoryIndex(storyIndex);
        setShowStoryModal(true);
      }
      
      // 設置新的超時計時器
      const timeout = setTimeout(() => {
        console.log('[DEBUG] Task timeout - skipping task');
        const audioMgr = getAudioManager();
        audioMgr.playError();
        skipCurrentTask();
      }, TASK_TIMEOUT * 1000);
      setTaskTimeoutRef(timeout);

      return nextIndex;
    });
  }, [taskTimeoutRef, skipCurrentTask, randomTaskSequence]);

  const resetSession = useCallback(() => {
    console.log('[DEBUG] Resetting session');
    setSessionState('idle');
    setCurrentTaskIndex(0);
    setTimer(0);
    setFocusLevel(100);
    setDistractions([]);
    setCurrentDistraction(null);
    setIsDistractedTaskActive(false);
    setDetectedObject(null);
    setLogs([]);
    setShowHints(false);
    setSkippedTasks(0);
    setRandomTaskSequence([]);
    setCurrentStoryChapter(null);
    setIsFullscreen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (taskTimeoutRef) {
      clearTimeout(taskTimeoutRef);
      setTaskTimeoutRef(null);
    }
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

    console.log('[DEBUG] 平台檢測:', info);

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
        console.log('[DEBUG] 物體偵測器已初始化');

        const detectionIntervalId = window.setInterval(async () => {
          if (!videoRef.current) return;

          try {
            const result = await detector.detectObjects(videoRef.current);
            const currentTask = randomTaskSequence[currentTaskIndex];
            const currentDist = currentDistraction;

            // 優先檢查干擾任務
            if (isDistractedTaskActive && currentDist?.objectToFind) {
              if (detector.checkForGameObject(result, currentDist.objectToFind)) {
                setDetectedObject(currentDist.objectToFind);
                console.log(`[DEBUG] 偵測到干擾任務物體: ${currentDist.objectToFind}`);
                // 自動完成干擾任務
                setTimeout(() => completeInterruptionTask(), 500);
              }
            }
            // 檢查主任務
            else if (currentTask && result.objects.length > 0) {
              if (detector.checkForGameObject(result, currentTask.id)) {
                setDetectedObject(currentTask.id);
                console.log(`[DEBUG] 偵測到任務物體: ${currentTask.id}`);
                // 自動完成任務
                setTimeout(() => completeTask(), 500);
              }
            }
          } catch (detectionError) {
            console.error('[DEBUG] 單次偵測失敗:', detectionError);
          }
        }, 500); // 每 500ms 檢測一次

        detectionIntervalRef.current = detectionIntervalId;
      } catch (error) {
        console.error('[DEBUG] 物體偵測初始化錯誤:', error);
        setErrorMessage('物體偵測初始化失敗，請重新開始');
      }
    };

    runDetection();

    return () => {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isDetectionEnabled, sessionState, currentTaskIndex, isDistractedTaskActive, currentDistraction, completeTask, completeInterruptionTask, randomTaskSequence]);

  const totalCompleted = logs.filter((log) => log.completedAt !== null).length;
  const totalDistractionCost = distractions
    .filter(d => d.dismissedAt !== null)
    .reduce((sum, d) => sum + d.cost, 0);

  const adjustedTime = Math.max(0, timer - totalDistractionCost);
  const focusPercentage = Math.max(0, focusLevel);

  return (
    <div className={`${isFullscreen && sessionState === 'running' ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-slate-950 text-slate-100`}>
      {/* 新的專注力條 - 只在遊戲運行時顯示 */}
      <FocusBar
        focusLevel={focusLevel}
        isVisible={sessionState === 'running'}
        onCriticalLevel={() => {
          // 當專注力過低時的回調
          const audioManager = getAudioManager();
          audioManager.playError();
          if (navigator.vibrate) {
            navigator.vibrate([300, 100, 300, 100, 300]);
          }
        }}
      />

      {/* 兔子洞特效 */}
      <RabbitHoleEffect
        isActive={showRabbitHole}
        onEscape={escapeRabbitHole}
        duration={8000}
        intensity="high"
      />

      {/* 工作記憶失敗特效 */}
      <WorkingMemoryFailure
        isActive={showWorkingMemoryFailure}
        originalTask={forgottenTask}
        onRecover={recoverWorkingMemory}
        duration={6000}
      />

      {/* 遊戲介紹 */}
      <GameIntro
        isVisible={showGameIntro}
        onStart={() => {
          setShowGameIntro(false);
          startGameSession();
        }}
        onSkip={() => {
          setShowGameIntro(false);
          startGameSession();
        }}
      />
      <div className={`${isFullscreen && sessionState === 'running' ? 'w-full h-full flex-1' : 'grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'}`}>
        <div className={`${isFullscreen && sessionState === 'running' ? 'w-full h-full flex flex-col' : 'flex flex-col gap-6'}`}>
          <div className={`${isFullscreen && sessionState === 'running' ? 'w-full h-full' : 'relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl'}`}>
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
                autoPlay
                onError={(e) => {
                  console.error('Video element error:', e);
                  setErrorMessage('視頻播放錯誤，請重新嘗試');
                }}
              />
              {permissionState !== 'granted' && sessionState === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center p-8 z-50"
                  style={{ pointerEvents: 'auto' }}
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
                      你將體驗 ADHD 者在體壓情境下的感受。
                      <br />
                      我們需要使用你的鏡頭來創建 AR 體驗。
                    </p>
                    {errorMessage && (
                      <div className="rounded-lg bg-red-900/50 border border-red-700 p-3 text-sm text-red-200">
                        ⚠️ {errorMessage}
                      </div>
                    )}
                    <div className="flex flex-col gap-3 pt-4">
                      <button
                        onClick={(e) => {
                          console.log('[DEBUG] Camera button clicked!');
                          console.log('[DEBUG] Event:', e);
                          console.log('[DEBUG] Current permissionState:', permissionState);
                          handleRequestCamera();
                        }}
                        disabled={permissionState === 'requesting'}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-105 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative z-50"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <FaCamera className="text-2xl" />
                        {permissionState === 'requesting' ? '請求中...' : '啟用鏡頭開始'}
                      </button>
                      <p className="text-xs text-slate-500">
                        🔒 你的影像不會被儲存或上傳
                      </p>
                    </div>
                  </div>
                </motion.div>
                )}
              {permissionState === 'granted' && sessionState === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950/80 via-slate-900/80 to-slate-950/80 text-center p-8 z-50"
                  style={{ pointerEvents: 'auto' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaPlay className="text-6xl text-emerald-400" />
                  </motion.div>
                  <div className="max-w-md space-y-4">
                    <h3 className="text-3xl font-bold text-white">鏡頭已就緒</h3>
                    <p className="text-lg text-slate-300 leading-relaxed">
                      您的鏡頭已成功連接。
                      <br />
                      物體偵測已準備就緒，點擊下方按鈕開始挑戰吧！
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                      <button
                        onClick={startSession}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-105 hover:shadow-emerald-500/50"
                      >
                        <FaPlay className="text-2xl" />
                        開始遊戲
                      </button>
                      <p className="text-xs text-slate-500">
                        ⏱️ 時間限制：{GAME_TIME_LIMIT} 秒完成所有任務 | 每個任務 {TASK_TIMEOUT} 秒
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
                  {/* 任務進度條 */}
                  {sessionState === 'running' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">任務進度</span>
                        <div className="flex-1 h-2 bg-slate-800/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${randomTaskSequence.length > 0 ? (totalCompleted / randomTaskSequence.length) * 100 : 0}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs w-12 text-right">
                          {totalCompleted}/{randomTaskSequence.length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 干擾任務卡片：強制中斷 */}
                {sessionState === 'running' && isDistractedTaskActive && currentDistraction && (
                  <motion.div
                    key={currentDistraction.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed left-1/2 top-1/2 flex w-[min(95vw,500px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border-2 border-red-500/80 bg-gradient-to-br from-red-950/95 to-orange-950/95 p-3 sm:p-6 text-xs sm:text-sm text-slate-100 shadow-[0_0_60px_rgba(239,68,68,0.6)] backdrop-blur-xl max-h-[70vh] overflow-y-auto z-50"
                  >
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.span 
                        className="text-xl sm:text-2xl flex-shrink-0"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        ⚠️
                      </motion.span>
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-red-300 line-clamp-1">
                          <FaExclamationTriangle className="flex-shrink-0" /> 中斷
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 line-clamp-2">{currentDistraction.title}</h3>
                      </div>
                    </div>
                    <div className="border-t border-red-700/50 pt-2 sm:pt-3 flex-shrink-0">
                      <p className="text-xs text-red-200 mb-2 font-semibold line-clamp-2">🚨 {currentDistraction.description}</p>
                      <div className="rounded-lg bg-slate-900/50 border border-red-500/30 p-2">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          對準 <span className="font-bold text-red-300">{currentDistraction.objectToFind}</span>
                        </p>
                      </div>
                    </div>
                    {currentDistraction?.objectToFind && (
                      <div className="flex gap-2 pt-2 flex-shrink-0">
                        {detectedObject === currentDistraction.objectToFind ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex gap-2 bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-2"
                          >
                            <div className="flex items-center gap-2 text-emerald-300 flex-1 min-w-0">
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="flex-shrink-0">
                                <FaCheck className="text-sm" />
                              </motion.div>
                              <span className="font-semibold text-xs truncate">✓ 完成</span>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex-1 flex gap-2 bg-red-900/30 border border-red-500/50 rounded-lg p-2">
                            <div className="flex items-center gap-2 text-red-300 flex-1 min-w-0 text-xs">
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="flex-shrink-0">
                                <FaCamera className="text-sm" />
                              </motion.div>
                              <span className="truncate">🔍 掃描中</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* 主任務卡片 */}
                {sessionState === 'running' && currentTask && (
                  <motion.div
                    key={currentTask.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isDistractedTaskActive ? 0.3 : 1, 
                      y: 0,
                      scale: isDistractedTaskActive ? 0.95 : 1
                    }}
                    className="fixed left-1/2 top-1/2 flex w-[min(95vw,500px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border-2 border-cyan-400/60 bg-gradient-to-br from-slate-950/95 to-slate-900/95 p-3 sm:p-6 text-xs sm:text-sm text-slate-100 shadow-[0_0_40px_rgba(34,211,238,0.4)] backdrop-blur-xl max-h-[70vh] overflow-y-auto z-40"
                    style={{ pointerEvents: isDistractedTaskActive ? 'none' : 'auto' }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-xl sm:text-2xl flex-shrink-0">{currentTask.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-cyan-300 line-clamp-1">
                          <FaLocationArrow className="flex-shrink-0" /> 任務
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 line-clamp-2">{currentTask.title}</h3>
                      </div>
                    </div>
                    <div className="border-t border-slate-700/50 pt-2 sm:pt-3 flex-shrink-0">
                      {showHints && (
                        <p className="text-xs text-cyan-200 mb-1 sm:mb-2 font-semibold line-clamp-1">💡 {currentTask.hint}</p>
                      )}
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{currentTask.prompt}</p>
                    </div>
                    {detectedObject === currentTask.id ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-2 pt-2 sm:pt-3 bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-2 flex-shrink-0"
                      >
                        <div className="flex items-center gap-2 text-emerald-300 flex-1 min-w-0">
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="flex-shrink-0">
                            <FaCheck className="text-sm sm:text-base" />
                          </motion.div>
                          <span className="font-semibold text-xs truncate">✓ 完成中...</span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex gap-2 pt-2 sm:pt-3 bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 flex-shrink-0">
                        <div className="flex items-center gap-2 text-slate-400 flex-1 min-w-0 text-xs">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="flex-shrink-0">
                            <FaCamera className="text-sm sm:text-base" />
                          </motion.div>
                          <span className="truncate">🔍 掃描中</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 故事模態 */}
                <AnimatePresence>
                  {showStoryModal && currentStoryIndex < STORY_CHAPTERS.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
                      >
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-2">
                              {STORY_CHAPTERS[currentStoryIndex].title}
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                              {STORY_CHAPTERS[currentStoryIndex].description}
                            </p>
                          </div>
                          <div className="border-t border-slate-700 pt-4">
                            <p className="text-xs text-slate-400 mb-3">接下來的任務：</p>
                            <div className="flex gap-2 flex-wrap">
                              {STORY_CHAPTERS[currentStoryIndex].tasks.map((task, idx) => {
                                const taskObj = TASKS.find(t => t.id === task);
                                return (
                                  <div key={idx} className="bg-slate-700/50 rounded-lg px-3 py-2 text-xs">
                                    <span className="text-amber-300">{taskObj?.emoji}</span> {taskObj?.title}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <button
                            onClick={() => setShowStoryModal(false)}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg transition mt-4"
                          >
                            開始任務 →
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        {sessionState === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/95 text-center p-6 z-50"
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
                        <p className="text-sm text-slate-400 mt-1">找到 {randomTaskSequence.length - skippedTasks}/{randomTaskSequence.length} 個物品</p>
                      </div>
                      {skippedTasks > 0 && (
                        <div className="rounded-2xl bg-slate-800/50 p-4 border border-red-500/30">
                          <p className="text-sm text-red-300">跳過的任務：{skippedTasks} 個</p>
                          <p className="text-sm text-slate-400 mt-1">（找不到物體或超時）</p>
                        </div>
                      )}
                      {distractionSettings.enabled && (
                        <div className="rounded-2xl bg-slate-800/50 p-4 border border-amber-500/30">
                          <p className="text-sm text-amber-300">處理了 {distractions.length} 次干擾事件</p>
                          <p className="text-sm text-slate-400 mt-1">時間懲罰：{totalDistractionCost.toFixed(1)}秒</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <button
                        type="button"
                        onClick={startSession}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition hover:scale-105"
                      >
                        <FaRedo /> 再次挑戰
                      </button>
                      <button
                        type="button"
                        onClick={resetSession}
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-600 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-slate-200 transition hover:border-slate-400"
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
                    className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/95 text-center p-6 z-50"
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
                        你在 {GAME_TIME_LIMIT} 秒內完成了 {totalCompleted}/{randomTaskSequence.length} 個任務。
                      </p>
                      {skippedTasks > 0 && (
                        <p className="text-red-300 text-sm">
                          跳過了 {skippedTasks} 個任務（找不到物體或超時）
                        </p>
                      )}
                      <p className="text-amber-300 text-sm">
                        這就是 ADHD 患者每天面對的挑戰：時間壓力、注意力分散、不斷的干擾...
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
                      {totalCompleted}/{randomTaskSequence.length}
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
          </div>
        )}
      </div>
      <ModalDistraction
        isVisible={activeModal}
        onDismiss={dismissDistraction}
      />
    </div>
  );
}