# ADHD Focus Finder - 專注力體驗遊戲

## 概述

ADHD Focus Finder 是一個互動式網頁遊戲，模擬 ADHD 患者在日常生活中面對的認知負荷和干擾。遊戲集成了 **AI 物體偵測技術**（MediaPipe EfficientDet Lite0 + COCO-SSD），允許玩家通過鏡頭找到指定物體來完成任務。

### 🎮 遊戲特色

- **無限挑戰模式**：90 秒內完成盡可能多的任務
- **80+ 種干擾場景**：模擬真實的 ADHD 干擾體驗
- **AI 物體偵測**：自動識別鏡頭中的物體
- **動態音效系統**：40+ 種音效，3 層動態背景音樂
- **沉浸式特效**：兔子洞效果、工作記憶失敗、粒子特效
- **評分系統**：S/A/B/C/D 評級，挑戰自己的極限

## 快速開始

### 安裝依賴

```bash
cd adhd-website
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

訪問 `http://localhost:3000/focus-finder/prototype` 開始遊戲。

## 🤖 AI 物體偵測系統

### 技術架構

- **主要模型**：MediaPipe EfficientDet Lite0（Google 官方優化）
- **備用模型**：TensorFlow.js COCO-SSD
- **自動回退**：MediaPipe 加載失敗時自動切換到 COCO-SSD
- **偵測參數**：
  - Confidence Threshold: 0.30（優化後）
  - NMS Threshold: 0.40
  - Max Detections: 25
  - 偵測頻率：每 500ms

### 偵測功能

- ✅ **完全自動化**：偵測到物體時自動完成任務
- ✅ **實時反饋**：顯示偵測到的物體和信心度
- ✅ **智能匹配**：支持多種物體別名和模糊匹配
- ✅ **干擾任務支持**：干擾任務也會自動偵測並完成

### 支持的物體類別（35+ 種）

#### 主要任務物體
| 類別 | 支持的物體 | COCO 類別 |
|------|----------|----------|
| 📱 手機 | cell phone, phone, mobile phone, smartphone | cell phone |
| ☕ 杯子 | cup, mug, glass, coffee cup, tea cup | cup |
| 📚 書籍 | book, books, notebook, textbook | book |
| ⌨️ 鍵盤 | keyboard, computer keyboard | keyboard |
| 🍎 水果 | apple, banana, orange | apple, banana, orange |
| 💻 筆電 | laptop, computer, notebook computer | laptop |
| 🖱️ 滑鼠 | mouse, computer mouse | mouse |
| 🪞 鏡子 | mirror, looking glass | (特殊處理) |

#### 干擾任務物體
| 干擾類型 | 物體 | 說明 |
|---------|------|------|
| 💻 電腦沒關 | laptop, computer, monitor | 環境干擾 |
| 💧 口好渴 | cup, mug, glass, bottle | 生理干擾 |
| 📱 手機響了 | cell phone, phone | 社交干擾 |
| 💡 燈沒關 | lamp, light | 環境干擾 |
| 🧹 房間亂 | various objects | 視覺干擾 |

## 🎯 遊戲玩法

### 開始遊戲

1. 訪問 `http://localhost:3000/focus-finder/prototype`
2. 點擊「啟用鏡頭開始」授權相機權限
3. 閱讀開場故事（可跳過）
4. 點擊「開始遊戲」進入 90 秒挑戰

### 遊戲機制

#### 無限挑戰模式
- ⏱️ **時間限制**：90 秒
- 📋 **任務系統**：無限循環任務序列
- ⏰ **任務超時**：10 秒內未完成扣 20 分
- 💀 **死亡機制**：分數降至 0 時遊戲結束
- 🎯 **目標**：完成盡可能多的任務

#### 專注力系統
- 💯 **初始專注力**：100%
- 📉 **自然衰減**：每秒 -0.5%
- 📈 **完成任務**：+10%
- 📉 **干擾任務**：-5% 到 -15%
- ⚠️ **低專注力**：< 30% 時觸發警告音效

#### 干擾系統（80+ 種）
- 🌍 **環境干擾**：電腦沒關、燈沒關、房間亂
- 🧠 **生理干擾**：口渴、肚子餓、想上廁所
- 📱 **社交干擾**：手機通知、訊息、社交媒體
- 🧩 **心理干擾**：焦慮、拖延、完美主義
- 🕳️ **特殊效果**：兔子洞（社交媒體陷阱）、工作記憶失敗

### 評分系統

| 評級 | 完成任務數 | 說明 |
|------|-----------|------|
| 🏆 S | 15+ | 極限挑戰者 |
| 🥇 A | 12-14 | 專注大師 |
| 🥈 B | 9-11 | 表現優秀 |
| 🥉 C | 6-8 | 還需努力 |
| 📝 D | < 6 | 繼續加油 |

### 成就系統

- 🏆 **極限挑戰者**：完成 12+ 個任務
- ⚡ **閃電俠**：平均每分鐘完成 8 個任務
- 🧠 **專注大師**：保持專注力 ≥ 80%
- 💪 **抗干擾戰士**：處理 10+ 次干擾

## 🛠️ 技術棧

### 前端框架
- **Next.js 16**：App Router + Turbopack
- **React 19**：最新版本，支持 Server Components
- **TypeScript 5.9**：完整類型支持

### AI 物體偵測
- **MediaPipe Tasks Vision 0.10.8**：主要偵測引擎
- **TensorFlow.js 4.11**：備用引擎
- **COCO-SSD 2.2.3**：備用模型
- **ONNX Runtime Web 1.17**：模型運行時

### UI/UX
- **Framer Motion 12**：動畫和過渡效果
- **Tailwind CSS 3.4**：樣式系統
- **React Icons 5.5**：圖標庫
- **Glassmorphism**：毛玻璃設計風格

### 音效系統
- **Web Audio API**：原生音效生成
- **Tuna.js**：專業音效處理（混響、延遲、失真等）
- **動態背景音樂**：3 層音樂系統（基礎、緊張、緊急）
- **40+ 音效類型**：每種音效 3 個頻率變體

## 📁 專案結構

```
adhd-website/
├── app/
│   ├── page.tsx                      # 首頁（ADHD 介紹）
│   ├── layout.tsx                    # 全局佈局
│   ├── globals.css                   # 全局樣式
│   │
│   ├── components/                   # 共用組件
│   │   ├── Header.tsx               # 導航欄（毛玻璃效果）
│   │   ├── AnimatedText.tsx         # 動畫文字組件
│   │   ├── GlassCard.tsx            # 玻璃卡片組件
│   │   ├── GameResultsScreen.tsx    # 遊戲結算畫面
│   │   └── ParticleEffects.tsx      # 粒子特效系統
│   │
│   ├── focus-finder/                # 遊戲模組
│   │   ├── page.tsx                 # 遊戲介紹頁
│   │   └── prototype/
│   │       └── page.tsx             # 遊戲主程式（2999 行）
│   │
│   ├── about/                       # 關於 ADHD
│   │   └── page.tsx
│   ├── assessment/                  # ADHD 評估
│   │   └── page.tsx
│   ├── contact/                     # 聯絡我們
│   │   └── page.tsx
│   ├── resources/                   # 資源分享
│   │   ├── page.tsx
│   │   ├── chapter1/
│   │   ├── chapter2/
│   │   └── chapter3/
│   │
│   └── utils/                       # 工具模組
│       ├── objectDetection.ts       # AI 物體偵測（380 行）
│       ├── audioManager.ts          # 音效管理系統（1800+ 行）
│       ├── platformDetector.ts      # 平台檢測
│       └── distractionSystem.ts     # 干擾系統邏輯
│
├── public/
│   └── sounds/                      # 音效資源
│
├── types/
│   └── tunajs.d.ts                  # Tuna.js 類型定義
│
├── .augment/
│   └── rules/
│       └── new.md                   # 開發規範
│
├── package.json                     # 依賴配置
├── tsconfig.json                    # TypeScript 配置
├── tailwind.config.js               # Tailwind 配置
├── next.config.js                   # Next.js 配置
├── netlify.toml                     # Netlify 部署配置
└── README.md                        # 本文件
```

## ⚡ 性能優化

### 當前性能指標

#### 模型加載
- **首次加載**：2-5 秒（取決於網路速度）
- **推理時間**：100-300ms（取決於設備）
- **記憶體使用**：50-100MB
- **偵測頻率**：每 500ms

#### 音效系統
- **最大同時音效**：3 個（優化後）
- **音效清理**：每 2 秒自動清理過期音源
- **背景音樂**：3 層動態系統

#### 渲染性能
- **動畫幀率**：60 FPS（Framer Motion）
- **粒子特效**：優化的 Canvas 渲染
- **UI 更新**：React 19 優化

### 優化配置

#### 1. 調整偵測頻率（如果性能不足）
```typescript
// 位置：app/focus-finder/prototype/page.tsx
const detectionIntervalId = window.setInterval(async () => {
  // ...
}, 1000); // 改為每 1 秒檢測一次（從 500ms）
```

#### 2. 調整信心度閾值（減少誤檢）
```typescript
// 位置：app/utils/objectDetection.ts
private readonly CONFIDENCE_THRESHOLD = 0.35; // 提高到 0.35（當前 0.30）
```

#### 3. 減少最大偵測數量（提升速度）
```typescript
// 位置：app/utils/objectDetection.ts
private readonly MAX_DETECTIONS = 15; // 降低到 15（當前 25）
```

#### 4. 調整音效數量（減少音效堆疊）
```typescript
// 位置：app/utils/audioManager.ts
private readonly MAX_CONCURRENT_SOUNDS = 2; // 降低到 2（當前 3）
```

#### 5. 禁用粒子特效（極低性能設備）
```typescript
// 位置：app/focus-finder/prototype/page.tsx
const [enableParticles, setEnableParticles] = useState(false); // 改為 false
```

### 移動端優化

- ✅ 自動檢測移動設備
- ✅ 自動啟用物體偵測
- ✅ 響應式 UI 設計
- ✅ 觸控優化
- ✅ 全螢幕模式支持

## 🔧 故障排除

### 常見問題

#### 1. MediaPipe 加載失敗
**症狀**：控制台顯示 "MediaPipe 加載失敗"

**解決方案**：
- ✅ 檢查網路連接（需要從 Google CDN 下載模型）
- ✅ 清除瀏覽器快取（Ctrl + Shift + Delete）
- ✅ 重新啟動開發伺服器
- ✅ 系統會自動回退到 COCO-SSD

#### 2. 物體偵測不準確
**症狀**：無法偵測到物體或誤檢

**解決方案**：
- 💡 **確保光線充足**：光線不足會嚴重影響準確度
- 📏 **調整距離**：物體距離鏡頭 30-100cm 最佳
- 🎯 **放在視野中心**：避免邊緣或角落
- 🔍 **檢查控制台**：F12 查看偵測日誌
- ⚙️ **調整閾值**：提高 CONFIDENCE_THRESHOLD 到 0.35

#### 3. 音效噪音或堆疊
**症狀**：後期音效混亂成噪音

**解決方案**：
- ✅ 已修復：降低 MAX_CONCURRENT_SOUNDS 到 3
- ✅ 已修復：添加自動清理機制
- ✅ 已修復：stopAll() 重置計數
- 🔊 如仍有問題：降低 MAX_CONCURRENT_SOUNDS 到 2

#### 4. 任務卡片不顯示
**症狀**：後期任務卡片消失

**解決方案**：
- ✅ 已修復：添加調試代碼
- 🔍 檢查控制台：查看 "[DEBUG] currentTask is null" 錯誤
- 🔄 重新開始遊戲

#### 5. UI 被遮擋
**症狀**：任務卡片被專注力條遮擋

**解決方案**：
- ✅ 已修復：專注力條 z-10，任務卡片 z-40/z-50
- 🎨 圖層順序正確

#### 6. 全螢幕自動退出
**症狀**：遊戲中途退出全螢幕

**解決方案**：
- ✅ 已修復：增強全螢幕監聽器
- ✅ 已修復：自動重新進入（最多 3 次）
- 🔒 干擾任務期間不會退出

#### 7. 性能下降
**症狀**：遊戲卡頓或延遲

**解決方案**：
- 🚀 關閉其他瀏覽器標籤頁
- 💻 在桌面版本上運行（移動設備性能較低）
- ⚙️ 減少檢測頻率到 1000ms
- 🎨 禁用粒子特效
- 🔊 降低 MAX_CONCURRENT_SOUNDS

## 🐛 調試指南

### 開啟調試模式

打開瀏覽器控制台（F12）查看詳細日誌：

#### 物體偵測日誌
```
[DEBUG] 平台檢測: { platform: 'mobile', isMobile: true, ... }
[DEBUG] Object detection enabled
[DEBUG] 物體偵測器已初始化
MediaPipe 物體偵測模型已加載
[DETECTION] 完全匹配: cell phone === cell phone (信心度: 0.85)
[DEBUG] 偵測到任務物體: cell phone
```

#### 音效系統日誌
```
[Audio] AudioManager initialized
[Audio] 背景音樂已開始播放
[AUDIO] Playing: task-complete (variant: 0, freq: 800Hz)
[AUDIO] Cleanup: 2 active sources
[AUDIO] Skipping phone-buzz - too many concurrent sounds (3/3)
[Audio] 所有音效已停止，計數已重置
```

#### 遊戲狀態日誌
```
[DEBUG] Session started
[TASK] Switching to task 5/8 { id: 'cup', title: '找到杯子', ... }
[DISTRACTION] Triggered: 📱 Instagram 限時動態 (weight: 15)
[DEATH] Player died: 分數歸零
[DEBUG] currentTask is null! { currentTaskIndex: 8, sequenceLength: 8, ... }
```

### 日誌類型說明

| 前綴 | 說明 | 重要性 |
|------|------|--------|
| `[DEBUG]` | 一般調試信息 | 低 |
| `[DETECTION]` | 物體偵測詳情 | 中 |
| `[AUDIO]` | 音效系統狀態 | 中 |
| `[TASK]` | 任務切換信息 | 高 |
| `[DISTRACTION]` | 干擾觸發信息 | 高 |
| `[DEATH]` | 玩家死亡信息 | 高 |
| `[ERROR]` | 錯誤信息 | 緊急 |

### 常見錯誤信息

#### `currentTask is null`
**原因**：任務序列為空或索引超出範圍
**解決**：檢查 randomTaskSequence 是否正確生成

#### `MediaPipe 加載失敗，回退到 COCO-SSD`
**原因**：無法從 Google CDN 下載 MediaPipe 模型
**解決**：檢查網路連接，系統會自動使用 COCO-SSD

#### `Skipping [sound] - too many concurrent sounds`
**原因**：同時播放的音效超過限制（3 個）
**解決**：正常行為，防止音效堆疊

#### `物體偵測初始化失敗`
**原因**：模型加載失敗或瀏覽器不支持
**解決**：更新瀏覽器或檢查網路連接

## 🚀 部署

### 本地開發

```bash
# 安裝依賴
cd adhd-website
npm install

# 啟動開發伺服器
npm run dev

# 訪問
http://localhost:3000
```

### 生產構建

```bash
# 構建生產版本
npm run build

# 啟動生產伺服器
npm start
```

### Netlify 自動部署

項目已配置 `netlify.toml`，連接 GitHub 倉庫後自動部署：

1. 連接 GitHub 倉庫到 Netlify
2. 設置構建命令：`npm run build`
3. 設置發布目錄：`out`
4. 推送到 `main` 分支自動觸發部署

**當前部署**：
- GitHub: https://github.com/york0610/0610.git
- Netlify: 自動部署

### 環境變量

無需額外環境變量，所有配置已內建。

## 📊 專案統計

### 代碼規模
- **總行數**：~15,000 行
- **主要文件**：
  - `page.tsx`（遊戲）：2,999 行
  - `audioManager.ts`：1,800+ 行
  - `objectDetection.ts`：380 行
  - `GameResultsScreen.tsx`：400+ 行

### 功能統計
- **任務物體**：35+ 種
- **干擾場景**：80+ 種
- **音效類型**：40+ 種（每種 3 變體）
- **成就系統**：4 種成就
- **評級系統**：S/A/B/C/D 5 級

### 開發時間
- **Stage 1-5**：完整遊戲機制
- **UI 重新設計**：所有頁面現代化
- **Bug 修復**：UI 層級、音效、任務顯示、物體偵測

## 📄 許可證

- **MediaPipe**：Apache 2.0
- **TensorFlow.js**：Apache 2.0
- **COCO-SSD**：Apache 2.0
- **本專案**：MIT

## 🔗 參考資源

### 官方文檔
- [Next.js 文檔](https://nextjs.org/docs)
- [React 文檔](https://react.dev/)
- [MediaPipe 文檔](https://developers.google.com/mediapipe)
- [TensorFlow.js 文檔](https://www.tensorflow.org/js)
- [Framer Motion 文檔](https://www.framer.com/motion/)

### 數據集與模型
- [COCO 數據集](https://cocodataset.org/)
- [MediaPipe Models](https://developers.google.com/mediapipe/solutions/vision/object_detector)
- [EfficientDet](https://github.com/google/automl/tree/master/efficientdet)

### ADHD 資源
- [ADHD 基金會](https://www.adhdfoundation.org.uk/)
- [CHADD](https://chadd.org/)
- [ADDitude Magazine](https://www.additudemag.com/)

## 👥 貢獻

歡迎提交 Issue 和 Pull Request！

### 開發規範
請參考 `.augment/rules/new.md` 了解開發規範。

### 提交規範
- `feat:` 新功能
- `fix:` Bug 修復
- `docs:` 文檔更新
- `style:` 代碼格式
- `refactor:` 重構
- `test:` 測試
- `chore:` 構建/工具

## 📞 聯絡

如有問題或建議，請通過以下方式聯絡：
- GitHub Issues: https://github.com/york0610/0610/issues
- 網站聯絡頁面: `/contact`

---

**Made with ❤️ for ADHD awareness and understanding**
