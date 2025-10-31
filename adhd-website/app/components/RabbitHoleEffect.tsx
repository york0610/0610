'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaFacebook, FaSnapchat } from 'react-icons/fa';

interface RabbitHoleEffectProps {
  isActive: boolean;
  onEscape: () => void;
  duration?: number; // 持續時間（毫秒）
  intensity?: 'low' | 'medium' | 'high';
}

export default function RabbitHoleEffect({ 
  isActive, 
  onEscape, 
  duration = 8000,
  intensity = 'medium' 
}: RabbitHoleEffectProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showEscapePrompt, setShowEscapePrompt] = useState(false);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);

  // 模擬社交媒體貼文
  const generateSocialPosts = () => {
    const posts = [
      { id: 1, icon: FaInstagram, color: 'from-pink-500 to-purple-500', content: '看看我的新髮型！✨', likes: '1.2K', time: '2分鐘前' },
      { id: 2, icon: FaTiktok, color: 'from-black to-red-500', content: '這個舞蹈太好笑了 😂', likes: '8.9K', time: '5分鐘前' },
      { id: 3, icon: FaYoutube, color: 'from-red-500 to-red-600', content: '10個你不知道的生活小技巧', likes: '15K', time: '10分鐘前' },
      { id: 4, icon: FaTwitter, color: 'from-blue-400 to-blue-500', content: '今天的天氣真好 ☀️', likes: '234', time: '15分鐘前' },
      { id: 5, icon: FaFacebook, color: 'from-blue-600 to-blue-700', content: '和朋友們的聚餐照片', likes: '67', time: '30分鐘前' },
      { id: 6, icon: FaSnapchat, color: 'from-yellow-400 to-yellow-500', content: '今天的心情 💕', likes: '45', time: '1小時前' },
      { id: 7, icon: FaInstagram, color: 'from-purple-500 to-pink-500', content: '咖啡店的新品嚐試', likes: '892', time: '2小時前' },
      { id: 8, icon: FaTiktok, color: 'from-red-500 to-black', content: '貓咪的可愛瞬間 🐱', likes: '12K', time: '3小時前' },
    ];
    return posts;
  };

  // 強度配置
  const intensityConfig = {
    low: {
      scrollSpeed: 1,
      blurIntensity: 'blur-sm',
      tunnelOpacity: 'bg-black/60',
      escapeDelay: 3000,
    },
    medium: {
      scrollSpeed: 2,
      blurIntensity: 'blur-md',
      tunnelOpacity: 'bg-black/70',
      escapeDelay: 5000,
    },
    high: {
      scrollSpeed: 3,
      blurIntensity: 'blur-lg',
      tunnelOpacity: 'bg-black/80',
      escapeDelay: 7000,
    },
  };

  const config = intensityConfig[intensity];

  // 初始化貼文
  useEffect(() => {
    if (isActive) {
      setSocialPosts(generateSocialPosts());
      setScrollPosition(0);
      setShowEscapePrompt(false);
      
      // 延遲顯示逃脫提示
      const escapeTimer = setTimeout(() => {
        setShowEscapePrompt(true);
      }, config.escapeDelay);

      return () => clearTimeout(escapeTimer);
    }
  }, [isActive, config.escapeDelay]);

  // 自動滾動效果
  useEffect(() => {
    if (!isActive) return;

    const scrollInterval = setInterval(() => {
      setScrollPosition(prev => prev + config.scrollSpeed);
    }, 16); // 60fps

    return () => clearInterval(scrollInterval);
  }, [isActive, config.scrollSpeed]);

  // 自動結束效果
  useEffect(() => {
    if (!isActive) return;

    const autoEndTimer = setTimeout(() => {
      onEscape();
    }, duration);

    return () => clearTimeout(autoEndTimer);
  }, [isActive, duration, onEscape]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* 隧道視覺背景 */}
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`absolute inset-0 ${config.tunnelOpacity}`}
        />

        {/* 徑向模糊遮罩 */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/90" />

        {/* 中央內容區域 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, rotateZ: -5 }}
            animate={{ 
              scale: 1,
              rotateZ: 0,
              y: -scrollPosition % 100
            }}
            className="w-80 h-96 relative"
          >
            {/* 手機框架 */}
            <div className="absolute inset-0 bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden">
              {/* 手機頂部狀態欄 */}
              <div className="h-8 bg-slate-800 flex items-center justify-between px-4 text-xs text-slate-300">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                  <div className="w-4 h-2 bg-slate-600 rounded-sm"></div>
                  <div className="w-4 h-2 bg-slate-600 rounded-sm"></div>
                </div>
              </div>

              {/* 滾動內容 */}
              <div className="h-full overflow-hidden relative">
                <motion.div
                  animate={{ y: -scrollPosition }}
                  transition={{ duration: 0 }}
                  className="space-y-4 p-4"
                >
                  {/* 重複貼文以創造無限滾動效果 */}
                  {[...socialPosts, ...socialPosts, ...socialPosts].map((post, index) => {
                    const IconComponent = post.icon;
                    return (
                      <motion.div
                        key={`${post.id}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800 rounded-2xl p-4 border border-slate-700"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${post.color} flex items-center justify-center`}>
                            <IconComponent className="text-white text-lg" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">用戶名稱</div>
                            <div className="text-xs text-slate-400">{post.time}</div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-200 mb-3">{post.content}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>❤️ {post.likes}</span>
                          <span>💬 分享</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* 發光效果 */}
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
            />
          </motion.div>
        </div>

        {/* 周圍模糊效果 */}
        <div className={`absolute inset-0 ${config.blurIntensity} pointer-events-none`} />

        {/* 逃脫提示 */}
        <AnimatePresence>
          {showEscapePrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10"
            >
              <div className="bg-red-500/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-red-400/50 shadow-2xl">
                <div className="text-center text-white">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl mb-2"
                  >
                    ⚠️
                  </motion.div>
                  <p className="font-bold text-lg mb-2">快掙脫！</p>
                  <p className="text-sm opacity-90">你被社交媒體吸引了</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEscape}
                    className="mt-4 px-6 py-2 bg-white text-red-500 font-bold rounded-lg hover:bg-red-50 transition-colors"
                  >
                    回到任務
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 點擊任意處逃脫 */}
        <motion.div
          className="absolute inset-0 cursor-pointer"
          onClick={onEscape}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        />

        {/* 邊緣暗角效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}
