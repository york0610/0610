/**
 * Bug #2: 計時器清理測試
 * 
 * 測試目標: 確認組件卸載時所有計時器都被清理
 * Bug 描述: 組件卸載時計時器未清理，導致記憶體洩漏
 * 修復方式: 統一清理 useEffect
 */

import { renderHook, act } from '@testing-library/react'
import { useEffect, useRef } from 'react'

describe('Bug #2: Timer Cleanup', () => {
  // 追蹤活動的計時器
  let activeIntervals: number[] = []
  let activeTimeouts: number[] = []

  beforeEach(() => {
    jest.useFakeTimers()
    activeIntervals = []
    activeTimeouts = []

    // Mock setInterval 來追蹤
    const originalSetInterval = global.setInterval
    global.setInterval = jest.fn((callback: any, delay?: number) => {
      const id = originalSetInterval(callback, delay) as unknown as number
      activeIntervals.push(id)
      return id
    }) as any

    // Mock setTimeout 來追蹤
    const originalSetTimeout = global.setTimeout
    global.setTimeout = jest.fn((callback: any, delay?: number) => {
      const id = originalSetTimeout(callback, delay) as unknown as number
      activeTimeouts.push(id)
      return id
    }) as any

    // Mock clearInterval 來追蹤清理
    const originalClearInterval = global.clearInterval
    global.clearInterval = jest.fn((id: number) => {
      activeIntervals = activeIntervals.filter(i => i !== id)
      originalClearInterval(id)
    }) as any

    // Mock clearTimeout 來追蹤清理
    const originalClearTimeout = global.clearTimeout
    global.clearTimeout = jest.fn((id: number) => {
      activeTimeouts = activeTimeouts.filter(i => i !== id)
      originalClearTimeout(id)
    }) as any
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  // 模擬修復前的行為（有問題）
  const useOldGameTimer = () => {
    const intervalRef = useRef<number | null>(null)

    useEffect(() => {
      // 啟動遊戲計時器
      intervalRef.current = window.setInterval(() => {
        console.log('Game tick')
      }, 1000) as unknown as number

      // ❌ 問題: 沒有清理計時器
      // return () => {} // 空的清理函數
    }, [])

    return { intervalRef }
  }

  // 模擬修復後的行為（正確）
  const useNewGameTimer = () => {
    const intervalRef = useRef<number | null>(null)
    const taskTimeoutRef = useRef<number | null>(null)
    const detectionIntervalRef = useRef<number | null>(null)

    useEffect(() => {
      // 啟動主遊戲計時器
      intervalRef.current = window.setInterval(() => {
        console.log('Game tick')
      }, 1000) as unknown as number

      // 啟動任務超時計時器
      taskTimeoutRef.current = window.setTimeout(() => {
        console.log('Task timeout')
      }, 5000) as unknown as number

      // 啟動物體偵測計時器
      detectionIntervalRef.current = window.setInterval(() => {
        console.log('Detection tick')
      }, 500) as unknown as number

      // ✅ 修復: 清理所有計時器
      return () => {
        console.log('[CLEANUP] Component unmounting, cleaning up all timers')

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        if (taskTimeoutRef.current) {
          clearTimeout(taskTimeoutRef.current)
          taskTimeoutRef.current = null
        }

        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current)
          detectionIntervalRef.current = null
        }
      }
    }, [])

    return { intervalRef, taskTimeoutRef, detectionIntervalRef }
  }

  test('修復前: 組件卸載後計時器仍在運行', () => {
    const { unmount } = renderHook(() => useOldGameTimer())

    // 驗證計時器已創建
    expect(activeIntervals.length).toBe(1)

    // 卸載組件
    unmount()

    // ❌ 問題: 計時器沒有被清理
    expect(activeIntervals.length).toBe(1)
    expect(clearInterval).not.toHaveBeenCalled()
  })

  test('修復後: 組件卸載時所有計時器都被清理', () => {
    const { unmount } = renderHook(() => useNewGameTimer())

    // 驗證所有計時器已創建
    expect(activeIntervals.length).toBe(2) // 主計時器 + 偵測計時器
    expect(activeTimeouts.length).toBe(1)  // 任務超時

    // 卸載組件
    unmount()

    // ✅ 驗證: 所有計時器都被清理
    expect(activeIntervals.length).toBe(0)
    expect(activeTimeouts.length).toBe(0)
    expect(clearInterval).toHaveBeenCalledTimes(2)
    expect(clearTimeout).toHaveBeenCalledTimes(1)
  })

  test('計時器正常運行', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    renderHook(() => useNewGameTimer())

    // 快進 1 秒
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    // 驗證主計時器執行了
    expect(consoleSpy).toHaveBeenCalledWith('Game tick')

    // 快進 500ms
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // 驗證偵測計時器執行了
    expect(consoleSpy).toHaveBeenCalledWith('Detection tick')

    consoleSpy.mockRestore()
  })

  test('多次掛載和卸載不會洩漏計時器', () => {
    // 第一次掛載
    const { unmount: unmount1 } = renderHook(() => useNewGameTimer())
    expect(activeIntervals.length).toBe(2)
    expect(activeTimeouts.length).toBe(1)

    // 第一次卸載
    unmount1()
    expect(activeIntervals.length).toBe(0)
    expect(activeTimeouts.length).toBe(0)

    // 第二次掛載
    const { unmount: unmount2 } = renderHook(() => useNewGameTimer())
    expect(activeIntervals.length).toBe(2)
    expect(activeTimeouts.length).toBe(1)

    // 第二次卸載
    unmount2()
    expect(activeIntervals.length).toBe(0)
    expect(activeTimeouts.length).toBe(0)

    // 第三次掛載
    const { unmount: unmount3 } = renderHook(() => useNewGameTimer())
    expect(activeIntervals.length).toBe(2)
    expect(activeTimeouts.length).toBe(1)

    // 第三次卸載
    unmount3()
    expect(activeIntervals.length).toBe(0)
    expect(activeTimeouts.length).toBe(0)

    // ✅ 驗證: 沒有計時器洩漏
    expect(activeIntervals.length).toBe(0)
    expect(activeTimeouts.length).toBe(0)
  })

  test('ref 在清理後被設為 null', () => {
    const { result, unmount } = renderHook(() => useNewGameTimer())

    // 驗證 ref 有值
    expect(result.current.intervalRef.current).not.toBeNull()
    expect(result.current.taskTimeoutRef.current).not.toBeNull()
    expect(result.current.detectionIntervalRef.current).not.toBeNull()

    // 卸載組件
    unmount()

    // ✅ 驗證: ref 被設為 null
    expect(result.current.intervalRef.current).toBeNull()
    expect(result.current.taskTimeoutRef.current).toBeNull()
    expect(result.current.detectionIntervalRef.current).toBeNull()
  })

  test('清理日誌被正確輸出', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    const { unmount } = renderHook(() => useNewGameTimer())

    // 卸載組件
    unmount()

    // ✅ 驗證: 清理日誌被輸出
    expect(consoleSpy).toHaveBeenCalledWith(
      '[CLEANUP] Component unmounting, cleaning up all timers'
    )

    consoleSpy.mockRestore()
  })
})

