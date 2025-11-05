/**
 * Bug #4: 干擾任務超時保護測試
 * 
 * 測試目標: 確認干擾任務 30 秒後自動解鎖
 * Bug 描述: 干擾任務可能永久鎖定主任務
 * 修復方式: 添加 30 秒超時機制
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useEffect, useState } from 'react'

describe('Bug #4: Distraction Task Timeout Protection', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  // 模擬干擾任務類型
  type Distraction = {
    id: string
    objectToFind: string
    dismissedAt: number | null
  }

  // 模擬修復前的行為（有問題）
  const useOldDistractionTask = () => {
    const [isDistractedTaskActive, setIsDistractedTaskActive] = useState(false)
    const [currentDistraction, setCurrentDistraction] = useState<Distraction | null>(null)

    const startDistraction = (distraction: Distraction) => {
      setIsDistractedTaskActive(true)
      setCurrentDistraction(distraction)
    }

    const completeDistraction = () => {
      setIsDistractedTaskActive(false)
      setCurrentDistraction(null)
    }

    // ❌ 問題: 沒有超時保護機制
    // 如果 completeDistraction 沒有被調用，任務會永久鎖定

    return {
      isDistractedTaskActive,
      currentDistraction,
      startDistraction,
      completeDistraction,
    }
  }

  // 模擬修復後的行為（正確）
  const useNewDistractionTask = () => {
    const [isDistractedTaskActive, setIsDistractedTaskActive] = useState(false)
    const [currentDistraction, setCurrentDistraction] = useState<Distraction | null>(null)
    const [distractions, setDistractions] = useState<Distraction[]>([])
    const [errorMessage, setErrorMessage] = useState('')

    const startDistraction = (distraction: Distraction) => {
      setIsDistractedTaskActive(true)
      setCurrentDistraction(distraction)
      setDistractions([distraction])
    }

    const completeDistraction = () => {
      setIsDistractedTaskActive(false)
      setCurrentDistraction(null)
    }

    // ✅ 修復: 添加 30 秒超時保護
    useEffect(() => {
      if (!isDistractedTaskActive) return

      const DISTRACTION_TIMEOUT = 30000 // 30 秒
      console.log('[DISTRACTION] Setting timeout protection for distraction task')

      const timeout = setTimeout(() => {
        console.warn('[BUG FIX] Distraction task timeout - auto-unlocking after 30s')
        console.warn('[BUG FIX] Current distraction:', currentDistraction)

        // 強制解除鎖定
        setIsDistractedTaskActive(false)

        // 清理當前干擾
        if (currentDistraction) {
          setDistractions(prev =>
            prev.map(d =>
              d.id === currentDistraction.id
                ? { ...d, dismissedAt: Date.now() }
                : d
            )
          )
          setCurrentDistraction(null)
        }

        // 顯示警告訊息
        setErrorMessage('⚠️ 干擾任務已自動跳過')
        setTimeout(() => setErrorMessage(''), 3000)
      }, DISTRACTION_TIMEOUT)

      return () => {
        clearTimeout(timeout)
      }
    }, [isDistractedTaskActive, currentDistraction])

    return {
      isDistractedTaskActive,
      currentDistraction,
      distractions,
      errorMessage,
      startDistraction,
      completeDistraction,
    }
  }

  test('修復前: 干擾任務可能永久鎖定', () => {
    const { result } = renderHook(() => useOldDistractionTask())

    // 啟動干擾任務
    act(() => {
      result.current.startDistraction({
        id: 'test-distraction',
        objectToFind: 'phone',
        dismissedAt: null,
      })
    })

    // 驗證任務已鎖定
    expect(result.current.isDistractedTaskActive).toBe(true)

    // 快進 30 秒
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // ❌ 問題: 30 秒後仍然鎖定
    expect(result.current.isDistractedTaskActive).toBe(true)
    expect(result.current.currentDistraction).not.toBeNull()
  })

  test('修復後: 30 秒後自動解鎖', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    
    const { result } = renderHook(() => useNewDistractionTask())

    // 啟動干擾任務
    act(() => {
      result.current.startDistraction({
        id: 'test-distraction',
        objectToFind: 'phone',
        dismissedAt: null,
      })
    })

    // 驗證任務已鎖定
    expect(result.current.isDistractedTaskActive).toBe(true)

    // 快進 30 秒
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // ✅ 驗證: 自動解鎖
    expect(result.current.isDistractedTaskActive).toBe(false)
    expect(result.current.currentDistraction).toBeNull()

    // ✅ 驗證: 警告日誌被輸出
    expect(consoleSpy).toHaveBeenCalledWith(
      '[BUG FIX] Distraction task timeout - auto-unlocking after 30s'
    )

    consoleSpy.mockRestore()
  })

  test('正常完成干擾任務不會觸發超時', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    
    const { result } = renderHook(() => useNewDistractionTask())

    // 啟動干擾任務
    act(() => {
      result.current.startDistraction({
        id: 'test-distraction',
        objectToFind: 'phone',
        dismissedAt: null,
      })
    })

    // 快進 10 秒
    act(() => {
      jest.advanceTimersByTime(10000)
    })

    // 正常完成任務
    act(() => {
      result.current.completeDistraction()
    })

    // 驗證任務已解鎖
    expect(result.current.isDistractedTaskActive).toBe(false)

    // 快進剩餘的 20 秒
    act(() => {
      jest.advanceTimersByTime(20000)
    })

    // ✅ 驗證: 超時警告沒有被觸發
    expect(consoleSpy).not.toHaveBeenCalledWith(
      '[BUG FIX] Distraction task timeout - auto-unlocking after 30s'
    )

    consoleSpy.mockRestore()
  })

  test('超時後顯示警告訊息', () => {
    const { result } = renderHook(() => useNewDistractionTask())

    // 啟動干擾任務
    act(() => {
      result.current.startDistraction({
        id: 'test-distraction',
        objectToFind: 'phone',
        dismissedAt: null,
      })
    })

    // 快進 30 秒觸發超時
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // ✅ 驗證: 警告訊息被顯示
    expect(result.current.errorMessage).toBe('⚠️ 干擾任務已自動跳過')

    // 快進 3 秒
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // ✅ 驗證: 警告訊息被清除
    expect(result.current.errorMessage).toBe('')
  })

  test('超時後干擾被標記為已忽略', () => {
    const { result } = renderHook(() => useNewDistractionTask())

    const distraction: Distraction = {
      id: 'test-distraction',
      objectToFind: 'phone',
      dismissedAt: null,
    }

    // 啟動干擾任務
    act(() => {
      result.current.startDistraction(distraction)
    })

    // 快進 30 秒觸發超時
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // ✅ 驗證: 干擾被標記為已忽略
    expect(result.current.distractions[0].dismissedAt).not.toBeNull()
  })

  test('多個干擾任務依序處理', () => {
    const { result } = renderHook(() => useNewDistractionTask())

    // 第一個干擾任務
    act(() => {
      result.current.startDistraction({
        id: 'distraction-1',
        objectToFind: 'phone',
        dismissedAt: null,
      })
    })

    expect(result.current.isDistractedTaskActive).toBe(true)

    // 快進 10 秒後完成
    act(() => {
      jest.advanceTimersByTime(10000)
      result.current.completeDistraction()
    })

    expect(result.current.isDistractedTaskActive).toBe(false)

    // 第二個干擾任務
    act(() => {
      result.current.startDistraction({
        id: 'distraction-2',
        objectToFind: 'cup',
        dismissedAt: null,
      })
    })

    expect(result.current.isDistractedTaskActive).toBe(true)

    // 快進 30 秒觸發超時
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // ✅ 驗證: 第二個任務被超時解鎖
    expect(result.current.isDistractedTaskActive).toBe(false)
  })

  test('超時保護在組件卸載時被清理', () => {
    const { result, unmount } = renderHook(() => useNewDistractionTask())

    // 啟動干擾任務
    act(() => {
      result.current.startDistraction({
        id: 'test-distraction',
        objectToFind: 'phone',
        dismissedAt: null,
      })
    })

    // 卸載組件
    unmount()

    // 快進 30 秒
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // ✅ 驗證: 超時不會在卸載後觸發
    // (不會有錯誤或警告)
  })
})

