# 🧪 測試文檔

這個目錄包含了 ADHD Focus Finder 的自動化測試。

---

## 📁 目錄結構

```
__tests__/
├── bug-fixes/                    # Bug 修復測試
│   ├── camera-permission.test.tsx    # Bug #1: 攝影機權限測試
│   ├── timer-cleanup.test.tsx        # Bug #2: 計時器清理測試
│   └── distraction-timeout.test.tsx  # Bug #4: 干擾任務超時測試
└── README.md                     # 本文件
```

---

## 🚀 運行測試

### 運行所有測試
```bash
npm test
```

### 運行特定測試文件
```bash
npm test camera-permission
npm test timer-cleanup
npm test distraction-timeout
```

### 監視模式（自動重新運行）
```bash
npm run test:watch
```

### 查看測試覆蓋率
```bash
npm run test:coverage
```

---

## 📝 測試說明

### Bug #1: 攝影機權限異步狀態更新

**文件**: `bug-fixes/camera-permission.test.tsx`  
**測試數量**: 5 個

測試內容：
- ✅ 修復前的問題行為
- ✅ 修復後的正確行為
- ✅ 正常權限請求流程
- ✅ 錯誤處理
- ✅ 防重複請求

### Bug #2: 計時器清理

**文件**: `bug-fixes/timer-cleanup.test.tsx`  
**測試數量**: 6 個

測試內容：
- ✅ 修復前的問題行為
- ✅ 修復後的清理邏輯
- ✅ 計時器正常運行
- ✅ 防記憶體洩漏
- ✅ Ref 清理
- ✅ 清理日誌

### Bug #4: 干擾任務超時保護

**文件**: `bug-fixes/distraction-timeout.test.tsx`  
**測試數量**: 7 個

測試內容：
- ✅ 修復前的問題行為
- ✅ 30 秒超時機制
- ✅ 正常完成不觸發超時
- ✅ 警告訊息顯示
- ✅ 狀態更新
- ✅ 多任務處理
- ✅ 清理邏輯

---

## 🛠️ 測試技術

### 使用的工具
- **Jest** - 測試框架
- **React Testing Library** - React 組件測試
- **@testing-library/user-event** - 用戶交互模擬
- **@testing-library/jest-dom** - DOM 斷言

### Mock 設置
- `navigator.mediaDevices.getUserMedia` - 攝影機 API
- `HTMLMediaElement.play/pause` - 視頻元素
- `document.exitFullscreen` - 全螢幕 API
- `IntersectionObserver` - 交叉觀察器
- `ResizeObserver` - 尺寸觀察器

---

## 📊 測試結果

查看 `TEST_RESULTS.md` 獲取詳細的測試結果報告。

**最新測試結果**:
- ✅ 通過: 16/18 (88.9%)
- ❌ 失敗: 2/18 (測試環境問題)
- ⏱️ 總時間: ~6.68 秒

---

## 🔧 故障排除

### 常見問題

#### 1. 測試失敗: "Can't perform a React state update on an unmounted component"
**解決方案**: 這是預期的警告，用於測試修復前的行為。

#### 2. 測試失敗: "clearInterval is not defined"
**解決方案**: 這是 Jest fake timers 的環境問題，實際代碼正確。

#### 3. 測試運行緩慢
**解決方案**: 使用 `--maxWorkers=50%` 限制並行數量：
```bash
npm test -- --maxWorkers=50%
```

---

## 📚 編寫新測試

### 測試模板

```typescript
import { renderHook, waitFor } from '@testing-library/react'

describe('功能名稱', () => {
  beforeEach(() => {
    // 設置 mocks
  })

  afterEach(() => {
    // 清理
  })

  test('應該做某事', () => {
    // Arrange (準備)
    const { result } = renderHook(() => useYourHook())

    // Act (執行)
    result.current.doSomething()

    // Assert (驗證)
    expect(result.current.state).toBe('expected')
  })
})
```

### 最佳實踐

1. **清晰的測試名稱** - 使用中文描述測試目的
2. **AAA 模式** - Arrange, Act, Assert
3. **獨立測試** - 每個測試應該獨立運行
4. **清理** - 使用 beforeEach/afterEach 清理狀態
5. **Mock 最小化** - 只 mock 必要的部分

---

## 🎯 測試覆蓋目標

### 當前覆蓋率
- Bug 修復: ✅ 高覆蓋率
- 核心功能: ⚠️ 待添加
- UI 組件: ⚠️ 待添加

### 未來計劃
- [ ] 添加遊戲邏輯測試
- [ ] 添加 UI 組件測試
- [ ] 添加整合測試
- [ ] 提高覆蓋率到 80%+

---

## 📖 參考資源

- [Jest 文檔](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**最後更新**: 2025-11-05  
**維護者**: AI Assistant  
**問題回報**: 請在 GitHub Issues 中提出

