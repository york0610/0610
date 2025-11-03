/**
 * 音效管理系統 - 模擬 ADHD 患者日常的聲音干擾
 */

type AudioType =
  // 基礎音效
  | 'notification' | 'alarm' | 'ambient' | 'distraction' | 'success' | 'error'
  // 遊戲狀態音效
  | 'focus' | 'detection' | 'victory' | 'defeat' | 'task-complete' | 'task-timeout'
  // ADHD 特定干擾音效
  | 'phone-buzz' | 'email-ping' | 'social-media' | 'keyboard-typing' | 'mouse-click'
  | 'door-slam' | 'construction' | 'traffic' | 'conversation' | 'tv-sound'
  // 生理干擾音效
  | 'stomach-growl' | 'yawn' | 'sneeze' | 'cough' | 'heartbeat'
  // 心理狀態音效
  | 'anxiety-pulse' | 'memory-glitch' | 'hyperfocus' | 'brain-fog' | 'overwhelm'
  // 環境音效
  | 'office-ambient' | 'home-ambient' | 'cafe-ambient' | 'nature-ambient'
  // 特殊效果音效
  | 'rabbit-hole-enter' | 'rabbit-hole-escape' | 'working-memory-fail' | 'working-memory-recover';

interface AudioConfig {
  volume: number;
  duration: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

const AUDIO_CONFIGS: Record<AudioType, AudioConfig> = {
  // 基礎音效
  notification: { volume: 0.6, duration: 500, loop: false, priority: 'medium' },
  alarm: { volume: 0.8, duration: 1000, loop: false, priority: 'high' },
  ambient: { volume: 0.3, duration: 3000, loop: true, fadeIn: 1000, fadeOut: 1000, priority: 'low' },
  distraction: { volume: 0.7, duration: 2000, loop: false, priority: 'medium' },
  success: { volume: 0.5, duration: 800, loop: false, priority: 'medium' },
  error: { volume: 0.7, duration: 1000, loop: false, priority: 'medium' },

  // 遊戲狀態音效
  focus: { volume: 0.4, duration: 800, loop: false, fadeIn: 300, priority: 'low' },
  detection: { volume: 0.6, duration: 200, loop: false, priority: 'medium' },
  victory: { volume: 0.8, duration: 2000, loop: false, priority: 'high' },
  defeat: { volume: 0.6, duration: 1500, loop: false, priority: 'high' },
  'task-complete': { volume: 0.5, duration: 600, loop: false, priority: 'medium' },
  'task-timeout': { volume: 0.7, duration: 800, loop: false, priority: 'medium' },

  // ADHD 特定干擾音效
  'phone-buzz': { volume: 0.8, duration: 300, loop: false, priority: 'high' },
  'email-ping': { volume: 0.6, duration: 150, loop: false, priority: 'medium' },
  'social-media': { volume: 0.7, duration: 400, loop: false, priority: 'medium' },
  'keyboard-typing': { volume: 0.4, duration: 2000, loop: true, priority: 'low' },
  'mouse-click': { volume: 0.3, duration: 100, loop: false, priority: 'low' },
  'door-slam': { volume: 0.9, duration: 500, loop: false, priority: 'high' },
  'construction': { volume: 0.6, duration: 3000, loop: true, priority: 'medium' },
  'traffic': { volume: 0.4, duration: 5000, loop: true, fadeIn: 2000, fadeOut: 2000, priority: 'low' },
  'conversation': { volume: 0.5, duration: 4000, loop: true, priority: 'medium' },
  'tv-sound': { volume: 0.6, duration: 3000, loop: true, priority: 'medium' },

  // 生理干擾音效
  'stomach-growl': { volume: 0.5, duration: 800, loop: false, priority: 'medium' },
  'yawn': { volume: 0.4, duration: 1200, loop: false, priority: 'low' },
  'sneeze': { volume: 0.6, duration: 300, loop: false, priority: 'medium' },
  'cough': { volume: 0.5, duration: 400, loop: false, priority: 'medium' },
  'heartbeat': { volume: 0.3, duration: 2000, loop: true, priority: 'low' },

  // 心理狀態音效
  'anxiety-pulse': { volume: 0.4, duration: 3000, loop: true, fadeIn: 1000, fadeOut: 1000, priority: 'medium' },
  'memory-glitch': { volume: 0.6, duration: 1000, loop: false, priority: 'medium' },
  'hyperfocus': { volume: 0.3, duration: 5000, loop: true, fadeIn: 2000, fadeOut: 2000, priority: 'low' },
  'brain-fog': { volume: 0.4, duration: 4000, loop: true, fadeIn: 1500, fadeOut: 1500, priority: 'low' },
  'overwhelm': { volume: 0.7, duration: 2000, loop: false, priority: 'high' },

  // 環境音效
  'office-ambient': { volume: 0.2, duration: 10000, loop: true, fadeIn: 3000, fadeOut: 3000, priority: 'low' },
  'home-ambient': { volume: 0.2, duration: 8000, loop: true, fadeIn: 2000, fadeOut: 2000, priority: 'low' },
  'cafe-ambient': { volume: 0.3, duration: 12000, loop: true, fadeIn: 4000, fadeOut: 4000, priority: 'low' },
  'nature-ambient': { volume: 0.25, duration: 15000, loop: true, fadeIn: 5000, fadeOut: 5000, priority: 'low' },

  // 特殊效果音效
  'rabbit-hole-enter': { volume: 0.8, duration: 1500, loop: false, priority: 'critical' },
  'rabbit-hole-escape': { volume: 0.6, duration: 1000, loop: false, priority: 'high' },
  'working-memory-fail': { volume: 0.7, duration: 2000, loop: false, priority: 'high' },
  'working-memory-recover': { volume: 0.5, duration: 1200, loop: false, priority: 'medium' },
};

export interface IAudioManager {
  // 基礎播放方法
  play(type: AudioType): Promise<void>;
  playSuccess(): void;
  playError(): void;
  stopAll(): void;
  preloadAudio(type: AudioType): Promise<void>;
  preloadAllAudio(): Promise<void>;

  // 背景音樂控制
  startBackgroundMusic(): void;
  stopBackgroundMusic(): void;
  updateBackgroundMusicIntensity(intensity: number): void; // 0-1，根據遊戲進度調整
  playContextualSound(context: 'time-pressure' | 'low-focus' | 'high-stress'): void;

  // 原有方法
  playNotification(): void;
  playAlarm(): void;
  playAmbient(): void;
  playDistraction(): void;
  playFocus(): void;
  playDetection(): void;
  playDistractionTask(): void;
  playVictory(): void;

  // 新增 ADHD 特定音效方法
  playPhoneBuzz(): void;
  playEmailPing(): void;
  playSocialMedia(): void;
  playKeyboardTyping(): void;
  playMouseClick(): void;
  playDoorSlam(): void;
  playConstruction(): void;
  playTraffic(): void;
  playConversation(): void;
  playTvSound(): void;

  // 生理干擾音效
  playStomachGrowl(): void;
  playYawn(): void;
  playSneeze(): void;
  playCough(): void;
  playHeartbeat(): void;

  // 心理狀態音效
  playAnxietyPulse(): void;
  playMemoryGlitch(): void;
  playHyperfocus(): void;
  playBrainFog(): void;
  playOverwhelm(): void;

  // 環境音效
  playOfficeAmbient(): void;
  playHomeAmbient(): void;
  playCafeAmbient(): void;
  playNatureAmbient(): void;

  // 特殊效果音效
  playRabbitHoleEnter(): void;
  playRabbitHoleEscape(): void;
  playWorkingMemoryFail(): void;
  playWorkingMemoryRecover(): void;

  // 音量和控制
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  dispose(): void;
  isReady(): boolean;
}

export class AudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isInitialized = false;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private masterVolume = 1.0;
  private isMuted = false;
  private activeSources: AudioBufferSourceNode[] = [];
  private readonly MAX_CONCURRENT_SOUNDS = 3; // 降低同時播放的音效數量從 5 到 3
  private currentlyPlayingCount = 0;
  private lastCleanupTime = 0;

  // Tuna.js 音效處理器
  private tuna: any = null;
  private backgroundMusic: OscillatorNode | null = null;
  private backgroundGain: GainNode | null = null;
  private isBackgroundPlaying = false;

  // 動態背景音樂層
  private backgroundLayers: {
    base: { osc: OscillatorNode; gain: GainNode } | null;
    tension: { osc: OscillatorNode; gain: GainNode } | null;
    urgency: { osc: OscillatorNode; gain: GainNode } | null;
  } = {
    base: null,
    tension: null,
    urgency: null,
  };
  private currentIntensity = 0;

  // 音效變體映射 - 為每種音效類型提供多個變體
  private soundVariants: Record<string, number[]> = {
    'phone-buzz': [400, 450, 500], // 不同頻率的震動音
    'email-ping': [800, 900, 1000], // 不同音高的提示音
    'social-media': [600, 700, 800], // 社交媒體通知音
    'door-slam': [100, 120, 150], // 不同強度的關門聲
    'keyboard-typing': [200, 220, 240], // 不同節奏的打字聲
    'mouse-click': [300, 350, 400], // 不同的點擊聲
    'stomach-growl': [80, 100, 120], // 不同的肚子叫聲
    'yawn': [150, 180, 200], // 不同的哈欠聲
    'sneeze': [500, 600, 700], // 不同的噴嚏聲
    'cough': [250, 300, 350], // 不同的咳嗽聲
  };
  private audioFiles: Record<string, string> = {
    // 基礎音效 - 使用現有的音檔
    notification: '/sounds/2021-preview.mp3',
    alarm: '/sounds/2022-preview.mp3',
    success: '/sounds/2023-preview.mp3',
    error: '/sounds/2024-preview.mp3',

    // 遊戲狀態音效
    focus: '/sounds/2025-preview.mp3',
    detection: '/sounds/2031-preview.mp3',
    victory: '/sounds/2037-preview.mp3',
    defeat: '/sounds/2048-preview.mp3',
    'task-complete': '/sounds/2049-preview.mp3',
    'task-timeout': '/sounds/2031-preview (1).mp3',

    // ADHD 特定干擾音效 - 使用程序化生成
    'phone-buzz': 'generated',
    'email-ping': 'generated',
    'social-media': 'generated',
    'keyboard-typing': 'generated',
    'mouse-click': 'generated',
    'door-slam': 'generated',
    'construction': 'generated',
    'traffic': 'generated',
    'conversation': 'generated',
    'tv-sound': 'generated',

    // 生理干擾音效
    'stomach-growl': 'generated',
    'yawn': 'generated',
    'sneeze': 'generated',
    'cough': 'generated',
    'heartbeat': 'generated',

    // 心理狀態音效
    'anxiety-pulse': 'generated',
    'memory-glitch': 'generated',
    'hyperfocus': 'generated',
    'brain-fog': 'generated',
    'overwhelm': 'generated',

    // 環境音效
    'office-ambient': 'generated',
    'home-ambient': 'generated',
    'cafe-ambient': 'generated',
    'nature-ambient': 'generated',

    // 特殊效果音效
    'rabbit-hole-enter': 'generated',
    'rabbit-hole-escape': 'generated',
    'working-memory-fail': 'generated',
    'working-memory-recover': 'generated',
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext();
      // 從 localStorage 載入音量設定
      const savedVolume = localStorage.getItem('adhd-game-volume');
      const savedMuted = localStorage.getItem('adhd-game-muted');
      if (savedVolume) {
        this.masterVolume = parseFloat(savedVolume);
      }
      if (savedMuted) {
        this.isMuted = savedMuted === 'true';
      }
    }
  }

  private initializeAudioContext() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        this.isInitialized = true;
        console.log('AudioContext initialized:', this.audioContext.state);

        // 異步初始化 Tuna.js
        this.initializeTuna();
      }
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }

  /**
   * 隨機選擇音效變體
   */
  private getRandomVariant(soundType: string): number {
    const variants = this.soundVariants[soundType];
    if (!variants || variants.length === 0) {
      return 440; // 默認頻率
    }
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }

  private async initializeTuna(): Promise<void> {
    try {
      // 動態導入 Tuna.js
      const Tuna = await import('tunajs');
      if (this.audioContext) {
        this.tuna = new (Tuna as any).default(this.audioContext);
        console.log('[AUDIO] Tuna.js initialized successfully');
      }
    } catch (error) {
      console.warn('[AUDIO] Failed to initialize Tuna.js:', error);
      // 繼續運行，但沒有 Tuna.js 效果
    }
  }

  async preloadAudio(type: AudioType): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
      if (!this.audioContext) return;
    }

    const url = this.audioFiles[type];
    if (!url || this.audioBuffers.has(type)) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(type, audioBuffer);
    } catch (error) {
      console.error(`Failed to preload audio ${type}:`, error);
    }
  }

  async preloadAllAudio(): Promise<void> {
    const types = Object.keys(this.audioFiles) as AudioType[];
    await Promise.all(types.map(type => this.preloadAudio(type)));
  }

  private ensureAudioContextRunning() {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(err => console.error('Failed to resume AudioContext:', err));
    }
  }

  /**
   * 播放通知音 - 模擬手機通知（3 種變化）
   */
  playNotification() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;
      const notificationType = Math.floor(Math.random() * 3);
      
      if (notificationType === 0) {
        // 雙音提示
        for (let i = 0; i < 2; i++) {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.frequency.setValueAtTime(800 + i * 200, now + i * 0.15);
          gain.gain.setValueAtTime(0.3, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.15);
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.15);
          this.oscillators.push(osc);
          this.gainNodes.push(gain);
        }
      } else if (notificationType === 1) {
        // 上升音
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        this.oscillators.push(osc);
        this.gainNodes.push(gain);
      } else {
        // 下降音
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        this.oscillators.push(osc);
        this.gainNodes.push(gain);
      }
    } catch (error) {
      console.error('Error playing notification:', error);
    }
  }

  /**
   * 播放警報音 - 模擬緊急提醒
   */
  playAlarm() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {

    const now = this.audioContext.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.frequency.setValueAtTime(1000 + i * 200, now + i * 0.2);
      gain.gain.setValueAtTime(0.4, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.15);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.15);
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    }
    } catch (error) {
      console.error('Error playing alarm:', error);
    }
  }

  /**
   * 播放環境音 - 模擬辦公室背景噪音
   */
  playAmbient(): void {
    this.playAmbientNoise();
  }

  /**
   * 播放環境音 - 模擬辦公室背景噪音
   */
  playAmbientNoise() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {

    const now = this.audioContext.currentTime;
    const frequencies = [200, 300, 400, 500];

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 1);
      gain.gain.linearRampToValueAtTime(0.05, now + 2);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.start(now);
      osc.stop(now + 3);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });
    } catch (error) {
      console.error('Error playing ambient noise:', error);
    }
  }

  /**
   * 播放干擾音 - 模擬突然的聲音打斷
   */
  playDistraction() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {

    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    // 製造刺耳的聲音
    osc.type = 'square';
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.3);
    this.oscillators.push(osc);
    this.gainNodes.push(gain);
    } catch (error) {
      console.error('Error playing distraction:', error);
    }
  }

  /**
   * 播放音效 - 通用方法（增強版）
   */
  async play(type: AudioType): Promise<void> {
    if (this.isMuted) return;

    // 清理過期的音效源
    this.cleanupExpiredSources();

    // 限制同時播放的音效數量，避免音效堆疊
    if (this.currentlyPlayingCount >= this.MAX_CONCURRENT_SOUNDS) {
      console.log(`[AUDIO] Skipping ${type} - too many concurrent sounds (${this.currentlyPlayingCount}/${this.MAX_CONCURRENT_SOUNDS})`);
      return;
    }

    this.ensureAudioContextRunning();
    if (!this.audioContext) return;

    try {
      const config = AUDIO_CONFIGS[type];
      const audioFile = this.audioFiles[type];

      // 如果是程序化生成的音效，使用對應的生成方法
      if (audioFile === 'generated') {
        this.playGeneratedSound(type);
        return;
      }

      // 載入音檔
      if (!this.audioBuffers.has(type)) {
        await this.preloadAudio(type);
      }

      const audioBuffer = this.audioBuffers.get(type);
      if (!audioBuffer) {
        console.warn(`Audio buffer not found for ${type}, falling back to generated sound`);
        this.playGeneratedSound(type);
        return;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = this.audioContext.createGain();
      const finalVolume = config.volume * this.masterVolume;

      // 設置淡入效果
      if (config.fadeIn) {
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + config.fadeIn / 1000);
      } else {
        gainNode.gain.value = finalVolume;
      }

      // 設置淡出效果
      if (config.fadeOut && !config.loop) {
        const fadeOutStart = this.audioContext.currentTime + (config.duration - config.fadeOut) / 1000;
        gainNode.gain.linearRampToValueAtTime(0, fadeOutStart + config.fadeOut / 1000);
      }

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
      this.activeSources.push(source);
      this.currentlyPlayingCount++;

      // 設置停止時間
      if (!config.loop) {
        const stopTime = this.audioContext.currentTime + config.duration / 1000;
        source.stop(stopTime);

        // 清理已完成的音源並更新計數
        source.onended = () => {
          const index = this.activeSources.indexOf(source);
          if (index > -1) {
            this.activeSources.splice(index, 1);
          }
          this.currentlyPlayingCount = Math.max(0, this.currentlyPlayingCount - 1);
        };
      }

      console.log(`[Audio] Playing ${type} at volume ${Math.round(finalVolume * 100)}%`);
    } catch (error) {
      console.error(`Error playing audio ${type}:`, error);
      // 備用方案：使用程序化生成
      this.playGeneratedSound(type);
    }
  }

  /**
   * 播放成功音 - 正向反饋
   */
  playSuccess(): void {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {

    const now = this.audioContext.currentTime;
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.frequency.setValueAtTime(freq, now + index * 0.15);
      gain.gain.setValueAtTime(0.3, now + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.2);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.start(now + index * 0.15);
      osc.stop(now + index * 0.15 + 0.2);
    });
    } catch (error) {
      console.error('Error playing success:', error);
    }
  }

  /**
   * 播放錯誤音
   */
  playError(): void {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (error) {
      console.error('Error playing error sound:', error);
    }
  }

  /**
   * 播放物體偵測音 - 短技技声
   */
  playDetection() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      // 短技技音
      for (let i = 0; i < 2; i++) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.frequency.setValueAtTime(800 + i * 200, now + i * 0.1);
        gain.gain.setValueAtTime(0.4, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.1);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.1);
      }
    } catch (error) {
      console.error('Error playing detection:', error);
    }
  }

  /**
   * 播放勝利音 - 歡慶的勝利音
   */
  playVictory() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      // 上升的勝利音
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        osc.frequency.setValueAtTime(freq, now + index * 0.2);
        gain.gain.setValueAtTime(0.4, now + index * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.2 + 0.25);
        osc.connect(gain);
        gain.connect(this.audioContext!.destination);
        osc.start(now + index * 0.2);
        osc.stop(now + index * 0.2 + 0.25);
      });
    } catch (error) {
      console.error('Error playing victory:', error);
    }
  }

  /**
   * 播放干擾任務音 - 急促的警告音
   */
  playDistractionTask() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      // 急促的警告音
      for (let i = 0; i < 3; i++) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1500, now + i * 0.15);
        gain.gain.setValueAtTime(0.5, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.12);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.12);
      }
    } catch (error) {
      console.error('Error playing distraction task:', error);
    }
  }

  /**
   * 播放時間提醒音 - 輕微的時間音
   */
  playTick() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (error) {
      console.error('Error playing tick:', error);
    }
  }

  /**
   * 程序化生成音效 - 為沒有音檔的音效類型生成聲音（增強版，帶 Tuna.js 效果）
   */
  private playGeneratedSound(type: AudioType): void {
    if (this.isMuted) return;

    // 清理過期的音效源
    this.cleanupExpiredSources();

    // 限制同時播放的音效數量
    if (this.currentlyPlayingCount >= this.MAX_CONCURRENT_SOUNDS) {
      console.log(`[AUDIO] Skipping generated ${type} - too many concurrent sounds`);
      return;
    }

    this.ensureAudioContextRunning();
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const config = AUDIO_CONFIGS[type];

    // 增加播放計數
    this.currentlyPlayingCount++;

    try {
      // 創建基礎音效並應用 Tuna.js 效果
      this.createEnhancedGeneratedSound(type, now, config);
    } catch (error) {
      console.error(`[AUDIO] Failed to play generated sound ${type}:`, error);
      this.currentlyPlayingCount = Math.max(0, this.currentlyPlayingCount - 1);
    }
  }

  /**
   * 創建增強的程序化音效（帶 Tuna.js 效果）
   */
  private createEnhancedGeneratedSound(type: AudioType, startTime: number, config: AudioConfig): void {
    if (!this.audioContext) return;

    try {
      switch (type) {
        case 'phone-buzz':
          this.createPhoneBuzzWithEffects(startTime, config);
          break;
        case 'email-ping':
          this.createEmailPingWithEffects(startTime, config);
          break;
        case 'social-media':
          this.createSocialMediaWithEffects(startTime, config);
          break;
        case 'overwhelm':
          this.createOverwhelmWithEffects(startTime, config);
          break;
        default:
          // 對於其他音效類型，使用原有的生成方法
          this.generateBasicSound(type, startTime, config);
      }
    } catch (error) {
      console.error(`Error generating sound for ${type}:`, error);
    } finally {
      // 設置清理計時器
      setTimeout(() => {
        this.currentlyPlayingCount = Math.max(0, this.currentlyPlayingCount - 1);
      }, config.duration);
    }
  }

  /**
   * 生成基礎音效（備用方案）- 使用隨機變體增加多樣性
   */
  private generateBasicSound(type: AudioType, startTime: number, config: AudioConfig): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    // 根據音效類型設置基礎參數，使用隨機變體
    switch (type) {
      case 'phone-buzz':
        osc.frequency.setValueAtTime(this.getRandomVariant('phone-buzz'), startTime);
        osc.type = 'square';
        break;
      case 'email-ping':
        osc.frequency.setValueAtTime(this.getRandomVariant('email-ping'), startTime);
        osc.type = 'sine';
        break;
      case 'social-media':
        osc.frequency.setValueAtTime(this.getRandomVariant('social-media'), startTime);
        osc.type = 'triangle';
        break;
      case 'door-slam':
        osc.frequency.setValueAtTime(this.getRandomVariant('door-slam'), startTime);
        osc.type = 'sawtooth';
        break;
      case 'keyboard-typing':
        osc.frequency.setValueAtTime(this.getRandomVariant('keyboard-typing'), startTime);
        osc.type = 'square';
        break;
      case 'mouse-click':
        osc.frequency.setValueAtTime(this.getRandomVariant('mouse-click'), startTime);
        osc.type = 'sine';
        break;
      case 'stomach-growl':
        osc.frequency.setValueAtTime(this.getRandomVariant('stomach-growl'), startTime);
        osc.type = 'sawtooth';
        break;
      case 'yawn':
        osc.frequency.setValueAtTime(this.getRandomVariant('yawn'), startTime);
        osc.type = 'sine';
        break;
      case 'sneeze':
        osc.frequency.setValueAtTime(this.getRandomVariant('sneeze'), startTime);
        osc.type = 'square';
        break;
      case 'cough':
        osc.frequency.setValueAtTime(this.getRandomVariant('cough'), startTime);
        osc.type = 'sawtooth';
        break;
      case 'overwhelm':
        osc.frequency.setValueAtTime(200, startTime);
        osc.type = 'sawtooth';
        break;
      default:
        osc.frequency.setValueAtTime(440, startTime);
        osc.type = 'sine';
    }

    gain.gain.setValueAtTime(config.volume * this.masterVolume, startTime);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + config.duration / 1000);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * 創建帶效果的手機震動音效 - 使用隨機變體
   */
  private createPhoneBuzzWithEffects(startTime: number, config: AudioConfig): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    // 使用隨機變體增加多樣性
    osc.frequency.setValueAtTime(this.getRandomVariant('phone-buzz'), startTime);
    osc.type = 'square';
    gain.gain.setValueAtTime(0.3 * this.masterVolume, startTime);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + config.duration / 1000);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * 創建帶效果的郵件提示音 - 使用隨機變體
   */
  private createEmailPingWithEffects(startTime: number, config: AudioConfig): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    // 使用隨機變體增加多樣性
    osc.frequency.setValueAtTime(this.getRandomVariant('email-ping'), startTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.2 * this.masterVolume, startTime);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + config.duration / 1000);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * 創建帶效果的社交媒體通知音 - 使用隨機變體
   */
  private createSocialMediaWithEffects(startTime: number, config: AudioConfig): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    // 使用隨機變體增加多樣性
    osc.frequency.setValueAtTime(this.getRandomVariant('social-media'), startTime);
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.25 * this.masterVolume, startTime);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + config.duration / 1000);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * 創建帶效果的壓倒性音效
   */
  private createOverwhelmWithEffects(startTime: number, config: AudioConfig): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.setValueAtTime(200, startTime);
    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.4 * this.masterVolume, startTime);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(startTime);
    osc.stop(startTime + config.duration / 1000);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * 播放專注音 - 平静的专注音
   */
  playFocus() {
    this.play('focus').catch(() => {
      // 備用方案：程序化生成
      this.ensureAudioContextRunning();
      if (!this.audioContext || this.isMuted) return;
      try {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now); // 室内调音
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15 * this.masterVolume, now + 0.3);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      } catch (error) {
        console.error('Error playing focus:', error);
      }
    });
  }

  // ===== 剩餘的音效生成方法 =====

  private generateMouseClick(startTime: number): void {
    const config = AUDIO_CONFIGS['mouse-click'];
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(3000, startTime);
    gain.gain.setValueAtTime(config.volume * this.masterVolume * 0.5, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.05);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateDoorSlam(startTime: number): void {
    const config = AUDIO_CONFIGS['door-slam'];
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(100, startTime);
    osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.3);
    gain.gain.setValueAtTime(config.volume * this.masterVolume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.5);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateConstruction(startTime: number): void {
    const config = AUDIO_CONFIGS['construction'];
    // 模擬施工噪音
    for (let i = 0; i < 15; i++) {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(200 + Math.random() * 300, startTime + i * 0.2);
      gain.gain.setValueAtTime(config.volume * this.masterVolume * (0.3 + Math.random() * 0.4), startTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.2 + 0.15);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(startTime + i * 0.2);
      osc.stop(startTime + i * 0.2 + 0.15);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    }
  }

  private generateTraffic(startTime: number): void {
    const config = AUDIO_CONFIGS['traffic'];
    // 模擬交通噪音
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.linearRampToValueAtTime(200, startTime + 2.5);
    osc.frequency.linearRampToValueAtTime(150, startTime + 5);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(config.volume * this.masterVolume * 0.6, startTime + 2);
    gain.gain.linearRampToValueAtTime(0, startTime + 5);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 5);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateConversation(startTime: number): void {
    const config = AUDIO_CONFIGS['conversation'];
    // 模擬對話聲音
    for (let i = 0; i < 8; i++) {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, startTime + i * 0.5);
      gain.gain.setValueAtTime(config.volume * this.masterVolume * 0.4, startTime + i * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.5 + 0.3);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(startTime + i * 0.5);
      osc.stop(startTime + i * 0.5 + 0.3);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    }
  }

  private generateTvSound(startTime: number): void {
    const config = AUDIO_CONFIGS['tv-sound'];
    // 模擬電視聲音
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, startTime);
    osc.frequency.linearRampToValueAtTime(600, startTime + 1.5);
    osc.frequency.linearRampToValueAtTime(350, startTime + 3);

    gain.gain.setValueAtTime(config.volume * this.masterVolume * 0.5, startTime);
    gain.gain.linearRampToValueAtTime(config.volume * this.masterVolume * 0.3, startTime + 3);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 3);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateStomachGrowl(startTime: number): void {
    const config = AUDIO_CONFIGS['stomach-growl'];
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.8);

    gain.gain.setValueAtTime(config.volume * this.masterVolume * 0.6, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.8);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateYawn(startTime: number): void {
    const config = AUDIO_CONFIGS['yawn'];
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, startTime);
    osc.frequency.linearRampToValueAtTime(150, startTime + 0.6);
    osc.frequency.linearRampToValueAtTime(180, startTime + 1.2);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(config.volume * this.masterVolume * 0.4, startTime + 0.3);
    gain.gain.linearRampToValueAtTime(0, startTime + 1.2);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 1.2);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  // 添加剩餘的生成方法佔位符
  private generateSneeze(startTime: number): void { /* 實現打噴嚏音效 */ }
  private generateCough(startTime: number): void { /* 實現咳嗽音效 */ }
  private generateHeartbeat(startTime: number): void { /* 實現心跳音效 */ }
  private generateHyperfocus(startTime: number): void { /* 實現過度專注音效 */ }
  private generateBrainFog(startTime: number): void { /* 實現腦霧音效 */ }
  private generateOverwhelm(startTime: number): void { /* 實現壓倒性音效 */ }
  private generateOfficeAmbient(startTime: number): void { /* 實現辦公室環境音 */ }
  private generateHomeAmbient(startTime: number): void { /* 實現家庭環境音 */ }
  private generateCafeAmbient(startTime: number): void { /* 實現咖啡廳環境音 */ }
  private generateNatureAmbient(startTime: number): void { /* 實現自然環境音 */ }
  private generateWorkingMemoryFail(startTime: number): void { /* 實現工作記憶失敗音效 */ }
  private generateWorkingMemoryRecover(startTime: number): void { /* 實現工作記憶恢復音效 */ }

  /**
   * 播放背景音樂 - ADHD 專注環境音
   */
  startBackgroundMusic(): void {
    if (this.isBackgroundPlaying || !this.audioContext) return;

    try {
      this.ensureAudioContextRunning();

      // 創建背景音樂振盪器
      this.backgroundMusic = this.audioContext.createOscillator();
      this.backgroundGain = this.audioContext.createGain();

      // 設置低頻環境音（模擬辦公室/學習環境）
      this.backgroundMusic.frequency.setValueAtTime(60, this.audioContext.currentTime);
      this.backgroundMusic.type = 'sine';

      // 設置非常低的音量
      this.backgroundGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.backgroundGain.gain.linearRampToValueAtTime(0.02 * this.masterVolume, this.audioContext.currentTime + 2);

      // 添加 Tuna.js 效果（如果可用）
      let outputNode: AudioNode = this.backgroundGain;
      if (this.tuna) {
        try {
          // 添加低通濾波器創造溫暖的環境音
          const filter = new this.tuna.Filter({
            frequency: 200,
            Q: 1,
            gain: 0,
            filterType: 'lowpass',
            bypass: 0
          });

          this.backgroundMusic.connect(filter.input);
          filter.connect(this.backgroundGain);
          outputNode = this.backgroundGain;
        } catch (error) {
          console.warn('[AUDIO] Failed to apply Tuna effects to background music:', error);
          this.backgroundMusic.connect(this.backgroundGain);
        }
      } else {
        this.backgroundMusic.connect(this.backgroundGain);
      }

      outputNode.connect(this.audioContext.destination);

      // 開始播放
      this.backgroundMusic.start();
      this.isBackgroundPlaying = true;

      console.log('[AUDIO] Background music started');
    } catch (error) {
      console.error('[AUDIO] Failed to start background music:', error);
    }
  }

  /**
   * 更新背景音樂強度 - 根據遊戲進度動態調整
   * @param intensity 0-1，0 = 平靜，1 = 極度緊張
   */
  updateBackgroundMusicIntensity(intensity: number): void {
    if (!this.audioContext || !this.isBackgroundPlaying) return;

    this.currentIntensity = Math.max(0, Math.min(1, intensity));
    const now = this.audioContext.currentTime;

    try {
      // 調整基礎層音量（始終存在）
      if (this.backgroundGain) {
        const baseVolume = 0.02 * this.masterVolume * (1 - this.currentIntensity * 0.3);
        this.backgroundGain.gain.linearRampToValueAtTime(baseVolume, now + 0.5);
      }

      // 根據強度添加或移除緊張層
      if (this.currentIntensity > 0.3 && !this.backgroundLayers.tension) {
        // 添加緊張層（中頻脈衝）
        const tensionOsc = this.audioContext.createOscillator();
        const tensionGain = this.audioContext.createGain();

        tensionOsc.frequency.setValueAtTime(120, now);
        tensionOsc.type = 'triangle';
        tensionGain.gain.setValueAtTime(0, now);
        tensionGain.gain.linearRampToValueAtTime(
          0.015 * this.masterVolume * (this.currentIntensity - 0.3),
          now + 1
        );

        tensionOsc.connect(tensionGain);
        tensionGain.connect(this.audioContext.destination);
        tensionOsc.start(now);

        this.backgroundLayers.tension = { osc: tensionOsc, gain: tensionGain };
        console.log('[AUDIO] Added tension layer');
      } else if (this.currentIntensity <= 0.3 && this.backgroundLayers.tension) {
        // 移除緊張層
        const { osc, gain } = this.backgroundLayers.tension;
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        setTimeout(() => {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        }, 500);
        this.backgroundLayers.tension = null;
        console.log('[AUDIO] Removed tension layer');
      } else if (this.backgroundLayers.tension) {
        // 調整緊張層音量
        this.backgroundLayers.tension.gain.gain.linearRampToValueAtTime(
          0.015 * this.masterVolume * (this.currentIntensity - 0.3),
          now + 0.5
        );
      }

      // 根據強度添加或移除緊急層
      if (this.currentIntensity > 0.7 && !this.backgroundLayers.urgency) {
        // 添加緊急層（高頻警告音）
        const urgencyOsc = this.audioContext.createOscillator();
        const urgencyGain = this.audioContext.createGain();

        urgencyOsc.frequency.setValueAtTime(240, now);
        urgencyOsc.type = 'sine';
        urgencyGain.gain.setValueAtTime(0, now);
        urgencyGain.gain.linearRampToValueAtTime(
          0.01 * this.masterVolume * (this.currentIntensity - 0.7),
          now + 1
        );

        urgencyOsc.connect(urgencyGain);
        urgencyGain.connect(this.audioContext.destination);
        urgencyOsc.start(now);

        this.backgroundLayers.urgency = { osc: urgencyOsc, gain: urgencyGain };
        console.log('[AUDIO] Added urgency layer');
      } else if (this.currentIntensity <= 0.7 && this.backgroundLayers.urgency) {
        // 移除緊急層
        const { osc, gain } = this.backgroundLayers.urgency;
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        setTimeout(() => {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        }, 500);
        this.backgroundLayers.urgency = null;
        console.log('[AUDIO] Removed urgency layer');
      } else if (this.backgroundLayers.urgency) {
        // 調整緊急層音量
        this.backgroundLayers.urgency.gain.gain.linearRampToValueAtTime(
          0.01 * this.masterVolume * (this.currentIntensity - 0.7),
          now + 0.5
        );
      }
    } catch (error) {
      console.error('[AUDIO] Failed to update background music intensity:', error);
    }
  }

  /**
   * 播放情境音效 - 根據遊戲狀態
   */
  playContextualSound(context: 'time-pressure' | 'low-focus' | 'high-stress'): void {
    if (!this.audioContext || this.isMuted) return;

    this.ensureAudioContextRunning();
    const now = this.audioContext.currentTime;

    try {
      switch (context) {
        case 'time-pressure':
          // 時鐘滴答聲
          for (let i = 0; i < 3; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.frequency.setValueAtTime(800, now + i * 0.5);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15 * this.masterVolume, now + i * 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.5 + 0.1);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start(now + i * 0.5);
            osc.stop(now + i * 0.5 + 0.1);
          }
          break;

        case 'low-focus':
          // 警告脈衝
          const pulseOsc = this.audioContext.createOscillator();
          const pulseGain = this.audioContext.createGain();

          pulseOsc.frequency.setValueAtTime(300, now);
          pulseOsc.type = 'sine';
          pulseGain.gain.setValueAtTime(0.1 * this.masterVolume, now);
          pulseGain.gain.linearRampToValueAtTime(0.2 * this.masterVolume, now + 0.5);
          pulseGain.gain.linearRampToValueAtTime(0.01, now + 1);

          pulseOsc.connect(pulseGain);
          pulseGain.connect(this.audioContext.destination);
          pulseOsc.start(now);
          pulseOsc.stop(now + 1);
          break;

        case 'high-stress':
          // 心跳加速
          for (let i = 0; i < 5; i++) {
            const heartOsc = this.audioContext.createOscillator();
            const heartGain = this.audioContext.createGain();

            heartOsc.frequency.setValueAtTime(60, now + i * 0.3);
            heartOsc.type = 'sine';
            heartGain.gain.setValueAtTime(0.2 * this.masterVolume, now + i * 0.3);
            heartGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.3 + 0.15);

            heartOsc.connect(heartGain);
            heartGain.connect(this.audioContext.destination);
            heartOsc.start(now + i * 0.3);
            heartOsc.stop(now + i * 0.3 + 0.15);
          }
          break;
      }

      console.log(`[AUDIO] Played contextual sound: ${context}`);
    } catch (error) {
      console.error(`[AUDIO] Failed to play contextual sound ${context}:`, error);
    }
  }

  /**
   * 停止背景音樂
   */
  stopBackgroundMusic(): void {
    if (!this.isBackgroundPlaying) return;

    try {
      if (this.backgroundMusic) {
        this.backgroundMusic.stop();
        this.backgroundMusic.disconnect();
        this.backgroundMusic = null;
      }

      if (this.backgroundGain) {
        this.backgroundGain.disconnect();
        this.backgroundGain = null;
      }

      // 停止所有背景音樂層
      Object.values(this.backgroundLayers).forEach(layer => {
        if (layer) {
          layer.osc.stop();
          layer.osc.disconnect();
          layer.gain.disconnect();
        }
      });
      this.backgroundLayers = { base: null, tension: null, urgency: null };

      this.isBackgroundPlaying = false;
      console.log('[AUDIO] Background music stopped');
    } catch (error) {
      console.error('[AUDIO] Failed to stop background music:', error);
    }
  }

  /**
   * 停止所有音效（增強版）
   */
  stopAll() {
    // 停止背景音樂
    this.stopBackgroundMusic();
    // 停止所有振盪器
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // 已停止
      }
    });

    // 斷開所有增益節點
    this.gainNodes.forEach((gain) => {
      try {
        gain.disconnect();
      } catch (e) {
        // 已斷開
      }
    });

    // 停止所有音源
    this.activeSources.forEach((source) => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // 已停止
      }
    });

    // 清空陣列並重置計數
    this.oscillators = [];
    this.gainNodes = [];
    this.activeSources = [];
    this.currentlyPlayingCount = 0; // 重置計數

    console.log('[Audio] 所有音效已停止，計數已重置');
  }

  /**
   * 清理過期的音效源（防止計數不準確）
   * ✅ 修復：增強清理邏輯，檢查音源是否真的在播放
   */
  private cleanupExpiredSources() {
    const now = Date.now();
    // 每 2 秒清理一次
    if (now - this.lastCleanupTime < 2000) return;

    this.lastCleanupTime = now;
    const beforeCount = this.activeSources.length;

    // 移除已經結束的音源
    this.activeSources = this.activeSources.filter(source => {
      try {
        // ✅ 修復：檢查多個條件
        // 1. AudioContext 是否還在運行
        if (source.context.state !== 'running') {
          return false;
        }

        // 2. 檢查音源的 playbackState（如果存在）
        if ('playbackState' in source) {
          const state = (source as any).playbackState;
          if (state === 'finished' || state === 'unscheduled') {
            return false;
          }
        }

        // 3. 檢查音源是否已經斷開連接
        if (source.numberOfOutputs === 0) {
          return false;
        }

        return true;
      } catch (e) {
        // 如果檢查時發生錯誤，說明音源已經無效
        return false;
      }
    });

    // 更新計數
    const removedCount = beforeCount - this.activeSources.length;
    this.currentlyPlayingCount = this.activeSources.length;

    if (removedCount > 0) {
      console.log(`[AUDIO] ✅ Cleanup: removed ${removedCount} expired sources, ${this.currentlyPlayingCount} active sources remaining`);
    }
  }

  // ===== 程序化音效生成方法 =====

  private generatePhoneBuzz(startTime: number): void {
    const config = AUDIO_CONFIGS['phone-buzz'];
    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150 + i * 50, startTime + i * 0.1);
      gain.gain.setValueAtTime(config.volume * this.masterVolume, startTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.08);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(startTime + i * 0.1);
      osc.stop(startTime + i * 0.1 + 0.08);

      // 在最後一個振盪器結束時減少計數
      if (i === 2) { // 最後一個振盪器
        osc.onended = () => {
          this.currentlyPlayingCount = Math.max(0, this.currentlyPlayingCount - 1);
        };
      }

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    }
  }

  private generateEmailPing(startTime: number): void {
    const config = AUDIO_CONFIGS['email-ping'];
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, startTime);
    osc.frequency.exponentialRampToValueAtTime(1200, startTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(900, startTime + 0.15);

    gain.gain.setValueAtTime(config.volume * this.masterVolume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.15);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateSocialMediaSound(startTime: number): void {
    const config = AUDIO_CONFIGS['social-media'];
    // 模擬社交媒體通知的「叮咚」聲
    const frequencies = [523, 659, 784]; // C, E, G
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.1);
      gain.gain.setValueAtTime(config.volume * this.masterVolume * 0.8, startTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.2);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(startTime + i * 0.1);
      osc.stop(startTime + i * 0.1 + 0.2);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });
  }

  private generateKeyboardTyping(startTime: number): void {
    const config = AUDIO_CONFIGS['keyboard-typing'];
    // 模擬鍵盤打字聲
    for (let i = 0; i < 20; i++) {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2000 + Math.random() * 1000, startTime + i * 0.1);
      gain.gain.setValueAtTime(config.volume * this.masterVolume * 0.3, startTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.05);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(startTime + i * 0.1);
      osc.stop(startTime + i * 0.1 + 0.05);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    }
  }

  private generateAnxietyPulse(startTime: number): void {
    const config = AUDIO_CONFIGS['anxiety-pulse'];
    // 模擬焦慮時的心跳加速
    for (let i = 0; i < 10; i++) {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(60 + i * 2, startTime + i * 0.3);
      gain.gain.setValueAtTime(0, startTime + i * 0.3);
      gain.gain.linearRampToValueAtTime(config.volume * this.masterVolume * 0.4, startTime + i * 0.3 + 0.1);
      gain.gain.linearRampToValueAtTime(0, startTime + i * 0.3 + 0.2);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(startTime + i * 0.3);
      osc.stop(startTime + i * 0.3 + 0.2);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    }
  }

  private generateMemoryGlitch(startTime: number): void {
    const config = AUDIO_CONFIGS['memory-glitch'];
    // 模擬記憶故障的電子音
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, startTime);
    osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.5);
    osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.7);
    osc.frequency.exponentialRampToValueAtTime(200, startTime + 1.0);

    gain.gain.setValueAtTime(config.volume * this.masterVolume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.0);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 1.0);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateRabbitHoleEnter(startTime: number): void {
    const config = AUDIO_CONFIGS['rabbit-hole-enter'];
    // 模擬掉入兔子洞的螺旋下降音效
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, startTime);
    osc.frequency.exponentialRampToValueAtTime(200, startTime + 1.5);

    gain.gain.setValueAtTime(config.volume * this.masterVolume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);

    osc.connect(gain);
    gain.connect(this.audioContext!.destination);
    osc.start(startTime);
    osc.stop(startTime + 1.5);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  private generateRabbitHoleEscape(startTime: number): void {
    const config = AUDIO_CONFIGS['rabbit-hole-escape'];
    // 模擬逃脫兔子洞的上升音效
    const frequencies = [200, 300, 450, 600, 800];
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.2);
      gain.gain.setValueAtTime(config.volume * this.masterVolume * 0.6, startTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.2 + 0.3);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);
      osc.start(startTime + i * 0.2);
      osc.stop(startTime + i * 0.2 + 0.3);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });
  }

  // ===== 新增的 ADHD 特定音效方法 =====

  playPhoneBuzz(): void { this.play('phone-buzz'); }
  playEmailPing(): void { this.play('email-ping'); }
  playSocialMedia(): void { this.play('social-media'); }
  playKeyboardTyping(): void { this.play('keyboard-typing'); }
  playMouseClick(): void { this.play('mouse-click'); }
  playDoorSlam(): void { this.play('door-slam'); }
  playConstruction(): void { this.play('construction'); }
  playTraffic(): void { this.play('traffic'); }
  playConversation(): void { this.play('conversation'); }
  playTvSound(): void { this.play('tv-sound'); }

  playStomachGrowl(): void { this.play('stomach-growl'); }
  playYawn(): void { this.play('yawn'); }
  playSneeze(): void { this.play('sneeze'); }
  playCough(): void { this.play('cough'); }
  playHeartbeat(): void { this.play('heartbeat'); }

  playAnxietyPulse(): void { this.play('anxiety-pulse'); }
  playMemoryGlitch(): void { this.play('memory-glitch'); }
  playHyperfocus(): void { this.play('hyperfocus'); }
  playBrainFog(): void { this.play('brain-fog'); }
  playOverwhelm(): void { this.play('overwhelm'); }

  playOfficeAmbient(): void { this.play('office-ambient'); }
  playHomeAmbient(): void { this.play('home-ambient'); }
  playCafeAmbient(): void { this.play('cafe-ambient'); }
  playNatureAmbient(): void { this.play('nature-ambient'); }

  playRabbitHoleEnter(): void { this.play('rabbit-hole-enter'); }
  playRabbitHoleEscape(): void { this.play('rabbit-hole-escape'); }
  playWorkingMemoryFail(): void { this.play('working-memory-fail'); }
  playWorkingMemoryRecover(): void { this.play('working-memory-recover'); }

  /**
   * 設置音量
   */
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('adhd-game-volume', this.masterVolume.toString());
    }
    console.log(`[Audio] 音量已設置為 ${Math.round(this.masterVolume * 100)}%`);
  }

  /**
   * 設置静音模式
   */
  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('adhd-game-muted', muted.toString());
    }
    if (muted) {
      this.stopAll();
    }
    console.log(`[Audio] 静音模式${muted ? '已啟用' : '已禁用'}`);
  }

  /**
   * 清理資源
   */
  dispose() {
    this.stopAll();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    console.log('[Audio] AudioManager 已清理');
  }







  /**
   * 檢查 AudioContext 是否已初始化
   */
  isReady(): boolean {
    return this.isInitialized && this.audioContext !== null;
  }
}

// 單例實例
let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}

/**
 * 重置音效管理器
 */
export function resetAudioManager(): void {
  if (audioManagerInstance) {
    audioManagerInstance.dispose();
    audioManagerInstance = null;
  }
}
