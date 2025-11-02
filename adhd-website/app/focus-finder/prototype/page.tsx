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
import AudioSettings from '../../components/AudioSettings';
import DeathAnimation from '../../components/DeathAnimation';
import GameResultsScreen from '../../components/GameResultsScreen';
import ParticleEffects, { ScreenShake, BlurOverlay, PulseEffect, DetectionSuccess } from '../../components/ParticleEffects';

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

// 情景干擾配置 - 擴展版本
// 強制中斷型干擾任務：必須先完成才能繼續主任務
const INTERRUPTION_TASKS: InterruptionTask[] = [
  // 環境干擾
  {
    type: 'environment' as DistractionType,
    title: '💻 電腦沒關！',
    description: '你忘記關電腦了，必須先去關掉它。這是 ADHD 最常見的情形——你總是忘記關掉設備',
    objectToFind: 'laptop',
    cost: 3,
    emoji: '💻'
  },
  {
    type: 'environment' as DistractionType,
    title: '📱 手機響了！',
    description: '你的手機突然響起，雖然可能不重要，但你無法忽視它。ADHD 患者很難過濾不重要的刺激',
    objectToFind: 'cell phone',
    cost: 2.5,
    emoji: '📱'
  },
  {
    type: 'environment' as DistractionType,
    title: '🔑 鑰匙在哪？',
    description: '你突然想起等等要出門，開始擔心鑰匙放在哪裡。這種「預期焦慮」是 ADHD 的典型症狀',
    objectToFind: 'keys',
    cost: 2,
    emoji: '🔑'
  },
  {
    type: 'environment' as DistractionType,
    title: '📄 桌子好亂！',
    description: '你的桌子太亂了，必須先整理一下才能專心。但整理往往會讓你更分心...',
    objectToFind: 'book',
    cost: 3.5,
    emoji: '📚'
  },

  // 生理干擾
  {
    type: 'biological' as DistractionType,
    title: '💧 口好渴！',
    description: '你非常口渴，必須先去找水杯喝水。你的身體在提醒你需要照顧自己',
    objectToFind: 'cup',
    cost: 2,
    emoji: '☕'
  },
  {
    type: 'biological' as DistractionType,
    title: '🍎 肚子餓了',
    description: '你的血糖下降，開始感到飢餓。ADHD 患者對血糖變化特別敏感，這會影響專注力',
    objectToFind: 'apple',
    cost: 2.5,
    emoji: '🍎'
  },
  {
    type: 'biological' as DistractionType,
    title: '😴 好想睡覺',
    description: '你感到疲勞，想要躺下休息一下。ADHD 患者常有睡眠問題，白天容易疲勞',
    objectToFind: 'bed',
    cost: 4,
    emoji: '🛏️'
  },

  // 心理干擾
  {
    type: 'psychological' as DistractionType,
    title: '😔 心情不好了',
    description: '你突然感到心情不好，想看看天空或窗戶外面來舒緩。這是 ADHD 患者常見的情緒調節需求',
    objectToFind: 'sky',
    cost: 1.5,
    emoji: '😔'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🤔 想起別的事',
    description: '你突然想起另一件重要的事情，覺得應該先處理。ADHD 的「工作記憶」常常被新想法打斷',
    objectToFind: 'door',
    cost: 3,
    emoji: '🚪'
  },
  {
    type: 'psychological' as DistractionType,
    title: '😰 開始焦慮',
    description: '你開始擔心這個任務做不完，焦慮感讓你更難專心。這是 ADHD 常見的惡性循環',
    objectToFind: 'clock',
    cost: 2.5,
    emoji: '⏰'
  },

  // 社交干擾
  {
    type: 'social' as DistractionType,
    title: '👥 想起朋友',
    description: '你突然想起要回覆朋友的訊息，覺得不回覆很不禮貌。社交焦慮是 ADHD 的常見共病',
    objectToFind: 'person',
    cost: 3,
    emoji: '👤'
  },
  {
    type: 'social' as DistractionType,
    title: '📺 電視聲音',
    description: '隔壁房間傳來電視聲音，你無法忽視。ADHD 患者對聲音刺激特別敏感',
    objectToFind: 'tv',
    cost: 2,
    emoji: '📺'
  },

  // 特殊干擾任務 - 兔子洞效應
  {
    type: 'social' as DistractionType,
    title: '🕳️ 社交媒體兔子洞',
    description: '你想要「快速」檢查一下社交媒體，結果掉進了無止境的滑動循環...',
    objectToFind: 'rabbit-hole',
    cost: 5,
    emoji: '🕳️',
    special: 'rabbit-hole'
  },

  // 特殊干擾任務 - 工作記憶失敗
  {
    type: 'psychological' as DistractionType,
    title: '🧠 工作記憶失敗',
    description: '你完全忘記了剛才在做什麼...大腦一片空白，需要重新回想',
    objectToFind: 'memory-failure',
    cost: 4,
    emoji: '🧠',
    special: 'memory-failure'
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

  // 更多社交媒體和數位干擾任務
  {
    type: 'social' as DistractionType,
    title: '📱 Instagram 通知',
    description: '你的手機響了，可能是 Instagram 的通知。你忍不住想要查看...',
    objectToFind: 'rabbit-hole',
    cost: 5,
    emoji: '📱',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '💬 LINE 訊息來了',
    description: '朋友傳了訊息給你，你想要立刻回覆...',
    objectToFind: 'rabbit-hole',
    cost: 4,
    emoji: '💬',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '🎵 TikTok 短影片',
    description: '你突然想起昨天看到的有趣短影片，想要再看一遍...',
    objectToFind: 'rabbit-hole',
    cost: 6,
    emoji: '🎵',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '📺 YouTube 推薦',
    description: '你想起 YouTube 可能有新的推薦影片，只是看一下而已...',
    objectToFind: 'rabbit-hole',
    cost: 5,
    emoji: '📺',
    special: 'rabbit-hole'
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

  // 新增：細節強迫症干擾
  {
    type: 'environment' as DistractionType,
    title: '⌨️ 鍵盤有灰塵！',
    description: '你注意到鍵盤縫隙裡有灰塵，必須先清理乾淨才能繼續工作。ADHD 患者常被小細節困住',
    objectToFind: 'keyboard',
    cost: 3.5,
    emoji: '⌨️'
  },
  {
    type: 'environment' as DistractionType,
    title: '📚 書籍過期了',
    description: '你發現桌上的書已經過期要還了，開始擔心圖書館罰款。這種「未完成任務」會一直困擾你',
    objectToFind: 'book',
    cost: 4,
    emoji: '📚'
  },
  {
    type: 'environment' as DistractionType,
    title: '🖱️ 滑鼠不順',
    description: '滑鼠移動不順暢，你覺得必須先清理滑鼠墊。這種完美主義傾向會打斷工作流程',
    objectToFind: 'mouse',
    cost: 2.5,
    emoji: '🖱️'
  },
  {
    type: 'environment' as DistractionType,
    title: '💡 燈光太暗了',
    description: '你覺得燈光不夠亮，影響工作效率。必須先調整照明才能繼續',
    objectToFind: 'window',
    cost: 2,
    emoji: '💡'
  },
  {
    type: 'environment' as DistractionType,
    title: '🖥️ 螢幕太髒了',
    description: '螢幕上有指紋和灰塵，你覺得必須先擦乾淨。這種完美主義會無限延遲工作',
    objectToFind: 'monitor',
    cost: 3,
    emoji: '🖥️'
  },

  // 新增：時間焦慮干擾
  {
    type: 'psychological' as DistractionType,
    title: '⏰ 時間不夠用',
    description: '你開始計算剩餘時間，越算越焦慮。時間感知困難是 ADHD 的核心症狀',
    objectToFind: 'clock',
    cost: 3.5,
    emoji: '⏰'
  },
  {
    type: 'psychological' as DistractionType,
    title: '📅 忘記約會了嗎？',
    description: '你突然想起可能有約會忘記了，開始檢查行事曆。這種「可能遺漏」的焦慮很常見',
    objectToFind: 'cell phone',
    cost: 4,
    emoji: '📅'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🎯 目標太遙遠',
    description: '你開始質疑這個任務的意義，感到目標太遙遠。ADHD 患者需要立即的成就感',
    objectToFind: 'sky',
    cost: 3,
    emoji: '🎯'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🔄 想要重新開始',
    description: '你覺得之前做錯了，想要全部重新開始。這種完美主義會導致無限循環',
    objectToFind: 'door',
    cost: 4.5,
    emoji: '🔄'
  },

  // 新增：身體不適干擾
  {
    type: 'biological' as DistractionType,
    title: '🦵 腿麻了',
    description: '你坐太久腿麻了，需要起來走動。ADHD 患者很難長時間保持同一姿勢',
    objectToFind: 'chair',
    cost: 2,
    emoji: '🦵'
  },
  {
    type: 'biological' as DistractionType,
    title: '👁️ 眼睛乾澀',
    description: '長時間盯著螢幕讓眼睛很乾澀，你需要休息一下眼睛',
    objectToFind: 'monitor',
    cost: 2.5,
    emoji: '👁️'
  },
  {
    type: 'biological' as DistractionType,
    title: '🤧 鼻子癢',
    description: '鼻子突然很癢，可能是過敏。這種身體不適會持續干擾注意力',
    objectToFind: 'window',
    cost: 1.5,
    emoji: '🤧'
  },
  {
    type: 'biological' as DistractionType,
    title: '🥤 想喝咖啡',
    description: '你覺得需要咖啡因來提神，但去泡咖啡又會打斷工作節奏',
    objectToFind: 'cup',
    cost: 3,
    emoji: '☕'
  },
  {
    type: 'biological' as DistractionType,
    title: '🍫 想吃零食',
    description: '你突然很想吃甜食，血糖可能下降了。但找零食會讓你完全分心',
    objectToFind: 'apple',
    cost: 2.5,
    emoji: '🍫'
  },

  // 新增：創意干擾
  {
    type: 'psychological' as DistractionType,
    title: '💡 突然有靈感',
    description: '你突然想到一個很棒的點子，覺得必須立刻記錄下來。創意爆發常常打斷 ADHD 患者的工作',
    objectToFind: 'book',
    cost: 4,
    emoji: '💡'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🎨 想要重新設計',
    description: '你開始想要重新整理工作環境，覺得現在的配置不夠完美',
    objectToFind: 'desk',
    cost: 5,
    emoji: '🎨'
  },
  {
    type: 'psychological' as DistractionType,
    title: '📝 想要做筆記',
    description: '你覺得應該做更詳細的筆記，但這會讓你偏離主要任務',
    objectToFind: 'book',
    cost: 3.5,
    emoji: '📝'
  },

  // 新增：社交媒體進階干擾
  {
    type: 'social' as DistractionType,
    title: '📧 Email 通知',
    description: '你收到新的 Email，可能很重要。你忍不住想要立刻查看',
    objectToFind: 'laptop',
    cost: 3.5,
    emoji: '📧'
  },
  {
    type: 'social' as DistractionType,
    title: '🔔 Discord 訊息',
    description: '朋友在 Discord 群組裡聊天，你想要參與對話',
    objectToFind: 'rabbit-hole',
    cost: 4.5,
    emoji: '🔔',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '📰 新聞推播',
    description: '手機推播了重要新聞，你覺得應該了解一下時事',
    objectToFind: 'rabbit-hole',
    cost: 5,
    emoji: '📰',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '🎬 Netflix 新劇',
    description: '你想起 Netflix 有新的劇集上線，只是看一集而已...',
    objectToFind: 'rabbit-hole',
    cost: 6,
    emoji: '🎬',
    special: 'rabbit-hole'
  },

  // 新增：記憶相關干擾
  {
    type: 'psychological' as DistractionType,
    title: '🧠 想起重要的事',
    description: '你突然想起一件很重要的事情，但又想不起來是什麼。這種「舌尖現象」很困擾',
    objectToFind: 'memory-failure',
    cost: 4,
    emoji: '🧠',
    special: 'memory-failure'
  },
  {
    type: 'psychological' as DistractionType,
    title: '📝 忘記寫下來',
    description: '你想起有東西忘記寫下來了，但記不起來是什麼。工作記憶的限制讓你很焦慮',
    objectToFind: 'memory-failure',
    cost: 3.5,
    emoji: '📝',
    special: 'memory-failure'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🔍 找不到檔案',
    description: '你需要一個檔案但找不到在哪裡。這種「東西不見了」的焦慮會完全打斷工作',
    objectToFind: 'laptop',
    cost: 4,
    emoji: '🔍'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🤔 剛才在想什麼？',
    description: '你完全忘記剛才在想什麼，大腦一片空白。工作記憶失效是 ADHD 的典型症狀',
    objectToFind: 'memory-failure',
    cost: 4.5,
    emoji: '🤔',
    special: 'memory-failure'
  },

  // 新增：環境敏感干擾
  {
    type: 'environment' as DistractionType,
    title: '🌡️ 溫度不對',
    description: '房間太熱或太冷，你無法專心。ADHD 患者對環境變化特別敏感',
    objectToFind: 'window',
    cost: 2.5,
    emoji: '🌡️'
  },
  {
    type: 'environment' as DistractionType,
    title: '🔊 噪音干擾',
    description: '外面有施工聲音或其他噪音，讓你無法集中注意力',
    objectToFind: 'door',
    cost: 3,
    emoji: '🔊'
  },
  {
    type: 'environment' as DistractionType,
    title: '🪑 椅子不舒服',
    description: '椅子坐起來不舒服，你需要調整姿勢或換個位置',
    objectToFind: 'chair',
    cost: 2,
    emoji: '🪑'
  },
  {
    type: 'environment' as DistractionType,
    title: '💨 空氣不流通',
    description: '房間空氣悶熱，你覺得需要開窗通風才能繼續工作',
    objectToFind: 'window',
    cost: 2.5,
    emoji: '💨'
  },
  {
    type: 'environment' as DistractionType,
    title: '🌅 陽光刺眼',
    description: '陽光太刺眼影響螢幕顯示，你需要調整窗簾或位置',
    objectToFind: 'window',
    cost: 2,
    emoji: '🌅'
  },

  // 新增：拖延症干擾
  {
    type: 'psychological' as DistractionType,
    title: '😴 想要拖延',
    description: '你開始找藉口拖延，覺得「等一下再做也可以」。拖延是 ADHD 的經典症狀',
    objectToFind: 'bed',
    cost: 4.5,
    emoji: '😴'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🎮 想要放鬆',
    description: '你覺得應該先放鬆一下，玩個小遊戲或看個影片',
    objectToFind: 'tv',
    cost: 5,
    emoji: '🎮'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🛌 想要躺一下',
    description: '你覺得很累，想要躺在床上休息一下。但這通常會變成長時間的拖延',
    objectToFind: 'bed',
    cost: 5.5,
    emoji: '🛌'
  },
  {
    type: 'psychological' as DistractionType,
    title: '📱 滑手機放鬆',
    description: '你想要滑手機放鬆一下，但這很容易變成無止境的滑動',
    objectToFind: 'rabbit-hole',
    cost: 5,
    emoji: '📱',
    special: 'rabbit-hole'
  },

  // 新增：完美主義干擾
  {
    type: 'psychological' as DistractionType,
    title: '✨ 想要做得更好',
    description: '你覺得現在做的不夠好，想要重新來過。這種完美主義會導致無限循環',
    objectToFind: 'door',
    cost: 4,
    emoji: '✨'
  },
  {
    type: 'psychological' as DistractionType,
    title: '🔧 想要優化流程',
    description: '你開始思考如何優化工作流程，但這會讓你偏離當前任務',
    objectToFind: 'laptop',
    cost: 4.5,
    emoji: '🔧'
  },
  {
    type: 'environment' as DistractionType,
    title: '📐 東西沒對齊',
    description: '你注意到桌上的東西沒有對齊，必須先整理好才能繼續工作',
    objectToFind: 'desk',
    cost: 3,
    emoji: '📐'
  },

  // 新增：衝動控制干擾
  {
    type: 'psychological' as DistractionType,
    title: '🛒 想要網購',
    description: '你突然想起需要買某樣東西，忍不住想要立刻上網購物',
    objectToFind: 'rabbit-hole',
    cost: 5.5,
    emoji: '🛒',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '💌 想要傳訊息',
    description: '你想起要回覆朋友的訊息，覺得現在不回會很失禮',
    objectToFind: 'cell phone',
    cost: 3.5,
    emoji: '💌'
  },

  // 新增：更多社交媒體干擾任務
  {
    type: 'social' as DistractionType,
    title: '📸 Instagram 限時動態',
    description: '你想要發個限時動態分享現在的心情，只需要幾秒鐘...',
    objectToFind: 'rabbit-hole',
    cost: 4,
    emoji: '📸',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '🎮 朋友在線上遊戲',
    description: '你看到朋友在玩遊戲，想要加入他們一起玩',
    objectToFind: 'rabbit-hole',
    cost: 7,
    emoji: '🎮',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '📱 Threads 新貼文',
    description: '你想要看看 Threads 上有什麼新的討論話題',
    objectToFind: 'rabbit-hole',
    cost: 4.5,
    emoji: '📱',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '💭 想要發文抱怨',
    description: '你對某件事感到不滿，想要在社交媒體上發文抱怨',
    objectToFind: 'rabbit-hole',
    cost: 5,
    emoji: '💭',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '🔍 Google 搜尋兔子洞',
    description: '你想要快速搜尋一個問題，結果越搜越深...',
    objectToFind: 'rabbit-hole',
    cost: 6,
    emoji: '🔍',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '📺 YouTube Shorts',
    description: '你想要看一個短影片放鬆一下，結果停不下來...',
    objectToFind: 'rabbit-hole',
    cost: 6.5,
    emoji: '📺',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '💬 WhatsApp 群組',
    description: '家人群組有新訊息，你想要看看是什麼重要事情',
    objectToFind: 'cell phone',
    cost: 3,
    emoji: '💬'
  },
  {
    type: 'social' as DistractionType,
    title: '🎵 Spotify 新歌單',
    description: '你想要聽聽 Spotify 推薦的新歌單，音樂能幫助專注...',
    objectToFind: 'rabbit-hole',
    cost: 4,
    emoji: '🎵',
    special: 'rabbit-hole'
  },
  {
    type: 'social' as DistractionType,
    title: '📧 工作 Email 焦慮',
    description: '你擔心錯過重要的工作郵件，想要再檢查一次信箱',
    objectToFind: 'laptop',
    cost: 4,
    emoji: '📧'
  },
  {
    type: 'social' as DistractionType,
    title: '🛍️ 網購比價',
    description: '你想起要買的東西，決定快速比較一下價格...',
    objectToFind: 'rabbit-hole',
    cost: 5.5,
    emoji: '🛍️',
    special: 'rabbit-hole'
  },

  // 新增：特殊認知干擾任務
  {
    type: 'psychological' as DistractionType,
    title: '🧠 多工處理誘惑',
    description: '你覺得可以同時做好幾件事，想要開始多工處理',
    objectToFind: 'laptop',
    cost: 4,
    emoji: '🧠',
    special: 'memory-failure'
  },
  {
    type: 'psychological' as DistractionType,
    title: '⚡ 衝動決定',
    description: '你突然有個「絕佳」的想法，想要立刻行動',
    objectToFind: 'cell phone',
    cost: 3.5,
    emoji: '⚡'
  },
  {
    type: 'social' as DistractionType,
    title: '📱 手機成癮檢查',
    description: '你無意識地想要拿起手機，即使沒有通知',
    objectToFind: 'cell phone',
    cost: 2.5,
    emoji: '📱'
  },
  {
    type: 'social' as DistractionType,
    title: '🎬 Netflix 自動播放',
    description: '你想要「背景播放」一部劇來幫助專注，但...',
    objectToFind: 'rabbit-hole',
    cost: 7,
    emoji: '🎬',
    special: 'rabbit-hole'
  },

  {
    type: 'psychological' as DistractionType,
    title: '🎲 想要嘗試新方法',
    description: '你突然想到一個新的做法，忍不住想要立刻嘗試',
    objectToFind: 'laptop',
    cost: 4,
    emoji: '🎲'
  },
];

type DistractionConfigType = DistractionType | 'timeout';

const DISTRACTION_CONFIG: Record<DistractionConfigType, { minDelay: number; maxDelay: number; duration: number; cost: number; title: string; objectToFind?: string }> = {
  environment: { minDelay: 15, maxDelay: 25, duration: 3000, cost: 2, title: '☀️ 陽光太刺眼', objectToFind: 'window' },
  biological: { minDelay: 20, maxDelay: 30, duration: 4000, cost: 2.5, title: '💧 口渴了，需要喝水', objectToFind: 'cup' },
  social: { minDelay: 18, maxDelay: 28, duration: 3500, cost: 1.5, title: '👥 有人在叫你', objectToFind: 'person' },
  timeout: { minDelay: 0, maxDelay: 0, duration: 0, cost: 5, title: '⏱️ 時間到！' },
  psychological: { minDelay: 12, maxDelay: 22, duration: 3000, cost: 1, title: '🤔 突然想到其他事', objectToFind: 'tv' },
};

// 遊戲時間限制（秒）- 無限挑戰模式
const GAME_TIME_LIMIT = 90; // 90 秒時間限制，盡可能完成更多任務

// 單個任務的超時時間（秒）- 極限挑戰
const TASK_TIMEOUT = 10; // 10 秒內找不到物體就自動跳過，極限時間壓力

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

// 遊戲故事章節 - 每個章節有不同的背景故事和任務 (增加到8個任務)
const STORY_CHAPTERS = [
  {
    title: '早晨的掙扎',
    description: '你剛起床，腦子還很混亂。ADHD 讓你的早晨特別困難，你需要找到基本用品來開始新的一天。',
    tasks: ['cup', 'book', 'bottle', 'keys', 'cell phone', 'chair', 'door', 'window'],
    narrative: '早上 7:30 AM - 鬧鐘響了，但你的大腦還沒完全清醒。你需要找到水杯喝水、書籍確認今天的計劃、瓶子裝水、鑰匙和手機、坐好椅子、確認門鎖、看看窗外的天氣。每一樣東西都像在跟你捉迷藏。'
  },
  {
    title: '通勤的焦慮',
    description: '準備出門上班，但你總是忘記東西。ADHD 讓簡單的準備工作變得複雜。',
    tasks: ['keys', 'door', 'apple', 'bottle', 'backpack', 'umbrella', 'clock', 'mirror'],
    narrative: '早上 8:15 AM - 你需要出門了，但又開始擔心忘記什麼。找到鑰匙、確認門鎖、拿個蘋果當早餐、帶上水瓶、背包、雨傘、看看時間、照照鏡子確認儀容。每次出門都是一場戰鬥。'
  },
  {
    title: '工作前的準備',
    description: '到了辦公室，你需要設置工作環境。但周圍的聲音和動靜讓你很難專心。',
    tasks: ['laptop', 'keyboard', 'monitor', 'chair', 'desk', 'mouse', 'cup', 'book'],
    narrative: '上午 9:00 AM - 工作開始了。你需要打開電腦、連接鍵盤、調整螢幕、坐好椅子、整理桌子、設定滑鼠、倒杯咖啡、拿出參考書籍。同事們的談話聲讓你分心。'
  },
  {
    title: '午餐前的衝刺',
    description: '上午的工作讓你精疲力盡，但還有任務要完成。你的專注力開始下降。',
    tasks: ['mouse', 'book', 'cup', 'clock', 'cell phone', 'bottle', 'monitor', 'keyboard'],
    narrative: '上午 11:30 AM - 你需要完成一些任務才能去吃午餐。找到滑鼠、查看參考書籍、喝點水、看看時間、檢查手機、補充水分、調整螢幕、使用鍵盤。但你的大腦已經開始渴望休息。'
  },
  {
    title: '下午的低潮',
    description: '午餐後的時段是 ADHD 患者最困難的時候。你感到疲勞和沮喪，專注力急劇下降。',
    tasks: ['bottle', 'chair', 'window', 'sky', 'cup', 'door', 'clock', 'apple'],
    narrative: '下午 2:00 PM - 午餐後的低谷時段。你需要喝水保持清醒、調整椅子、看看窗外、望望天空來舒緩心情、再喝杯咖啡、確認門是否關好、看看時間、吃個蘋果補充能量。這是一天中最艱難的時刻。'
  },
  {
    title: '傍晚的掙扎',
    description: '工作日即將結束，但你還有最後的任務。你開始逃避，想著其他事情。',
    tasks: ['desk', 'door', 'person', 'tv'],
    narrative: '傍晚 5:00 PM - 你渴望離開辦公室。整理桌子、看看門口、想起家人朋友、想著回家看電視。但還有工作要完成。'
  },
  {
    title: '回家的放鬆',
    description: '終於回到家了！但 ADHD 讓你很難真正放鬆，你的大腦還在高速運轉。',
    tasks: ['cup', 'chair', 'book', 'bed'],
    narrative: '晚上 7:00 PM - 回到家中。你需要喝杯茶、坐在舒適的椅子上、看看書、想著等等要早點睡覺。但你的大腦還在處理一天的事情。'
  },
  {
    title: '夜晚的反思',
    description: '夜深了，你試著整理思緒。ADHD 讓你的大腦很難安靜下來。',
    tasks: ['clock', 'window', 'sky', 'bed'],
    narrative: '晚上 10:00 PM - 你看看時鐘，已經很晚了。透過窗戶看看夜空，試著讓大腦平靜下來，準備上床睡覺。但思緒還在飛舞。'
  },
];

// 常見物品任務 - 容易在身邊找到
// 這些任務代表了 ADHD 患者需要完成的日常活動
const TASKS: Task[] = [
  // 基本日常用品
  { id: 'cup', title: '找到杯子', hint: '桌上或廚房', prompt: '將鏡頭對準你的水杯或馬克杯。', emoji: '☕', difficulty: 'easy' },
  { id: 'book', title: '找到書', hint: '桌上或書架', prompt: '將鏡頭對準任何一本書。', emoji: '📖', difficulty: 'easy' },
  { id: 'bottle', title: '找到瓶子', hint: '桌上或包包裡', prompt: '將鏡頭對準任何瓶子。', emoji: '🧪', difficulty: 'easy' },
  { id: 'chair', title: '找到椅子', hint: '你坐著的地方', prompt: '將鏡頭對準你的椅子。', emoji: '🪑', difficulty: 'easy' },
  { id: 'desk', title: '找到桌子', hint: '你面前', prompt: '將鏡頭對準你的桌子。', emoji: '🗃️', difficulty: 'easy' },
  { id: 'door', title: '找到門', hint: '房間的出口', prompt: '將鏡頭對準任何一扇門。', emoji: '🚪', difficulty: 'easy' },
  { id: 'window', title: '找到窗戶', hint: '房間的牆上', prompt: '將鏡頭對準任何一扇窗戶。', emoji: '🪟', difficulty: 'easy' },

  // 電子設備
  { id: 'keyboard', title: '找到鍵盤', hint: '電腦桌上', prompt: '將鏡頭對準你的鍵盤。', emoji: '⌨️', difficulty: 'normal' },
  { id: 'laptop', title: '找到電腦', hint: '桌上或包包裡', prompt: '將鏡頭對準你的筆記本電腦。', emoji: '💻', difficulty: 'normal' },
  { id: 'mouse', title: '找到滑鼠', hint: '電腦桌上', prompt: '將鏡頭對準你的滑鼠。', emoji: '🖱️', difficulty: 'normal' },
  { id: 'monitor', title: '找到螢幕', hint: '電腦前面', prompt: '將鏡頭對準你的電腦螢幕。', emoji: '🖥️', difficulty: 'easy' },
  { id: 'cell phone', title: '找到手機', hint: '你的手機', prompt: '將鏡頭對準另一支手機或電話。', emoji: '📱', difficulty: 'easy' },
  { id: 'tv', title: '找到電視', hint: '客廳或房間', prompt: '將鏡頭對準電視螢幕。', emoji: '📺', difficulty: 'normal' },

  // 時間相關
  { id: 'clock', title: '找到時鐘', hint: '牆上或桌上', prompt: '將鏡頭對準時鐘或手錶。', emoji: '⏰', difficulty: 'normal' },

  // 食物和飲品
  { id: 'apple', title: '找到蘋果', hint: '廚房或桌上', prompt: '將鏡頭對準蘋果或其他水果。', emoji: '🍎', difficulty: 'easy' },

  // 個人物品
  { id: 'keys', title: '找到鑰匙', hint: '桌上或包包裡', prompt: '將鏡頭對準你的鑰匙。', emoji: '🔑', difficulty: 'normal' },
  { id: 'bed', title: '找到床', hint: '臥室', prompt: '將鏡頭對準床或枕頭。', emoji: '🛏️', difficulty: 'easy' },

  // 環境元素
  { id: 'person', title: '找到人', hint: '照片或鏡子', prompt: '將鏡頭對準人物照片或鏡子中的自己。', emoji: '👤', difficulty: 'normal' },
  { id: 'sky', title: '看向天空', hint: '窗外或陽台', prompt: '將鏡頭對準天空或雲朵。', emoji: '☁️', difficulty: 'easy' },
];

const formatSeconds = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// 隨機選擇任務序列 - 8個任務的遊戲體驗
const getRandomTaskSequence = (): Task[] => {
  // 隨機選擇一個故事章節
  const randomChapter = STORY_CHAPTERS[Math.floor(Math.random() * STORY_CHAPTERS.length)];

  // 根據故事章節的任務 ID 獲取對應的任務物件
  const selectedTasks = randomChapter.tasks
    .map(taskId => TASKS.find(t => t.id === taskId))
    .filter((task): task is Task => task !== undefined);

  // 現在故事章節已經有 8 個任務，直接返回
  // 如果任務不足8個，補充隨機任務
  while (selectedTasks.length < 8) {
    const randomTask = TASKS[Math.floor(Math.random() * TASKS.length)];
    if (!selectedTasks.find(t => t.id === randomTask.id)) {
      selectedTasks.push(randomTask);
    }
  }

  // 確保只返回8個任務
  return selectedTasks.slice(0, 8);
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

        // Auto-dismiss after duration - 移除遞歸觸發避免無限循環
        setTimeout(() => {
          activeDistractionsRef.current.delete(type);
          // 不再自動重新觸發，避免干擾失控
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

    // 激進的漸進式干擾系統 - 大幅提高難度
    const scheduleProgressiveDistractions = () => {
      const distractionTypes: DistractionType[] = ['environment', 'biological', 'psychological', 'social'];

      // 第一階段：前30秒（溫和期）- 每8-10秒一個干擾
      let currentTime = 8000; // 從8秒開始（更早開始）
      for (let i = 0; i < 3; i++) {
        const type = distractionTypes[i % distractionTypes.length];
        const delay = currentTime + (i * 8000) + Math.random() * 2000;
        if (delay < 30000) {
          setTimeout(() => triggerDistraction(type), delay);
        }
      }

      // 第二階段：中30秒（適中期）- 每5-7秒一個干擾
      currentTime = 30000;
      for (let i = 0; i < 5; i++) {
        const type = distractionTypes[i % distractionTypes.length];
        const delay = currentTime + (i * 5000) + Math.random() * 2000;
        if (delay < 60000) {
          setTimeout(() => triggerDistraction(type), delay);
        }
      }

      // 第三階段：後30秒（困難期）- 每3-5秒一個干擾
      currentTime = 60000;
      for (let i = 0; i < 7; i++) {
        const type = distractionTypes[i % distractionTypes.length];
        const delay = currentTime + (i * 3500) + Math.random() * 1500;
        if (delay < 90000) {
          setTimeout(() => triggerDistraction(type), delay);
        }
      }

      // 額外的隨機干擾（增加不可預測性）
      for (let i = 0; i < 5; i++) {
        const type = distractionTypes[Math.floor(Math.random() * distractionTypes.length)];
        const delay = 15000 + Math.random() * 70000; // 在15-85秒之間隨機觸發
        setTimeout(() => triggerDistraction(type), delay);
      }

      console.log('[DISTRACTION] Aggressive distraction system initialized - ~20 distractions over 90 seconds');
    };

    scheduleProgressiveDistractions();
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
  const [fullscreenLocked, setFullscreenLocked] = useState(false); // 防止意外退出全螢幕
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
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // 分數系統和死亡機制
  const [playerScore, setPlayerScore] = useState(100); // 初始分數100分
  const [showDeathAnimation, setShowDeathAnimation] = useState(false);
  const [deathReason, setDeathReason] = useState<string>('');
  const [taskTimeLeft, setTaskTimeLeft] = useState(TASK_TIMEOUT); // 當前任務剩餘時間

  // 特效系統
  const [particleEffect, setParticleEffect] = useState<{
    type: 'success' | 'error' | 'distraction' | 'focus' | 'detection';
    active: boolean;
    position?: { x: number; y: number };
  }>({ type: 'success', active: false });
  const [screenShake, setScreenShake] = useState(false);
  const [blurOverlay, setBlurOverlay] = useState(false);
  const [detectionSuccess, setDetectionSuccess] = useState<{
    visible: boolean;
    position: { x: number; y: number };
    objectName: string;
  }>({ visible: false, position: { x: 0, y: 0 }, objectName: '' });

  // 干擾任務統計系統
  const [distractionStats, setDistractionStats] = useState({
    total: 0,
    byType: {
      environment: 0,
      biological: 0,
      psychological: 0,
      social: 0,
    },
    bySpecial: {
      'rabbit-hole': 0,
      'memory-failure': 0,
    },
    completed: 0,
    skipped: 0,
    averageCompletionTime: 0,
  });

  const difficultyIntensity = {
    easy: 0.5,
    normal: 1,
    hard: 1.5,
  }[distractionSettings.difficulty];

  const currentTask = randomTaskSequence[currentTaskIndex] ?? null;

  // 特效觸發函數
  const triggerParticleEffect = useCallback((
    type: 'success' | 'error' | 'distraction' | 'focus' | 'detection',
    position?: { x: number; y: number }
  ) => {
    setParticleEffect({ type, active: true, position });
    setTimeout(() => {
      setParticleEffect(prev => ({ ...prev, active: false }));
    }, 2000);
  }, []);

  const triggerScreenShake = useCallback((duration = 500) => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), duration);
  }, []);

  const triggerBlurEffect = useCallback((duration = 1000) => {
    setBlurOverlay(true);
    setTimeout(() => setBlurOverlay(false), duration);
  }, []);

  const showDetectionSuccess = useCallback((position: { x: number; y: number }, objectName: string) => {
    setDetectionSuccess({ visible: true, position, objectName });
    setTimeout(() => {
      setDetectionSuccess(prev => ({ ...prev, visible: false }));
    }, 2000);
  }, []);

  // 處理任務超時
  const handleTaskTimeout = useCallback(() => {
    const TIMEOUT_PENALTY = 20; // 超時扣20分（提高難度）

    console.log('[SCORE] Task timeout! Deducting points:', TIMEOUT_PENALTY);

    const audioManager = getAudioManager();
    audioManager.playError();

    // 扣分
    setPlayerScore(prev => {
      const newScore = Math.max(0, prev - TIMEOUT_PENALTY);

      // 檢查是否死亡
      if (newScore <= 0) {
        handlePlayerDeath('分數歸零 - 任務超時過多');
        return 0;
      }

      return newScore;
    });

    // 觸發紅色閃爍效果和視覺特效
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }

    // 觸發錯誤特效
    triggerParticleEffect('error');
    triggerScreenShake(800);

    // 顯示扣分提示
    setErrorMessage(`⏰ 任務超時！扣除 ${TIMEOUT_PENALTY} 分`);
    setTimeout(() => setErrorMessage(''), 3000);

    // 繼續下一個任務（不扣專注力分數，因為已經扣了玩家分數）
    // 無限循環模式：任務序列循環使用
    setCurrentTaskIndex((prev) => {
      const nextIndex = (prev + 1) % randomTaskSequence.length;
      return nextIndex;
    });
  }, [currentTaskIndex, randomTaskSequence]);

  // 處理玩家死亡
  const handlePlayerDeath = useCallback((reason: string) => {
    console.log('[DEATH] Player died:', reason);

    const audioManager = getAudioManager();
    audioManager.playError();
    audioManager.playOverwhelm(); // 播放壓倒性音效

    setDeathReason(reason);
    setShowDeathAnimation(true);
    setSessionState('failed');

    // 停止所有計時器
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 停止所有音效（延遲一點讓死亡音效播放完）
    setTimeout(() => {
      audioManager.stopAll();
    }, 1000);

    // 不要立即退出全螢幕，讓死亡動畫在全螢幕中播放

    // 3秒後顯示結算畫面
    setTimeout(() => {
      setShowDeathAnimation(false);
      // 這裡會顯示結算畫面
    }, 3000);
  }, []);

  // 任務計時器 - 每個任務的倒數計時
  useEffect(() => {
    if (sessionState !== 'running' || !currentTask) return;

    const taskInterval = setInterval(() => {
      setTaskTimeLeft(prev => {
        const newTime = prev - 1;

        // 時間警告音效
        if (newTime === 5) {
          const audioManager = getAudioManager();
          audioManager.playError(); // 警告音
        }

        // 時間到了，扣分
        if (newTime <= 0) {
          handleTaskTimeout();
          return TASK_TIMEOUT; // 重置為下一個任務
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(taskInterval);
  }, [sessionState, currentTask, handleTaskTimeout]);

  // 重置任務計時器當任務改變時
  useEffect(() => {
    if (currentTask) {
      setTaskTimeLeft(TASK_TIMEOUT);
    }
  }, [currentTask]);

  // 根據干擾任務類型播放對應音效
  const playDistractionAudio = useCallback((audioManager: any, task: any) => {
    // 根據任務標題和類型選擇合適的音效
    const title = task.title.toLowerCase();

    if (title.includes('手機') || title.includes('phone')) {
      audioManager.playPhoneBuzz();
    } else if (title.includes('email') || title.includes('郵件')) {
      audioManager.playEmailPing();
    } else if (title.includes('社交媒體') || title.includes('instagram') || title.includes('line') || title.includes('tiktok') || title.includes('youtube')) {
      audioManager.playSocialMedia();
    } else if (title.includes('鍵盤') || title.includes('keyboard')) {
      audioManager.playKeyboardTyping();
    } else if (title.includes('滑鼠') || title.includes('mouse')) {
      audioManager.playMouseClick();
    } else if (title.includes('門') || title.includes('door')) {
      audioManager.playDoorSlam();
    } else if (title.includes('施工') || title.includes('construction')) {
      audioManager.playConstruction();
    } else if (title.includes('交通') || title.includes('traffic')) {
      audioManager.playTraffic();
    } else if (title.includes('對話') || title.includes('conversation') || title.includes('朋友')) {
      audioManager.playConversation();
    } else if (title.includes('電視') || title.includes('tv') || title.includes('netflix')) {
      audioManager.playTvSound();
    } else if (title.includes('肚子') || title.includes('飢餓') || title.includes('stomach')) {
      audioManager.playStomachGrowl();
    } else if (title.includes('打哈欠') || title.includes('yawn')) {
      audioManager.playYawn();
    } else if (title.includes('打噴嚏') || title.includes('sneeze')) {
      audioManager.playSneeze();
    } else if (title.includes('咳嗽') || title.includes('cough')) {
      audioManager.playCough();
    } else if (title.includes('心跳') || title.includes('heartbeat')) {
      audioManager.playHeartbeat();
    } else if (title.includes('焦慮') || title.includes('anxiety')) {
      audioManager.playAnxietyPulse();
    } else if (title.includes('記憶') || title.includes('memory') || title.includes('忘記')) {
      audioManager.playMemoryGlitch();
    } else if (title.includes('過度專注') || title.includes('hyperfocus')) {
      audioManager.playHyperfocus();
    } else if (title.includes('腦霧') || title.includes('brain fog')) {
      audioManager.playBrainFog();
    } else if (title.includes('壓倒') || title.includes('overwhelm')) {
      audioManager.playOverwhelm();
    } else {
      // 根據干擾類型選擇預設音效
      switch (task.type) {
        case 'environment':
          audioManager.playConstruction();
          break;
        case 'biological':
          audioManager.playHeartbeat();
          break;
        case 'psychological':
          audioManager.playAnxietyPulse();
          break;
        case 'social':
          audioManager.playSocialMedia();
          break;
        default:
          audioManager.playNotification();
      }
    }

    // 移除重複的背景音效，避免音效堆疊
  }, []);

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
        // 智能干擾任務選擇系統
        const specialTasks = INTERRUPTION_TASKS.filter(task => task.special);
        const environmentTasks = INTERRUPTION_TASKS.filter(task => task.type === 'environment' && !task.special);
        const biologicalTasks = INTERRUPTION_TASKS.filter(task => task.type === 'biological' && !task.special);
        const psychologicalTasks = INTERRUPTION_TASKS.filter(task => task.type === 'psychological' && !task.special);
        const socialTasks = INTERRUPTION_TASKS.filter(task => task.type === 'social' && !task.special);

        // 根據遊戲進度和專注力調整觸發機率
        const gameProgress = currentTaskIndex / randomTaskSequence.length;
        const focusRatio = focusLevel / 100;

        // 計算各類型任務的權重 - 大幅提高特效型干擾（兔子洞）
        let specialWeight = 0.50; // 基礎 50%（從 35% 大幅提高）
        let environmentWeight = 0.15; // 降低
        let biologicalWeight = 0.10; // 降低
        let psychologicalWeight = 0.15;
        let socialWeight = 0.10;

        // 遊戲後期進一步增加特殊任務（兔子洞效應）
        if (gameProgress > 0.6) {
          specialWeight += 0.20; // 從 0.15 提高到 0.20
          psychologicalWeight += 0.10;
          socialWeight += 0.10;
          environmentWeight -= 0.20; // 進一步降低
          biologicalWeight -= 0.10;
        }

        // 專注力低時仍然增加生理和環境干擾，但保持特殊任務
        if (focusRatio < 0.5) {
          biologicalWeight += 0.10; // 從 0.15 降低
          environmentWeight += 0.05; // 從 0.10 降低
          specialWeight -= 0.05; // 從 -0.10 減少懲罰
          psychologicalWeight -= 0.05; // 從 -0.10 減少懲罰
          socialWeight -= 0.05;
        }

        // 專注力高時大幅增加特殊任務（兔子洞陷阱）
        if (focusRatio > 0.8) {
          specialWeight += 0.15; // 從 0.10 提高
          socialWeight += 0.15;
          environmentWeight -= 0.15; // 從 -0.10 提高
          biologicalWeight -= 0.10;
          psychologicalWeight -= 0.05;
        }

        // 根據權重選擇任務類型
        const random = Math.random();
        let cumulativeWeight = 0;

        if (random < (cumulativeWeight += specialWeight) && specialTasks.length > 0) {
          interruptionTask = specialTasks[Math.floor(Math.random() * specialTasks.length)];
          console.log('[DEBUG] Selected SPECIAL task:', interruptionTask.title, `(${(specialWeight * 100).toFixed(1)}% chance)`);
        } else if (random < (cumulativeWeight += environmentWeight) && environmentTasks.length > 0) {
          interruptionTask = environmentTasks[Math.floor(Math.random() * environmentTasks.length)];
          console.log('[DEBUG] Selected ENVIRONMENT task:', interruptionTask.title, `(${(environmentWeight * 100).toFixed(1)}% chance)`);
        } else if (random < (cumulativeWeight += biologicalWeight) && biologicalTasks.length > 0) {
          interruptionTask = biologicalTasks[Math.floor(Math.random() * biologicalTasks.length)];
          console.log('[DEBUG] Selected BIOLOGICAL task:', interruptionTask.title, `(${(biologicalWeight * 100).toFixed(1)}% chance)`);
        } else if (random < (cumulativeWeight += psychologicalWeight) && psychologicalTasks.length > 0) {
          interruptionTask = psychologicalTasks[Math.floor(Math.random() * psychologicalTasks.length)];
          console.log('[DEBUG] Selected PSYCHOLOGICAL task:', interruptionTask.title, `(${(psychologicalWeight * 100).toFixed(1)}% chance)`);
        } else if (socialTasks.length > 0) {
          interruptionTask = socialTasks[Math.floor(Math.random() * socialTasks.length)];
          console.log('[DEBUG] Selected SOCIAL task:', interruptionTask.title, `(${(socialWeight * 100).toFixed(1)}% chance)`);
        } else {
          // 備用方案：隨機選擇
          const allNormalTasks = INTERRUPTION_TASKS.filter(task => !task.special);
          interruptionTask = allNormalTasks[Math.floor(Math.random() * allNormalTasks.length)];
          console.log('[DEBUG] Selected FALLBACK task:', interruptionTask.title);
        }

        console.log(`[DEBUG] Game progress: ${(gameProgress * 100).toFixed(1)}%, Focus: ${focusLevel}%, Weights: Special=${(specialWeight * 100).toFixed(1)}%, Env=${(environmentWeight * 100).toFixed(1)}%, Bio=${(biologicalWeight * 100).toFixed(1)}%, Psy=${(psychologicalWeight * 100).toFixed(1)}%, Soc=${(socialWeight * 100).toFixed(1)}%`);
      }

      // 更新干擾統計
      setDistractionStats(prev => ({
        ...prev,
        total: prev.total + 1,
        byType: {
          ...prev.byType,
          [interruptionTask.type]: prev.byType[interruptionTask.type] + 1,
        },
        bySpecial: interruptionTask.special ? {
          ...prev.bySpecial,
          [interruptionTask.special]: prev.bySpecial[interruptionTask.special] + 1,
        } : prev.bySpecial,
      }));

      // 檢查是否是特殊任務
      if (interruptionTask.special === 'rabbit-hole') {
        console.log('[DEBUG] Triggering rabbit hole effect');
        // 停止所有其他音效，只播放兔子洞音效
        audioManager.stopAll();
        setTimeout(() => {
          audioManager.playRabbitHoleEnter();
        }, 100);
        setShowRabbitHole(true);
        return;
      } else if (interruptionTask.special === 'memory-failure') {
        console.log('[DEBUG] Triggering working memory failure');
        // 停止所有其他音效，只播放記憶失敗音效
        audioManager.stopAll();
        setTimeout(() => {
          audioManager.playWorkingMemoryFail();
        }, 100);
        setForgottenTask(currentTask?.title || '未知任務');
        setShowWorkingMemoryFailure(true);
        return;
      }

      // 創建普通干擾事件
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

      // 設置干擾任務為活躍狀態
      setIsDistractedTaskActive(true);

      console.log('[DEBUG] Interruption task triggered:', interruptionTask.title);

      setDistractions(prev => [...prev, newDistraction]);
      setCurrentDistraction(newDistraction);

      // 降低專注力
      setFocusLevel(prev => Math.max(0, prev - 20));

      // 根據干擾任務類型播放對應音效
      playDistractionAudio(audioManager, interruptionTask);

      // 觸發干擾特效
      triggerParticleEffect('distraction');
      triggerBlurEffect(2000);

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
      // 恢復部分專注力（減少恢復量以提高難度）
      setFocusLevel(prev => Math.min(100, prev + 10));
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

  // 增強的全螢幕事件監聽器 - 更積極地防止意外退出
  useEffect(() => {
    let reenterAttempts = 0;
    const MAX_REENTER_ATTEMPTS = 3;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      console.log('[FULLSCREEN] Fullscreen change detected:', isCurrentlyFullscreen);

      // 只有在遊戲正在運行且不是在結算畫面時才重新進入全螢幕
      // 移除 !isDistractedTaskActive 條件，允許干擾期間也保持全螢幕
      if (sessionState === 'running' && !isCurrentlyFullscreen && isFullscreen && !showDeathAnimation) {
        console.log('[FULLSCREEN] Game is running but fullscreen was lost, attempting to re-enter');

        // 限制重新進入嘗試次數，避免無限循環
        if (reenterAttempts < MAX_REENTER_ATTEMPTS) {
          reenterAttempts++;

          setTimeout(async () => {
            try {
              // 再次檢查狀態，確保仍在遊戲中
              if (sessionState === 'running' && !document.fullscreenElement) {
                const docElement = document.documentElement as any;
                if (docElement.requestFullscreen) {
                  await docElement.requestFullscreen();
                  console.log('[FULLSCREEN] Successfully re-entered fullscreen');
                  reenterAttempts = 0; // 重置計數器
                } else if (docElement.webkitRequestFullscreen) {
                  await docElement.webkitRequestFullscreen();
                  reenterAttempts = 0;
                } else if (docElement.mozRequestFullScreen) {
                  await docElement.mozRequestFullScreen();
                  reenterAttempts = 0;
                } else if (docElement.msRequestFullscreen) {
                  await docElement.msRequestFullscreen();
                  reenterAttempts = 0;
                }
              }
            } catch (error) {
              console.warn('[FULLSCREEN] Failed to re-enter fullscreen (attempt ' + reenterAttempts + '):', error);
            }
          }, 200); // 增加延遲以確保事件處理完成
        } else {
          console.warn('[FULLSCREEN] Max re-enter attempts reached, giving up');
        }
      }

      setIsFullscreen(isCurrentlyFullscreen);
    };

    // 監聽全螢幕變化事件（所有瀏覽器）
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [sessionState, isFullscreen, showDeathAnimation]); // 移除 isDistractedTaskActive 依賴

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

    // 開始背景音樂
    audioManager.startBackgroundMusic();
    
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

    // 重置分數系統
    setPlayerScore(100);
    setTaskTimeLeft(TASK_TIMEOUT);
    setShowDeathAnimation(false);
    setDeathReason('');
    
    // 全螢幕已在 startSession 中處理，這裡只設置狀態
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
          // 無限挑戰模式：時間到就結束，顯示完成畫面
          setSessionState('completed');
          // 停止所有音效
          const audioManager = getAudioManager();
          setTimeout(() => {
            audioManager.stopAll();
          }, 1000);
          // 不要立即退出全螢幕，讓結算畫面在全螢幕中顯示
          return GAME_TIME_LIMIT;
        }
        return newTime;
      });
    }, 1000);
  }, []);

  // 主要的開始遊戲函數 (立即進入全螢幕並顯示介紹)
  const startSession = useCallback(async () => {
    // 確保攝影機權限已獲得
    if (permissionState !== 'granted') {
      console.log('[DEBUG] Camera permission not granted, requesting...');
      await handleRequestCamera();
      // 注意：權限狀態會在 handleRequestCamera 中異步更新
      // 我們不能立即檢查 permissionState，而是讓用戶再次點擊開始
      return;
    } else {
      // 立即進入全螢幕
      console.log('[DEBUG] Entering fullscreen immediately');
      try {
        // 針對不同瀏覽器的全螢幕 API
        const docElement = document.documentElement as any;
        if (docElement.requestFullscreen) {
          await docElement.requestFullscreen();
        } else if (docElement.webkitRequestFullscreen) {
          await docElement.webkitRequestFullscreen();
        } else if (docElement.mozRequestFullScreen) {
          await docElement.mozRequestFullScreen();
        } else if (docElement.msRequestFullscreen) {
          await docElement.msRequestFullscreen();
        } else {
          console.warn('此瀏覽器不支援全螢幕模式');
        }
        console.log('[DEBUG] Fullscreen entered successfully');
      } catch (error) {
        console.warn('[DEBUG] Fullscreen failed, continuing anyway:', error);
      }

      // 顯示故事介紹
      showIntro();
    }
  }, [showIntro, permissionState, handleRequestCamera]);

  const completeInterruptionTask = useCallback(() => {
    console.log('[DEBUG] Completing interruption task');
    const audioManager = getAudioManager();
    audioManager.playSuccess();
    audioManager.playDetection(); // 添加物體偵測音

    // 更新干擾統計 - 完成任務
    if (currentDistraction) {
      const completionTime = Date.now() - currentDistraction.triggeredAt;
      setDistractionStats(prev => ({
        ...prev,
        completed: prev.completed + 1,
        averageCompletionTime: prev.completed > 0
          ? (prev.averageCompletionTime * prev.completed + completionTime) / (prev.completed + 1)
          : completionTime,
      }));
    }

    // 解除干擾任務鎖定
    console.log('[DEBUG] Setting isDistractedTaskActive to false');
    setIsDistractedTaskActive(false);

    // 標記干擾任務為已完成
    if (currentDistraction) {
      console.log('[DEBUG] Clearing currentDistraction:', currentDistraction.id);
      setDistractions(prev =>
        prev.map(d =>
          d.id === currentDistraction.id
            ? { ...d, dismissedAt: Date.now() }
            : d
        )
      );
      setCurrentDistraction(null);
    }

    // 恢複一些專注力（減少恢復量以提高難度）
    setFocusLevel(prev => Math.min(100, prev + 10));
    console.log('[DEBUG] Interruption task completed, main task should now be visible');
  }, [currentDistraction]);

  // 處理兔子洞逃脫
  const escapeRabbitHole = useCallback(() => {
    console.log('[DEBUG] Escaping rabbit hole');
    const audioManager = getAudioManager();
    audioManager.playRabbitHoleEscape();
    audioManager.playSuccess();

    console.log('[DEBUG] Hiding rabbit hole effect');
    setShowRabbitHole(false);

    // 標記干擾任務為已完成
    if (currentDistraction) {
      console.log('[DEBUG] Clearing rabbit hole distraction:', currentDistraction.id);
      setDistractions(prev =>
        prev.map(d =>
          d.id === currentDistraction.id
            ? { ...d, dismissedAt: Date.now() }
            : d
        )
      );
      setCurrentDistraction(null);
    }

    // 解除干擾任務鎖定 - 重要！讓主任務可以繼續
    console.log('[DEBUG] Setting isDistractedTaskActive to false after rabbit hole');
    setIsDistractedTaskActive(false);

    // 恢復一些專注力（但比正常完成任務少一些，因為被分心了）
    setFocusLevel(prev => Math.min(100, prev + 5));
    console.log('[DEBUG] Escaped from rabbit hole, main task should now be visible');
  }, [currentDistraction]);

  // 處理工作記憶恢復
  const recoverWorkingMemory = useCallback(() => {
    console.log('[DEBUG] Recovering working memory');
    const audioManager = getAudioManager();
    audioManager.playWorkingMemoryRecover();
    audioManager.playSuccess();

    console.log('[DEBUG] Hiding working memory failure effect');
    setShowWorkingMemoryFailure(false);
    setForgottenTask('');

    // 標記干擾任務為已完成
    if (currentDistraction) {
      console.log('[DEBUG] Clearing memory failure distraction:', currentDistraction.id);
      setDistractions(prev =>
        prev.map(d =>
          d.id === currentDistraction.id
            ? { ...d, dismissedAt: Date.now() }
            : d
        )
      );
      setCurrentDistraction(null);
    }

    // 解除干擾任務鎖定 - 重要！讓主任務可以繼續
    console.log('[DEBUG] Setting isDistractedTaskActive to false after memory recovery');
    setIsDistractedTaskActive(false);

    // 恢復一些專注力（但比正常完成任務少，因為記憶中斷很消耗精力）
    setFocusLevel(prev => Math.min(100, prev + 3));
    console.log('[DEBUG] Working memory recovered, main task should now be visible');
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
      // 無限循環模式：任務序列循環使用
      const nextIndex = (prev + 1) % randomTaskSequence.length;

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

    // 觸發成功特效
    triggerParticleEffect('success', { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    // 顯示檢測成功動畫
    if (currentTask) {
      showDetectionSuccess(
        { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        currentTask.title
      );
    }

    // 觸發震動回饋
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // 清除超時計時器
    if (taskTimeoutRef) {
      clearTimeout(taskTimeoutRef);
      setTaskTimeoutRef(null);
    }

    // 恢複專注力（完成主任務的獎勵）
    setFocusLevel(prev => Math.min(100, prev + 20));
    
    setLogs((prev) => {
      const updated = [...prev];
      const index = updated.length - 1;
      if (updated[index] && updated[index].completedAt === null) {
        updated[index] = { ...updated[index], completedAt: Date.now() };
      }
      return updated;
    });

    setCurrentTaskIndex((prev) => {
      // 無限循環模式：任務序列循環使用
      const nextIndex = (prev + 1) % randomTaskSequence.length;

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
    setShowGameIntro(false);
    setShowRabbitHole(false);
    setShowWorkingMemoryFailure(false);
    setForgottenTask('');
    setIsFullscreen(false);

    // 重置干擾統計
    setDistractionStats({
      total: 0,
      byType: {
        environment: 0,
        biological: 0,
        psychological: 0,
        social: 0,
      },
      bySpecial: {
        'rabbit-hole': 0,
        'memory-failure': 0,
      },
      completed: 0,
      skipped: 0,
      averageCompletionTime: 0,
    });
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
    <ScreenShake isActive={screenShake} intensity={8} duration={800}>
      <div className={`${isFullscreen && sessionState === 'running' ? 'fixed inset-0 z-50 overflow-hidden' : 'min-h-screen'} bg-slate-950 text-slate-100`}>
      {/* 新的專注力條 - 只在遊戲運行時顯示 */}
      <PulseEffect
        isActive={focusLevel <= 30}
        color="#ef4444"
        intensity={0.3}
      >
        <FocusBar
          focusLevel={focusLevel}
          isVisible={sessionState === 'running'}
          onCriticalLevel={() => {
            // 當專注力過低時的回調
            const audioManager = getAudioManager();
            audioManager.playError();
            triggerParticleEffect('error');
            if (navigator.vibrate) {
              navigator.vibrate([300, 100, 300, 100, 300]);
            }
          }}
        />
      </PulseEffect>

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
      <AnimatePresence>
        {showGameIntro && (
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
        )}
      </AnimatePresence>
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
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center p-4 sm:p-8 z-50"
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
                        className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-2xl transition hover:scale-105 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative z-50 w-full max-w-xs"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <FaCamera className="text-lg sm:text-2xl" />
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
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 bg-gradient-to-br from-slate-950/80 via-slate-900/80 to-slate-950/80 text-center p-4 sm:p-8 z-50"
                  style={{ pointerEvents: 'auto' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaPlay className="text-6xl text-emerald-400" />
                  </motion.div>
                  <div className="max-w-md space-y-4 w-full px-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">鏡頭已就緒</h3>
                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                      您的鏡頭已成功連接。
                      <br />
                      物體偵測已準備就緒，點擊下方按鈕開始挑戰吧！
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                      <button
                        onClick={startSession}
                        className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-2xl transition hover:scale-105 hover:shadow-emerald-500/50 w-full max-w-xs mx-auto"
                      >
                        <FaPlay className="text-lg sm:text-2xl" />
                        開始遊戲
                      </button>

                      {/* 音效設定按鈕 */}
                      <button
                        onClick={() => setShowAudioSettings(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-all mx-auto"
                      >
                        <FaVolumeUp className="text-sm" />
                        音效設定
                      </button>

                      <p className="text-xs text-slate-500 text-center">
                        ⏱️ 時間限制：{GAME_TIME_LIMIT} 秒完成所有任務 | 每個任務 {TASK_TIMEOUT} 秒
                      </p>
                    </div>
                  </div>
                </motion.div>
                )}
              </div>

              <div className={`${isFullscreen && sessionState === 'running' ? 'absolute inset-0' : 'relative h-[70vh] min-h-[400px]'} w-full`}>
                <div className="absolute inset-x-0 top-0 flex flex-col gap-3 p-4 text-xs font-semibold uppercase tracking-widest text-slate-200 z-50">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="rounded-full bg-slate-900/80 backdrop-blur px-3 py-1.5">{currentTask?.emoji} {currentTask?.title}</span>
                    </div>
                    <div className="flex gap-2">
                      {/* 分數顯示 */}
                      <span className={`rounded-full px-3 py-1.5 backdrop-blur ${
                        playerScore <= 20
                          ? 'bg-red-900/80 text-red-200 animate-pulse'
                          : playerScore <= 50
                          ? 'bg-yellow-900/80 text-yellow-200'
                          : 'bg-slate-900/80'
                      }`}>
                        💯 {playerScore}
                      </span>

                      {/* 任務倒數計時 */}
                      <span className={`rounded-full px-3 py-1.5 backdrop-blur ${
                        taskTimeLeft <= 5
                          ? 'bg-red-900/80 text-red-200 animate-pulse'
                          : 'bg-slate-900/80'
                      }`}>
                        ⏳ {taskTimeLeft}s
                      </span>

                      {/* 總時間 */}
                      <span className={`rounded-full px-3 py-1.5 backdrop-blur ${
                        timer > GAME_TIME_LIMIT * 0.8
                          ? 'bg-red-900/80 text-red-200 animate-pulse'
                          : 'bg-slate-900/80'
                      }`}>
                        ⏱️ {formatSeconds(Math.max(0, GAME_TIME_LIMIT - timer))}
                      </span>
                    </div>
                  </div>
                  {/* 任務完成計數器 - 無限挑戰模式 */}
                  {sessionState === 'running' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">已完成任務</span>
                        <div className="flex-1 flex items-center justify-center">
                          <motion.div
                            key={totalCompleted}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                          >
                            {totalCompleted}
                          </motion.div>
                        </div>
                        <span className="text-xs text-slate-400">
                          個
                        </span>
                      </div>

                      {/* 物件偵測狀態指示器 */}
                      {detectedObject && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 bg-emerald-900/50 backdrop-blur rounded-lg px-3 py-1.5"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="text-emerald-400"
                          >
                            👁️
                          </motion.span>
                          <span className="text-xs text-emerald-200">
                            偵測到: <span className="font-bold">{detectedObject}</span>
                          </span>
                        </motion.div>
                      )}

                      {/* 偵測提示 */}
                      {!detectedObject && currentTask && (
                        <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur rounded-lg px-3 py-1.5">
                          <span className="text-slate-400 text-xs">
                            🔍 尋找: <span className="font-bold text-slate-200">{currentTask.title}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 干擾任務卡片：強制中斷 - 兔子洞特效期間不顯示 */}
                {sessionState === 'running' && isDistractedTaskActive && currentDistraction && !showRabbitHole && !showWorkingMemoryFailure && (
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

                {/* 主任務卡片 - 特效期間完全隱藏 */}
                {sessionState === 'running' && currentTask && !showRabbitHole && !showWorkingMemoryFailure && (
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
        {/* 新的結算畫面 */}
        <GameResultsScreen
          isVisible={sessionState === 'completed' || sessionState === 'failed'}
          isSuccess={sessionState === 'completed'}
          stats={{
            totalCompleted,
            totalTasks: randomTaskSequence.length,
            skippedTasks,
            adjustedTime,
            totalDistractions: distractions.length,
            totalDistractionCost,
            playerScore,
            focusLevel
          }}
          onRestart={startSession}
          onReset={resetSession}
        />
        
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
                      {totalCompleted} 個
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

      {/* 音效設定組件 */}
      <AudioSettings
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />

      {/* 死亡動畫 */}
      <DeathAnimation
        isVisible={showDeathAnimation}
        reason={deathReason}
        onComplete={() => {
          setShowDeathAnimation(false);
          // 可以在這裡觸發結算畫面
        }}
      />

      {/* 特效組件 */}
      <ParticleEffects
        isActive={particleEffect.active}
        type={particleEffect.type}
        intensity={1.5}
        position={particleEffect.position}
      />

      <BlurOverlay
        isActive={blurOverlay}
        intensity={6}
        color="rgba(0, 0, 0, 0.4)"
      />

      <DetectionSuccess
        isVisible={detectionSuccess.visible}
        position={detectionSuccess.position}
        objectName={detectionSuccess.objectName}
      />
    </div>
    </ScreenShake>
  );
}