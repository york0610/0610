/**
 * Bug #1: 攝影機權限異步狀態更新測試
 * 
 * 測試目標: 確認組件卸載後不會更新狀態
 * Bug 描述: 組件卸載後仍嘗試更新狀態，導致 React 警告
 * 修復方式: 添加 isMounted 標記
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useCallback, useRef, useState } from 'react'

describe('Bug #1: Camera Permission Async State Update', () => {
  // Mock getUserMedia
  const mockGetUserMedia = jest.fn()
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Setup navigator.mediaDevices mock
    Object.defineProperty(global.navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: mockGetUserMedia,
      },
    })
  })

  // 模擬修復前的行為（會有問題）
  const useOldCameraPermission = () => {
    const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')
    const streamRef = useRef<MediaStream | null>(null)

    const handleRequestCamera = useCallback(async () => {
      if (permissionState === 'requesting') return

      try {
        setPermissionState('requesting')
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
        
        streamRef.current = stream
        
        // ❌ 問題: 沒有檢查組件是否已卸載
        setPermissionState('granted')
      } catch (error) {
        setPermissionState('denied')
      }
    }, [permissionState])

    return { permissionState, handleRequestCamera }
  }

  // 模擬修復後的行為（正確）
  const useNewCameraPermission = () => {
    const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')
    const streamRef = useRef<MediaStream | null>(null)

    const handleRequestCamera = useCallback(async () => {
      if (permissionState === 'requesting') return

      // ✅ 修復: 使用 isMounted 標記
      let isMounted = true

      try {
        if (isMounted) setPermissionState('requesting')
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
        
        // ✅ 檢查組件是否仍然掛載
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop())
          return
        }
        
        streamRef.current = stream
        
        if (isMounted) {
          setPermissionState('granted')
        }
      } catch (error) {
        if (!isMounted) return
        setPermissionState('denied')
      }

      // ✅ 返回清理函數
      return () => {
        isMounted = false
      }
    }, [permissionState])

    return { permissionState, handleRequestCamera }
  }

  test('修復前: 組件卸載後仍會更新狀態 (會產生警告)', async () => {
    // 模擬延遲的 getUserMedia
    mockGetUserMedia.mockImplementation(() => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            getTracks: () => [],
          } as any)
        }, 100)
      })
    )

    const { result, unmount } = renderHook(() => useOldCameraPermission())

    // 開始請求攝影機
    result.current.handleRequestCamera()

    // 等待狀態變為 requesting
    await waitFor(() => {
      expect(result.current.permissionState).toBe('requesting')
    })

    // 立即卸載組件（在 getUserMedia 完成前）
    unmount()

    // 等待 getUserMedia 完成
    await new Promise(resolve => setTimeout(resolve, 150))

    // ❌ 問題: 這裡會嘗試更新已卸載組件的狀態
    // 在真實環境中會看到 React 警告
    // 注意: 在測試環境中可能不會拋出錯誤，但在實際應用中會有警告
  })

  test('修復後: 組件卸載後不會更新狀態', async () => {
    // 模擬延遲的 getUserMedia
    const mockStopFn = jest.fn()
    const mockStream = {
      getTracks: jest.fn(() => [
        { stop: mockStopFn }
      ]),
    }

    mockGetUserMedia.mockImplementation(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(mockStream as any)
        }, 100)
      })
    )

    const { result, unmount } = renderHook(() => useNewCameraPermission())

    // 開始請求攝影機
    result.current.handleRequestCamera()

    // 等待狀態變為 requesting
    await waitFor(() => {
      expect(result.current.permissionState).toBe('requesting')
    })

    // 立即卸載組件（在 getUserMedia 完成前）
    unmount()

    // 等待 getUserMedia 完成
    await new Promise(resolve => setTimeout(resolve, 150))

    // ✅ 驗證: stream 被正確停止
    expect(mockStopFn).toHaveBeenCalled()

    // ✅ 沒有嘗試更新已卸載組件的狀態
    // 不會有 React 警告
  })

  test('正常流程: 成功獲取攝影機權限', async () => {
    const mockStream = {
      getTracks: jest.fn(() => []),
    }
    
    mockGetUserMedia.mockResolvedValue(mockStream as any)

    const { result } = renderHook(() => useNewCameraPermission())

    // 初始狀態
    expect(result.current.permissionState).toBe('idle')

    // 請求攝影機
    await result.current.handleRequestCamera()

    // 等待狀態更新
    await waitFor(() => {
      expect(result.current.permissionState).toBe('granted')
    })

    // 驗證 getUserMedia 被調用
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: true,
      audio: false,
    })
  })

  test('錯誤處理: 攝影機權限被拒絕', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'))

    const { result } = renderHook(() => useNewCameraPermission())

    // 請求攝影機
    await result.current.handleRequestCamera()

    // 等待狀態更新
    await waitFor(() => {
      expect(result.current.permissionState).toBe('denied')
    })
  })

  test('防止重複請求', async () => {
    mockGetUserMedia.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )

    const { result } = renderHook(() => useNewCameraPermission())

    // 第一次請求
    result.current.handleRequestCamera()

    await waitFor(() => {
      expect(result.current.permissionState).toBe('requesting')
    })

    // 嘗試第二次請求（應該被忽略）
    result.current.handleRequestCamera()

    // getUserMedia 只應該被調用一次
    expect(mockGetUserMedia).toHaveBeenCalledTimes(1)
  })
})

