/**
 * 平台檢測系統 - 區分手機和電腦
 */

export type Platform = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface PlatformInfo {
  platform: Platform;
  orientation: Orientation;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
}

export class PlatformDetector {
  private platformInfo: PlatformInfo | null = null;

  /**
   * 檢測當前平台
   */
  detect(): PlatformInfo {
    if (typeof window === 'undefined') {
      return this.getDefaultInfo();
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isTouchDevice = this.isTouchDevice();

    // 檢測平台
    let platform: Platform = 'desktop';
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      platform = screenWidth < 768 ? 'mobile' : 'tablet';
    } else if (screenWidth < 768) {
      platform = 'mobile';
    } else if (screenWidth < 1024) {
      platform = 'tablet';
    }

    // 檢測方向
    const orientation: Orientation = screenHeight > screenWidth ? 'portrait' : 'landscape';

    this.platformInfo = {
      platform,
      orientation,
      isTouchDevice,
      screenWidth,
      screenHeight,
      userAgent,
    };

    return this.platformInfo;
  }

  /**
   * 檢測是否為觸控設備
   */
  private isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;

    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }

  /**
   * 獲取當前平台信息
   */
  getPlatformInfo(): PlatformInfo {
    if (!this.platformInfo) {
      this.detect();
    }
    return this.platformInfo || this.getDefaultInfo();
  }

  /**
   * 是否為手機
   */
  isMobile(): boolean {
    return this.getPlatformInfo().platform === 'mobile';
  }

  /**
   * 是否為平板
   */
  isTablet(): boolean {
    return this.getPlatformInfo().platform === 'tablet';
  }

  /**
   * 是否為桌面
   */
  isDesktop(): boolean {
    return this.getPlatformInfo().platform === 'desktop';
  }

  /**
   * 是否為豎屏
   */
  isPortrait(): boolean {
    return this.getPlatformInfo().orientation === 'portrait';
  }

  /**
   * 是否為橫屏
   */
  isLandscape(): boolean {
    return this.getPlatformInfo().orientation === 'landscape';
  }

  /**
   * 是否為觸控設備
   */
  hasTouchSupport(): boolean {
    return this.getPlatformInfo().isTouchDevice;
  }

  /**
   * 獲取推薦的遊戲模式
   */
  getRecommendedGameMode(): 'auto-detect' | 'manual' {
    const info = this.getPlatformInfo();
    // 手機版使用自動偵測，電腦版使用手動點擊
    return info.platform === 'mobile' ? 'auto-detect' : 'manual';
  }

  private getDefaultInfo(): PlatformInfo {
    return {
      platform: 'desktop',
      orientation: 'landscape',
      isTouchDevice: false,
      screenWidth: 1024,
      screenHeight: 768,
      userAgent: '',
    };
  }
}

// 單例實例
let detectorInstance: PlatformDetector | null = null;

export function getPlatformDetector(): PlatformDetector {
  if (!detectorInstance) {
    detectorInstance = new PlatformDetector();
  }
  return detectorInstance;
}
