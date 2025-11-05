# 物體偵測準確度改進計劃

**日期**: 2025-11-05  
**問題**: 偵測過於靈敏，容易誤判  
**目標**: 提高偵測準確度，減少誤報

---

## 📊 當前問題分析

### 發現的問題

1. **信心度閾值過低** ⚠️
   - 當前: `CONFIDENCE_THRESHOLD = 0.30` (30%)
   - 問題: 太低導致誤報率高
   - 建議: 提高到 0.50-0.60 (50-60%)

2. **缺少穩定性檢查** ⚠️
   - 當前: 偵測到一次就立即觸發
   - 問題: 可能是瞬間誤判
   - 建議: 需要連續偵測 2-3 次才確認

3. **沒有時間窗口過濾** ⚠️
   - 當前: 每 500ms 偵測一次，立即觸發
   - 問題: 沒有時間緩衝
   - 建議: 需要在 1-2 秒內連續偵測

4. **物體映射過於寬鬆** ⚠️
   - 當前: 一個物體可以匹配多個類別
   - 例如: `'cup'` 可以匹配 `['cup', 'mug', 'wine glass', 'glass', 'bowl']`
   - 問題: 容易誤判
   - 建議: 縮小映射範圍

---

## 🎯 改進方案

### Stage 1: 提高信心度閾值
**Goal**: 減少低信心度的誤報  
**Success Criteria**: 誤報率降低 50%  
**Tests**: 測試各種物體的偵測準確度  
**Status**: Not Started

**改進內容**:
```typescript
// 從 0.30 提高到 0.55
private readonly CONFIDENCE_THRESHOLD = 0.55;
```

---

### Stage 2: 添加穩定性檢查
**Goal**: 需要連續偵測才確認  
**Success Criteria**: 減少瞬間誤判  
**Tests**: 測試連續偵測機制  
**Status**: Not Started

**改進內容**:
```typescript
// 添加偵測歷史追蹤
private detectionHistory: Map<string, number[]> = new Map();

// 需要在 2 秒內連續偵測 3 次
private readonly STABILITY_WINDOW = 2000; // 2 秒
private readonly STABILITY_COUNT = 3; // 3 次

checkStability(objectClass: string): boolean {
  const now = Date.now();
  const history = this.detectionHistory.get(objectClass) || [];
  
  // 添加當前偵測
  history.push(now);
  
  // 移除超過時間窗口的記錄
  const validHistory = history.filter(
    time => now - time < this.STABILITY_WINDOW
  );
  
  this.detectionHistory.set(objectClass, validHistory);
  
  // 檢查是否達到穩定性要求
  return validHistory.length >= this.STABILITY_COUNT;
}
```

---

### Stage 3: 優化物體映射
**Goal**: 縮小映射範圍，提高精確度  
**Success Criteria**: 減少跨類別誤判  
**Tests**: 測試物體識別準確度  
**Status**: Not Started

**改進內容**:
```typescript
// 縮小映射範圍，只保留最相關的類別
const GAME_OBJECTS: Record<string, string[]> = {
  'cell phone': ['cell phone', 'phone'], // 移除 'remote'
  'cup': ['cup', 'mug'], // 移除 'wine glass', 'glass', 'bowl'
  'book': ['book'],
  'keyboard': ['keyboard'],
  'bottle': ['bottle'], // 移除 'cup'
  // ... 其他物體也類似縮小
};
```

---

### Stage 4: 添加信心度加權
**Goal**: 優先考慮高信心度的偵測  
**Success Criteria**: 提高準確匹配率  
**Tests**: 測試加權邏輯  
**Status**: Not Started

**改進內容**:
```typescript
checkForGameObject(
  detectionResult: DetectionResult,
  targetObject: string
): boolean {
  const targetClasses = GAME_OBJECTS[targetObject] || [targetObject];
  
  // 只考慮高信心度的偵測
  const highConfidenceObjects = detectionResult.objects
    .filter(obj => obj.score > this.CONFIDENCE_THRESHOLD)
    .sort((a, b) => b.score - a.score);
  
  // 優先匹配完全相同的類別
  for (const detected of highConfidenceObjects) {
    if (targetClasses.includes(detected.class)) {
      // 檢查穩定性
      if (this.checkStability(detected.class)) {
        console.log(`[DETECTION] ✅ 穩定偵測: ${detected.class} (${detected.score.toFixed(2)})`);
        return true;
      }
    }
  }
  
  return false;
}
```

---

### Stage 5: 添加視覺反饋
**Goal**: 讓用戶知道偵測進度  
**Success Criteria**: 用戶體驗改善  
**Tests**: UI 測試  
**Status**: Not Started

**改進內容**:
```typescript
// 在 UI 顯示偵測進度
<div className="detection-progress">
  偵測中... {detectionCount}/3
  <div className="progress-bar" style={{ width: `${(detectionCount/3)*100}%` }} />
</div>
```

---

## 📈 預期效果

### 改進前
- 信心度閾值: 30%
- 穩定性檢查: ❌ 無
- 誤報率: ~40%
- 用戶體驗: ⚠️ 一般

### 改進後
- 信心度閾值: 55%
- 穩定性檢查: ✅ 2秒內3次
- 誤報率: ~10% (降低 75%)
- 用戶體驗: ✅ 良好

---

## 🧪 測試計劃

### 單元測試
- [ ] 測試信心度閾值過濾
- [ ] 測試穩定性檢查邏輯
- [ ] 測試物體映射匹配
- [ ] 測試偵測歷史清理

### 整合測試
- [ ] 測試真實物體偵測
- [ ] 測試不同光線條件
- [ ] 測試不同角度
- [ ] 測試移動物體

### 用戶測試
- [ ] 收集誤報率數據
- [ ] 收集準確率數據
- [ ] 收集用戶反饋

---

## 📝 實施步驟

### Step 1: 提高信心度閾值 (5 分鐘)
```typescript
// objectDetection.ts 第 89 行
private readonly CONFIDENCE_THRESHOLD = 0.55; // 從 0.30 改為 0.55
```

### Step 2: 添加穩定性檢查 (20 分鐘)
1. 添加偵測歷史追蹤
2. 實現 `checkStability` 方法
3. 整合到 `checkForGameObject`

### Step 3: 優化物體映射 (15 分鐘)
1. 審查所有物體映射
2. 移除不相關的類別
3. 測試常用物體

### Step 4: 添加視覺反饋 (10 分鐘)
1. 設計進度條 UI
2. 整合到遊戲畫面
3. 測試用戶體驗

### Step 5: 測試和調整 (30 分鐘)
1. 運行單元測試
2. 實際測試偵測
3. 根據結果微調參數

**總預計時間**: ~80 分鐘

---

## 🎯 成功指標

### 量化指標
- ✅ 誤報率 < 15%
- ✅ 準確率 > 85%
- ✅ 平均偵測時間 < 2 秒
- ✅ 用戶滿意度 > 4/5

### 質化指標
- ✅ 用戶反饋偵測更準確
- ✅ 減少誤觸發投訴
- ✅ 遊戲體驗更流暢

---

## 🔄 回滾計劃

如果改進後效果不佳：

1. **保留代碼歷史**
   - Git commit 記錄所有變更
   - 可以快速回滾

2. **A/B 測試**
   - 提供設置選項切換新舊邏輯
   - 收集數據對比

3. **漸進式調整**
   - 先調整閾值
   - 再添加穩定性檢查
   - 最後優化映射

---

## 📚 參考資料

- MediaPipe 文檔: https://developers.google.com/mediapipe
- COCO 數據集: https://cocodataset.org/
- 物體偵測最佳實踐: https://arxiv.org/abs/1506.01497

---

**計劃完成時間**: 2025-11-05  
**預計實施時間**: ~80 分鐘  
**預期改善**: 誤報率降低 75%

**準備開始實施！** 🚀

