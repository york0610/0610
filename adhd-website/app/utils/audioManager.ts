/**
 * 音效管理系統 - 模擬 ADHD 患者日常的聲音干擾
 */

type AudioType = 'notification' | 'alarm' | 'ambient' | 'distraction' | 'success' | 'error';

interface AudioConfig {
  volume: number;
  duration: number;
  loop: boolean;
}

const AUDIO_CONFIGS: Record<AudioType, AudioConfig> = {
  notification: { volume: 0.6, duration: 500, loop: false },
  alarm: { volume: 0.8, duration: 1000, loop: false },
  ambient: { volume: 0.3, duration: 3000, loop: true },
  distraction: { volume: 0.7, duration: 2000, loop: false },
  success: { volume: 0.5, duration: 800, loop: false },
  error: { volume: 0.7, duration: 1000, loop: false },
};

export interface IAudioManager {
  play(type: AudioType): Promise<void>;
  playSuccess(): void;
  playError(): void;
  stopAll(): void;
  preloadAudio(type: AudioType): Promise<void>;
  preloadAllAudio(): Promise<void>;
  playNotification(): void;
  playAlarm(): void;
  playAmbient(): void;
  playDistraction(): void;
  // 其他需要導出的方法...
}

export class AudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isInitialized = false;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private audioFiles: Record<string, string> = {
    notification: '/sounds/notification.mp3',
    alarm: '/sounds/alarm.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext();
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
      }
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
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
   * 播放音效 - 通用方法
   */
  async play(type: AudioType): Promise<void> {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;

    try {
      if (!this.audioBuffers.has(type)) {
        await this.preloadAudio(type);
      }

      const audioBuffer = this.audioBuffers.get(type);
      if (!audioBuffer) return;

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      const gainNode = this.audioContext.createGain();
      const config = AUDIO_CONFIGS[type];
      
      gainNode.gain.value = config.volume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
      
      if (!config.loop) {
        source.stop(this.audioContext.currentTime + config.duration / 1000);
      }
    } catch (error) {
      console.error(`Error playing audio ${type}:`, error);
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
   * 播放專注音 - 平静的专注音
   */
  playFocus() {
    this.ensureAudioContextRunning();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now); // 室内调音
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
      gain.gain.linearRampToValueAtTime(0, now + 0.8);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (error) {
      console.error('Error playing focus:', error);
    }
  }

  /**
   * 停止所有音效
   */
  stopAll() {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // 已停止
      }
    });
    this.gainNodes.forEach((gain) => {
      try {
        gain.disconnect();
      } catch (e) {
        // 已斷開
      }
    });
    this.oscillators = [];
    this.gainNodes = [];
  }

  /**
   * 設置音量
   */
  setVolume(volume: number) {
    // 实現音量控制
    console.log(`[Audio] 音量已設置為 ${Math.round(volume * 100)}%`);
  }

  /**
   * 設置静音模式
   */
  setMuted(muted: boolean) {
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
