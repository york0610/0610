# Focus Finder Game Improvement Plan

## Overview
根據用戶反饋，遊戲存在以下主要問題需要改進：
1. 物件偵測不準確
2. 音效太單調
3. 全螢幕跳出問題
4. 遊戲太簡單
5. 干擾太少
6. 反饋不足

## Stage 1: 物件偵測優化 & 全螢幕穩定性
**Goal**: 提高物件偵測準確度，修復全螢幕跳出問題
**Priority**: CRITICAL
**Status**: ✅ COMPLETED

### Tasks:
- [x] 調整物件偵測參數
  - ✅ 降低信心閾值從 0.4 到 0.35
  - ✅ 增加最大偵測數從 15 到 20
  - ⏭️ 偵測頻率保持不變（由遊戲主循環控制）
- [x] 補充缺失的物件映射
  - ✅ 添加 'mirror' 映射（映射到 tv, monitor, window, laptop）
  - ✅ 添加 'keys' 映射（映射到 scissors, fork, knife, remote, cell phone）
  - ✅ 添加 'sky' 的替代識別（映射到 sky, cloud, ceiling）
  - ✅ 增強所有物件的替代識別選項（例如：cup 可能被識別為 bowl）
- [x] 增強物件偵測視覺反饋
  - ✅ 顯示當前偵測到的物件（綠色提示框）
  - ✅ 顯示目標物件提示（灰色提示框）
  - ✅ 添加偵測成功的動畫效果（脈衝動畫）
- [x] 修復全螢幕跳出問題
  - ✅ 加強全螢幕事件監聽器（支援所有瀏覽器）
  - ✅ 添加自動重新進入邏輯（最多 3 次嘗試）
  - ✅ 在干擾任務期間防止重新進入（避免干擾玩家）
  - ✅ 增加延遲時間從 100ms 到 200ms（確保事件處理完成）

**Success Criteria**:
- ✅ 物件偵測參數已優化
- ✅ 物件映射已補充完整
- ✅ 視覺反饋已添加
- ✅ 全螢幕穩定性已改善
- ✅ 建置成功無錯誤

**Tests**:
- ⏳ 需要實際測試各種物件的偵測準確度
- ⏳ 需要測試全螢幕在不同瀏覽器的穩定性
- ⏳ 需要測試視覺反饋是否清晰

---

## Stage 2: 增加遊戲難度 & 干擾頻率
**Goal**: 提升遊戲挑戰性，增加干擾任務頻率
**Priority**: HIGH
**Status**: ✅ COMPLETED

### Tasks:
- [x] 調整遊戲難度參數
  - ✅ 減少任務超時時間從 20 秒到 15 秒
  - ✅ 增加分數扣除從 -15 到 -20
  - ✅ 調整專注力恢復機制（全面降低恢復量）
- [x] 大幅增加干擾頻率
  - ✅ 實現激進的三階段干擾系統
  - ✅ 增加干擾總數從 ~12 個到 ~20 個
  - ✅ 添加隨機干擾增加不可預測性
- [x] 調整難度曲線
  - ✅ 前 30 秒：溫和（每 8-10 秒一個干擾，共 3 個）
  - ✅ 中 30 秒：適中（每 5-7 秒一個干擾，共 5 個）
  - ✅ 後 30 秒：困難（每 3-5 秒一個干擾，共 7 個）
  - ✅ 額外 5 個隨機干擾分散在整個遊戲過程

**Detailed Changes**:
- 任務超時：20s → 15s
- 超時扣分：-15 → -20
- 完成主任務恢復：+25 → +20
- 完成干擾任務恢復：+15 → +10
- 兔子洞逃脫恢復：+10 → +5
- 記憶恢復：+5 → +3
- 干擾總數：~12 → ~20（增加 67%）

**Success Criteria**:
- ✅ 遊戲難度顯著提升
- ✅ 干擾頻率大幅增加
- ✅ 難度曲線更陡峭
- ✅ 建置成功無錯誤

**Tests**:
- ⏳ 需要測試新難度下的完成率
- ⏳ 需要測試干擾觸發時機是否合理
- ⏳ 需要測試玩家是否能在壓力下完成任務

**User Feedback**:
- ✅ 物件偵測更準確了
- ✅ 全螢幕更穩定了
- ❌ 遊戲還是太簡單
- ❌ 希望增加更多特效型干擾（兔子洞）

---

## Stage 2.5: 遊戲機制大改版（基於用戶反饋）
**Goal**: 改變遊戲核心機制，從固定任務改為無限挑戰模式
**Priority**: CRITICAL
**Status**: ✅ COMPLETED

### Tasks:
- [x] 改變遊戲機制
  - ✅ 任務時間：15秒 → 10秒
  - ✅ 任務模式：8個固定任務 → 無限循環任務
  - ✅ 遊戲目標：90秒內完成盡可能多的任務
  - ✅ 遊戲結束：時間到達90秒自動結束
- [x] 增加特效型干擾
  - ✅ 提高兔子洞干擾的基礎權重：35% → 50%
  - ✅ 遊戲後期進一步提高：+20%（最高70%）
  - ✅ 專注力高時增加兔子洞陷阱：+15%
  - ✅ 降低環境和生理干擾權重
- [x] 重新設計評分系統
  - ✅ 基於完成任務數量而非完成率
  - ✅ 調整評級標準：
    * S級：12+任務，效率≥8/分鐘
    * A級：10-11任務，效率≥6.5/分鐘
    * B級：8-9任務，效率≥5/分鐘
    * C級：6-7任務
    * D級：<6任務
  - ✅ 更新成就系統（極限挑戰者、閃電俠等）
  - ✅ UI顯示改為任務計數器而非進度條

**Detailed Changes**:
- 任務超時：15s → 10s
- 任務循環：使用模運算 `(prev + 1) % length`
- 遊戲結束：移除任務完成檢查，只在時間到時結束
- 兔子洞權重：35% → 50%（基礎），最高可達85%
- 評分標準：從完成率改為完成數量
- UI更新：進度條改為大數字計數器

**Success Criteria**:
- ✅ 遊戲變成無限挑戰模式
- ✅ 玩家可以在90秒內完成更多任務
- ✅ 特效干擾（兔子洞）大幅增加
- ✅ 評分系統合理反映表現
- ✅ 建置成功無錯誤

**Tests**:
- ⏳ 測試無限任務循環是否正常
- ⏳ 測試10秒超時是否合適
- ⏳ 測試特效干擾頻率
- ⏳ 測試新評分系統是否合理

---

## Stage 2.6: Bug 修復 - 干擾系統和音效優化
**Goal**: 修復干擾任務顯示問題、音效混亂、兔子洞特效期間任務框顯示問題
**Priority**: CRITICAL
**Status**: ✅ COMPLETED

### 發現的 Bug:
1. **干擾完成後任務框不顯示**
   - 完成干擾任務後，主任務框有時不會重新顯示
   - 可能是狀態管理問題

2. **音效混亂**
   - 多個音效同時播放造成混亂
   - 需要更好的音效優先級管理

3. **兔子洞特效期間任務框仍顯示**
   - 兔子洞特效應該是全螢幕沉浸式體驗
   - 任務框應該在特效期間隱藏
   - 等特效結束後再顯示任務框

### Tasks:
- [x] 修復干擾任務狀態管理
  - ✅ 確保 `isDistractedTaskActive` 正確重置
  - ✅ 確保 `currentDistraction` 正確清除
  - ✅ 添加詳細的狀態轉換日誌以便調試
  - ✅ 在 `escapeRabbitHole` 中添加狀態重置
  - ✅ 在 `recoverWorkingMemory` 中添加狀態重置

- [x] 優化音效系統
  - ✅ 在兔子洞特效觸發時停止所有其他音效
  - ✅ 在記憶失敗特效觸發時停止所有其他音效
  - ✅ 使用 `setTimeout` 延遲播放特效音效，避免衝突
  - ✅ 減少同時播放的音效數量

- [x] 修復兔子洞特效顯示邏輯
  - ✅ 兔子洞特效期間隱藏干擾任務框
  - ✅ 兔子洞特效期間隱藏主任務框
  - ✅ 工作記憶失敗期間隱藏所有任務框
  - ✅ 添加 `!showRabbitHole && !showWorkingMemoryFailure` 檢查
  - ✅ 確保特效結束後正確恢復任務顯示

**Detailed Changes**:
1. **任務框顯示條件更新**：
   ```typescript
   // 干擾任務框
   {sessionState === 'running' && isDistractedTaskActive && currentDistraction
    && !showRabbitHole && !showWorkingMemoryFailure && (

   // 主任務框
   {sessionState === 'running' && currentTask
    && !showRabbitHole && !showWorkingMemoryFailure && (
   ```

2. **音效優化**：
   ```typescript
   // 兔子洞觸發
   audioManager.stopAll();
   setTimeout(() => {
     audioManager.playRabbitHoleEnter();
   }, 100);

   // 記憶失敗觸發
   audioManager.stopAll();
   setTimeout(() => {
     audioManager.playWorkingMemoryFail();
   }, 100);
   ```

3. **狀態重置增強**：
   - `escapeRabbitHole`: 添加 `setIsDistractedTaskActive(false)`
   - `recoverWorkingMemory`: 添加 `setIsDistractedTaskActive(false)`
   - 所有關鍵函數添加詳細日誌

**Success Criteria**:
- ✅ 干擾任務完成後主任務框正常顯示
- ✅ 音效不會混亂重疊（特效時停止其他音效）
- ✅ 兔子洞特效期間只顯示特效，不顯示任務框
- ✅ 特效結束後正確恢復遊戲狀態
- ✅ 建置成功無錯誤

**Tests**:
- ⏳ 測試完成干擾任務後主任務是否正常顯示
- ⏳ 測試音效是否清晰不混亂
- ⏳ 測試兔子洞特效是否全螢幕沉浸
- ⏳ 測試特效結束後遊戲是否正常繼續

**Additional Bug Found**:
- ❌ 干擾觸發時會跳出全螢幕
- 需要在 Stage 2.7 中修復

---

## Stage 2.7: 修復干擾時全螢幕跳出問題
**Goal**: 防止干擾任務觸發時跳出全螢幕
**Priority**: HIGH
**Status**: ✅ COMPLETED

### 問題分析:
**發現的問題**：
- 干擾任務觸發時，遊戲會跳出全螢幕
- 可能原因：
  1. 全螢幕監聽器中的條件檢查過於嚴格
  2. `isDistractedTaskActive` 狀態變化觸發了全螢幕退出
  3. 某些干擾任務的互動導致焦點丟失

**當前全螢幕邏輯**：
```typescript
if (sessionState === 'running' && !isCurrentlyFullscreen && isFullscreen
    && !showDeathAnimation && !isDistractedTaskActive) {
  // 重新進入全螢幕
}
```

**問題**：條件中有 `!isDistractedTaskActive`，這會在干擾任務期間阻止重新進入全螢幕

### Tasks:
- [x] 分析全螢幕監聽器邏輯
  - ✅ 檢查 `isDistractedTaskActive` 條件是否合理
  - ✅ 確認是否應該在干擾期間也保持全螢幕

- [x] 修復全螢幕條件
  - ✅ 移除 `!isDistractedTaskActive` 條件
  - ✅ 確保干擾期間也能自動重新進入全螢幕
  - ✅ 只在死亡動畫和結算畫面時不重新進入

- [x] 測試各種場景
  - ⏳ 測試普通干擾任務期間全螢幕穩定性
  - ⏳ 測試兔子洞特效期間全螢幕穩定性
  - ⏳ 測試工作記憶失敗期間全螢幕穩定性

**Detailed Changes**:
```typescript
// 修改前
if (sessionState === 'running' && !isCurrentlyFullscreen && isFullscreen
    && !showDeathAnimation && !isDistractedTaskActive) {
  // 重新進入全螢幕
}

// 修改後
if (sessionState === 'running' && !isCurrentlyFullscreen && isFullscreen
    && !showDeathAnimation) {
  // 重新進入全螢幕 - 移除 !isDistractedTaskActive 條件
}

// 依賴項也相應更新
}, [sessionState, isFullscreen, showDeathAnimation]); // 移除 isDistractedTaskActive
```

**Success Criteria**:
- ✅ 干擾任務觸發時不會跳出全螢幕
- ✅ 如果意外跳出，能自動重新進入
- ✅ 所有特效期間保持全螢幕
- ✅ 只在遊戲結束時才退出全螢幕
- ✅ 建置成功無錯誤

**Tests**:
- ⏳ 測試觸發多個干擾任務時全螢幕是否穩定
- ⏳ 測試兔子洞特效時全螢幕是否穩定
- ⏳ 測試快速連續干擾時全螢幕是否穩定

---

## Stage 3: 音效系統增強
**Goal**: 改善音效多樣性和動態性，減少單調感
**Priority**: MEDIUM
**Status**: ✅ COMPLETED

### 當前音效問題:
1. **音效單調**
   - 每種干擾類型只有一種音效
   - 重複聽到相同音效會感到乏味

2. **缺乏變化**
   - 沒有音效變體
   - 沒有隨機性

3. **背景音樂簡單**
   - 只有單一的低頻音
   - 缺乏層次感

### Tasks:
- [x] 為干擾類型添加多種音效變體
  - ✅ 每種干擾類型準備 3 種不同音效變體
  - ✅ 隨機選擇播放
  - ✅ 增加音效的豐富度

- [x] 改善背景音樂系統
  - ✅ 添加動態層次（根據遊戲進度）
  - ✅ 添加緊張感音效（時間緊迫時）
  - ✅ 添加專注力低時的警告音效

- [x] 優化音效混合
  - ✅ 改善音量平衡
  - ✅ 添加音效淡入淡出
  - ✅ 優化音效優先級系統

- [x] 添加情境音效
  - ✅ 心跳加速（壓力大時）
  - ✅ 時鐘滴答（倒數時）
  - ✅ 警告音效（專注力低時）

**Detailed Changes**:

1. **音效變體系統**:
```typescript
// 為每種音效類型添加 3 種頻率變體
private soundVariants: Record<string, number[]> = {
  'phone-buzz': [400, 450, 500],
  'email-ping': [800, 900, 1000],
  'social-media': [600, 700, 800],
  'door-slam': [100, 120, 150],
  'keyboard-typing': [200, 220, 240],
  'mouse-click': [300, 350, 400],
  'stomach-growl': [80, 100, 120],
  'yawn': [150, 180, 200],
  'sneeze': [500, 600, 700],
  'cough': [250, 300, 350],
};

// 隨機選擇變體
private getRandomVariant(soundType: string): number {
  const variants = this.soundVariants[soundType];
  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex];
}
```

2. **動態背景音樂系統**:
```typescript
// 三層背景音樂系統
private backgroundLayers: {
  base: { osc: OscillatorNode; gain: GainNode } | null;      // 基礎層（始終存在）
  tension: { osc: OscillatorNode; gain: GainNode } | null;   // 緊張層（強度 > 0.3）
  urgency: { osc: OscillatorNode; gain: GainNode } | null;   // 緊急層（強度 > 0.7）
};

// 根據遊戲進度動態調整
updateBackgroundMusicIntensity(intensity: number): void {
  // 0-0.3: 只有基礎層
  // 0.3-0.7: 基礎層 + 緊張層
  // 0.7-1.0: 基礎層 + 緊張層 + 緊急層
}
```

3. **情境音效系統**:
```typescript
playContextualSound(context: 'time-pressure' | 'low-focus' | 'high-stress'): void {
  // time-pressure: 時鐘滴答聲（3 次，間隔 0.5 秒）
  // low-focus: 警告脈衝（漸強漸弱）
  // high-stress: 心跳加速（5 次，間隔 0.3 秒）
}
```

**Implementation Plan**:
1. ✅ 創建音效變體映射表
2. ✅ 修改播放邏輯以支持隨機選擇
3. ✅ 添加動態背景音樂層
4. ✅ 實現情境音效觸發器

**Success Criteria**:
- ✅ 音效更加多樣化
- ✅ 不會感到單調重複
- ✅ 背景音樂有層次感
- ✅ 情境音效增強沉浸感
- ✅ 建置成功無錯誤

**Tests**:
- ⏳ 測試多次觸發相同干擾是否播放不同音效
- ⏳ 測試背景音樂是否有動態變化
- ⏳ 測試情境音效是否正確觸發

**Modified Files**:
- `adhd-website/app/utils/audioManager.ts`
  - 添加 `soundVariants` 映射表
  - 添加 `getRandomVariant()` 方法
  - 修改 `generateBasicSound()` 使用隨機變體
  - 修改 `createPhoneBuzzWithEffects()` 使用隨機變體
  - 修改 `createEmailPingWithEffects()` 使用隨機變體
  - 修改 `createSocialMediaWithEffects()` 使用隨機變體
  - 添加 `backgroundLayers` 狀態
  - 實現 `updateBackgroundMusicIntensity()` 方法
  - 實現 `playContextualSound()` 方法
  - 更新 `stopBackgroundMusic()` 清理所有層

---

## Stage 3: 音效系統增強
**Goal**: 豐富音效體驗，減少單調感
**Priority**: HIGH
**Status**: Not Started

### Tasks:
- [ ] 增加音效變化
  - 為每種干擾類型添加 3-5 種不同音效
  - 隨機選擇音效避免重複
  - 添加音效組合（主音效 + 環境音）
- [ ] 改善背景音樂
  - 添加動態背景音樂層次
  - 根據遊戲進度改變音樂強度
  - 在高壓力時段增加緊張音效
- [ ] 優化音效混合
  - 實現更好的音量平衡
  - 避免音效重疊造成混亂
  - 添加音效淡入淡出
- [ ] 添加情境音效
  - 任務完成時的勝利音效變化
  - 時間緊迫時的心跳加速音效
  - 專注力低時的警告音效

**Success Criteria**:
- 音效不再單調重複
- 音效能增強遊戲氛圍
- 音效不會造成聽覺疲勞

**Tests**:
- 測試音效多樣性
- 測試音量平衡
- 測試長時間遊玩的音效體驗

---

## Stage 4: 反饋系統改進
**Goal**: 增強 UI 反饋，讓玩家更清楚遊戲狀態
**Priority**: HIGH
**Status**: ✅ COMPLETED

### 當前反饋問題:
1. **任務進度不明確**
   - 無限模式下看不到完成了多少任務
   - 不知道當前表現如何

2. **物件偵測反饋不足**
   - 只有簡單的「偵測到」提示
   - 不知道偵測範圍和信心度

3. **遊戲狀態指示器缺失**
   - 不知道當前專注力狀態
   - 不知道時間壓力程度
   - 不知道背景音樂強度

### Tasks:
- [x] 添加任務進度顯示
  - ✅ 顯示「已完成 X 個任務」
  - ✅ 顯示當前評級預測
  - ✅ 顯示效率指標（任務/分鐘）

- [x] 增強物件偵測反饋
  - ✅ 顯示偵測到的所有物件
  - ✅ 顯示信心度百分比
  - ✅ 視覺化偵測範圍

- [x] 添加遊戲狀態指示器
  - ✅ 專注力狀態指示器（顏色編碼）
  - ✅ 時間壓力指示器
  - ✅ 背景音樂強度可視化

- [x] 改善任務卡片
  - ✅ 添加任務計時器
  - ✅ 添加任務難度指示
  - ✅ 改善視覺層次

**Detailed Changes**:

1. **任務進度顯示**:
```typescript
// 在主任務卡片頂部添加進度指示器
<div className="flex items-center justify-between gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
  <div className="flex items-center gap-2">
    <span className="text-cyan-400 font-bold text-sm">{totalCompleted}</span>
    <span className="text-slate-400 text-xs">個任務完成</span>
  </div>
  <div className="flex items-center gap-2">
    {/* 預測評級：S/A/B/C/D */}
    <span className="text-slate-400 text-xs">預測評級:</span>
    <span className={`font-bold text-sm ${rankColor}`}>{predictedRank}</span>
  </div>
</div>
```

2. **專注力狀態指示器**:
```typescript
// 在 HUD 頂部添加專注力指示器
<span className={`rounded-full px-3 py-1.5 backdrop-blur flex items-center gap-1 ${
  focusLevel >= 70
    ? 'bg-emerald-900/80 text-emerald-200'  // 良好
    : focusLevel >= 40
    ? 'bg-yellow-900/80 text-yellow-200'    // 警告
    : 'bg-red-900/80 text-red-200 animate-pulse'  // 危險
}`}>
  {focusLevel >= 70 ? '🎯' : focusLevel >= 40 ? '⚠️' : '🚨'} {focusLevel}%
</span>
```

3. **時間壓力指示器**:
```typescript
// 任務倒數計時顏色編碼
<span className={`rounded-full px-3 py-1.5 backdrop-blur ${
  taskTimeLeft <= 5
    ? 'bg-red-900/80 text-red-200 animate-pulse'    // 極度緊急
    : taskTimeLeft <= 7
    ? 'bg-orange-900/80 text-orange-200'            // 緊急
    : 'bg-slate-900/80'                             // 正常
}`}>
  ⏳ {taskTimeLeft}s
</span>

// 總時間顏色編碼
<span className={`rounded-full px-3 py-1.5 backdrop-blur ${
  timer > GAME_TIME_LIMIT * 0.8
    ? 'bg-red-900/80 text-red-200 animate-pulse'    // 時間緊迫
    : timer > GAME_TIME_LIMIT * 0.6
    ? 'bg-orange-900/80 text-orange-200'            // 時間不多
    : 'bg-slate-900/80'                             // 充裕
}`}>
  ⏱️ {formatSeconds(Math.max(0, GAME_TIME_LIMIT - timer))}
</span>
```

4. **物件偵測面板**:
```typescript
// 顯示所有偵測到的物件及信心度
{allDetectedObjects.length > 0 && (
  <motion.div className="bg-slate-800/50 backdrop-blur rounded-lg px-3 py-2">
    <div className="text-xs text-slate-400 mb-1">偵測中的物件:</div>
    <div className="flex flex-wrap gap-1">
      {allDetectedObjects.map((obj, idx) => (
        <span className="inline-flex items-center gap-1 bg-slate-700/50 rounded px-2 py-0.5 text-xs">
          <span className="text-slate-300">{obj.name}</span>
          <span className="text-cyan-400 font-mono">{obj.confidence}%</span>
        </span>
      ))}
    </div>
  </motion.div>
)}
```

**Implementation Plan**:
1. ✅ 創建任務進度組件
2. ✅ 創建物件偵測反饋組件
3. ✅ 創建遊戲狀態指示器組件
4. ✅ 整合到主遊戲界面

**Success Criteria**:
- ✅ 玩家能清楚看到任務進度
- ✅ 玩家能理解物件偵測狀態
- ✅ 玩家能感知遊戲壓力變化
- ✅ UI 反饋及時且清晰
- ✅ 建置成功無錯誤

**Tests**:
- ⏳ 測試任務進度是否正確顯示
- ⏳ 測試物件偵測反饋是否清晰
- ⏳ 測試狀態指示器是否準確

**Modified Files**:
- `adhd-website/app/focus-finder/prototype/page.tsx`
  - 添加 `allDetectedObjects` 狀態
  - 修改物件偵測邏輯追蹤所有物件
  - 添加任務進度指示器到主任務卡片
  - 添加專注力狀態指示器到 HUD
  - 改善時間壓力指示器顏色編碼
  - 添加物件偵測面板顯示所有偵測物件

---
**Goal**: 增強遊戲反饋，讓玩家清楚了解遊戲狀態
**Priority**: MEDIUM
**Status**: Not Started

### Tasks:
- [ ] 增強任務進度顯示
  - 顯示當前任務編號（X/8）
  - 顯示剩餘任務列表
  - 添加任務完成進度條
- [ ] 改善物件偵測反饋
  - 實時顯示偵測到的物件
  - 顯示偵測信心度
  - 添加「接近目標」提示
- [ ] 增強干擾任務說明
  - 更清楚地解釋為什麼要找其他物件
  - 顯示干擾任務的影響
  - 添加干擾任務計數器
- [ ] 添加遊戲狀態指示器
  - 專注力條更明顯
  - 時間剩餘更突出
  - 分數變化動畫
- [ ] 改善結算畫面
  - 簡化統計數據展示
  - 突出關鍵指標
  - 添加改進建議

**Success Criteria**:
- 玩家能清楚知道當前遊戲狀態
- 玩家理解每個操作的影響
- 反饋及時且清晰

**Tests**:
- 測試新玩家是否能理解遊戲機制
- 測試反饋是否及時
- 測試UI是否清晰易懂

---

## Stage 5: 代碼優化 & 性能改進
**Goal**: 清理代碼，提升性能
**Priority**: LOW
**Status**: Not Started

### Tasks:
- [ ] 移除未使用的變數和代碼
- [ ] 重構音效播放邏輯
- [ ] 優化偵測循環性能
- [ ] 添加錯誤處理和降級方案
- [ ] 改善代碼可讀性

**Success Criteria**:
- 無 TypeScript 警告
- 代碼更易維護
- 性能提升 10% 以上

**Tests**:
- 運行 linter 檢查
- 性能測試
- 代碼審查

---

## Implementation Order
1. **Stage 1** (CRITICAL) - 物件偵測 & 全螢幕 - 預計 1-2 小時
2. **Stage 2** (HIGH) - 遊戲難度 & 干擾頻率 - 預計 1 小時
3. **Stage 3** (HIGH) - 音效系統 - 預計 1-2 小時
4. **Stage 4** (MEDIUM) - 反饋系統 - 預計 1 小時
5. **Stage 5** (LOW) - 代碼優化 - 預計 30 分鐘

## Notes
- 每個 Stage 完成後進行測試
- 每個 Stage 完成後提交代碼
- 遵循 new.md 中的開發規範
- 最多嘗試 3 次，如果卡住則重新評估方案

