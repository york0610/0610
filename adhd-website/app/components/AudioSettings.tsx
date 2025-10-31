'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeUp, FaVolumeDown, FaVolumeMute, FaCog, FaTimes } from 'react-icons/fa';
import { getAudioManager } from '@/app/utils/audioManager';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioSettings({ isOpen, onClose }: AudioSettingsProps) {
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientType, setAmbientType] = useState<'none' | 'office' | 'home' | 'cafe' | 'nature'>('none');

  useEffect(() => {
    // 載入儲存的設定
    const savedVolume = localStorage.getItem('adhd-game-volume');
    const savedMuted = localStorage.getItem('adhd-game-muted');
    const savedAmbient = localStorage.getItem('adhd-game-ambient');
    
    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === 'true');
    if (savedAmbient) setAmbientType(savedAmbient as any);
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    const audioManager = getAudioManager();
    audioManager.setVolume(newVolume);
    
    // 播放測試音效
    if (newVolume > 0) {
      audioManager.playDetection();
    }
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    const audioManager = getAudioManager();
    audioManager.setMuted(newMuted);
  };

  const handleAmbientChange = (type: typeof ambientType) => {
    setAmbientType(type);
    localStorage.setItem('adhd-game-ambient', type);
    
    const audioManager = getAudioManager();
    // 停止當前環境音
    audioManager.stopAll();
    
    // 播放新的環境音
    if (type !== 'none') {
      setTimeout(() => {
        switch (type) {
          case 'office':
            audioManager.playOfficeAmbient();
            break;
          case 'home':
            audioManager.playHomeAmbient();
            break;
          case 'cafe':
            audioManager.playCafeAmbient();
            break;
          case 'nature':
            audioManager.playNatureAmbient();
            break;
        }
      }, 100);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-slate-600"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 標題 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaCog className="text-blue-400 text-xl" />
                <h2 className="text-xl font-bold text-slate-100">音效設定</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* 音量控制 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-300">主音量</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMuteToggle}
                    className={`p-2 rounded-lg transition-colors ${
                      isMuted 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {isMuted ? <FaVolumeMute /> : volume > 0.5 ? <FaVolumeUp /> : <FaVolumeDown />}
                  </button>
                  <span className="text-sm text-slate-400 w-12 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                disabled={isMuted}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* 環境音效選擇 */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-300 mb-3 block">背景環境音</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'none', label: '無', emoji: '🔇' },
                  { key: 'office', label: '辦公室', emoji: '🏢' },
                  { key: 'home', label: '家庭', emoji: '🏠' },
                  { key: 'cafe', label: '咖啡廳', emoji: '☕' },
                  { key: 'nature', label: '自然', emoji: '🌿' },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleAmbientChange(option.key as any)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      ambientType === option.key
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-transparent'
                    }`}
                  >
                    <div className="text-lg mb-1">{option.emoji}</div>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 音效說明 */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-slate-300 mb-2">🎵 ADHD 音效體驗</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                遊戲包含 30+ 種真實的 ADHD 干擾音效，包括手機震動、鍵盤打字、社交媒體通知等。
                這些音效幫助模擬 ADHD 患者日常面臨的聽覺干擾挑戰。
              </p>
            </div>

            {/* 確認按鈕 */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              完成設定
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
