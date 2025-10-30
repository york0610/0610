# ADHD Focus Finder - 專注力體驗遊戲

## 概述

ADHD Focus Finder 是一個互動式網頁遊戲，模擬 ADHD 患者在日常生活中面對的認知負荷和干擾。遊戲集成了 **YOLOv8 Web 物體偵測技術**，允許玩家通過鏡頭找到指定物體來完成任務。

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

## MediaPipe 物體偵測集成

### 新增功能

- **MediaPipe 物體偵測**：Google 官方优化的物體識別模型
- **自動回退機制**：如果 MediaPipe 加載失敗，自動使用 COCO-SSD
- **完全自動化**：適當偵測到物體時自動完成任務，不需誘按鈕
- **實時反饋**：置信度 > 0.3 的結果，按鈕位置顯示掃描狀態

### 支持的任務物體

| 任務 | 支持的物體 | 難度 |
|------|----------|------|
| 找到手機 | cell phone, phone, mobile phone, smartphone | 簡單 |
| 找到杯子 | cup, mug, glass, bottle, water bottle | 簡單 |
| 找到書 | book, books | 簡單 |
| 找到鍵盤 | keyboard, computer keyboard | 普通 |
| 找到瓶子 | bottle, water bottle, wine bottle | 簡單 |

### 干擾任務物體

- 💻 電腦沒關：laptop, computer, monitor
- 💧 口好渴：cup, mug, glass, bottle
- 📱 手機響了：cell phone, phone, mobile phone
- 💡 燈沒關：lamp, light, ceiling light

## 使用方式

### 自動物體偵測

1. 進入 Focus Finder Prototype 1
2. 點擊「啟用鏡頭開始」
3. 點擊「開始遊戲」
4. 物體偵測自動啟用，系統會實時掃描視頻幀
5. 將物體對準鏡頭，系統自動偵測並完成任務
6. 無需手動按鈕！

### 功能特點

- **自動啟用**：沒有勾選框，遊戲開始時自動啟用物體偵測
- **自動偵測**：每 500ms 掃描一次，偵測到物體時自動完成
- **不需按鈕**：移除了「標記已找到」按鈕，全程自動化
- **干擾任務也自動**：中斷任務也會自動偵測並完成
- **實時反饋**：按鈕位置顯示掃描狀態和偵測結果

## 技術棧

- **框架**：Next.js 16 + React 19
- **物體偵測**：MediaPipe + ONNX Runtime
- **備選方案**：TensorFlow.js COCO-SSD
- **動畫**：Framer Motion
- **樣式**：Tailwind CSS
- **音效**：Web Audio API

## 文件結構

```
adhd-website/
├── app/
│   ├── focus-finder/
│   │   └── prototype/
│   │       └── page.tsx          # 遊戲主頁面
│   └── utils/
│       ├── objectDetection.ts    # 物體偵測核心模組
│       ├── audioManager.ts       # 音效管理
│       └── platformDetector.ts   # 平台檢測
├── package.json                  # 依賴配置
└── README.md                      # 本文件
```

## 性能優化

### 模型加載
- 首次加載時間：2-5 秒
- 推理時間：100-300ms（取決於設備）
- 記憶體使用：50-100MB

### 優化建議

1. **減少檢測頻率**（如果性能不足）
   ```typescript
   }, 1000); // 改為每 1 秒檢測一次
   ```
   位置：`app/focus-finder/prototype/page.tsx` 第 614 行

2. **提高置信度閾值**（減少誤檢）
   ```typescript
   .filter((pred: any) => (pred.score || pred.confidence || 0) > 0.5)
   ```
   位置：`app/utils/objectDetection.ts` 第 105 行

3. **自動完成延遅**（如果偵測太需設置時間）
   ```typescript
   setTimeout(() => completeTask(), 1000); // 改為 1000ms
   ```
   位置：`app/focus-finder/prototype/page.tsx` 第 625 行

4. 在移動設備上運行時，考慮使用較小的模型

## 故障排除

### MediaPipe 加載失敗
- 檢查網路連接
- 清除瀏覽器快取
- 重新啟動開發伺服器

### 物體偵測不準確
- 確保光線充足，光線不足會严重影響偵測精準度
- 將物體放在視野中心，不要太遠或太近
- 檢查瀏覽器控制台的調試日誌（F12）
- 如果長時間不能偵測，可以提高置信度閾值

### 物體偵測太慢
- 減少檢測頻率（改為每 1 秒檢測一次）
- 關閉其他標籤頁或應用程式
- 在桌面版本上運行（移動設備性能較低）

### 性能下降
- 關閉其他標籤頁
- 在桌面版本上運行
- 減少檢測頻率

## 調試

打開瀏覽器控制台 (F12) 查看調試日誌：

```
[DEBUG] 平台檢測: { platform: 'mobile', ... }
[DEBUG] Object detection enabled
[DEBUG] 物體偵測器已初始化
[DEBUG] 偵測到任務物體: cell phone
[DEBUG] 偵測到干擾任務物體: laptop
```

### 日誌說明

- `Object detection enabled` - 物體偵測已啟用
- `物體偵測器已初始化` - MediaPipe 或 COCO-SSD 已加載
- `偵測到任務物體` - 主任務物體偵測成功
- `偵測到干擾任務物體` - 中斷任務物體偵測成功

## 部署

### Netlify 部署

```bash
npm run build
```

項目已配置 `netlify.toml`，可直接連接 GitHub 倉庫到 Netlify。

## 許可證

- YOLOv8：AGPL-3.0
- 本項目：MIT

## 參考資源

- [YOLOv8 官方文檔](https://docs.ultralytics.com/)
- [ONNX Runtime Web](https://github.com/microsoft/onnxruntime-web)
- [Next.js 文檔](https://nextjs.org/docs)
- [COCO 數據集](https://cocodataset.org/)
