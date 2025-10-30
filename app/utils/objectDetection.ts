/**
 * 物體偵測模組 - 使用 TensorFlow.js COCO-SSD
 */

export interface DetectedObject {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface DetectionResult {
  objects: DetectedObject[];
  timestamp: number;
}

// 遊戲物體映射
const GAME_OBJECTS = {
  keys: ['key', 'keys'],
  wallet: ['wallet', 'handbag', 'backpack', 'purse'],
  phone: ['cell phone', 'phone', 'mobile phone'],
};

export class ObjectDetector {
  private model: any = null;
  private isLoading = false;
  private isReady = false;

  async initialize() {
    if (this.isReady) return;
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      // 動態導入 TensorFlow.js
      const tf = await import('@tensorflow/tfjs');
      const cocoSsd = await import('@tensorflow-models/coco-ssd');

      // 加載模型
      this.model = await cocoSsd.load();
      this.isReady = true;
      console.log('物體偵測模型已加載');
    } catch (error) {
      console.error('物體偵測模型加載失敗:', error);
      this.isLoading = false;
    }
  }

  async detectObjects(videoElement: HTMLVideoElement): Promise<DetectionResult> {
    if (!this.isReady || !this.model) {
      return { objects: [], timestamp: Date.now() };
    }

    try {
      // 使用正確的 COCO-SSD API 方法
      const predictions = await this.model.detect(videoElement);

      const detectedObjects: DetectedObject[] = predictions.map((pred: any) => ({
        class: pred.class,
        score: pred.score,
        bbox: pred.bbox,
      }));

      return {
        objects: detectedObjects,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('物體偵測失敗:', error);
      return { objects: [], timestamp: Date.now() };
    }
  }

  /**
   * 檢查是否偵測到特定遊戲物體
   */
  checkForGameObject(
    detectionResult: DetectionResult,
    targetObject: 'keys' | 'wallet' | 'phone'
  ): boolean {
    const targetClasses = GAME_OBJECTS[targetObject];
    const detectedClasses = detectionResult.objects.map(obj => obj.class.toLowerCase());

    return targetClasses.some(target =>
      detectedClasses.some(detected =>
        detected.includes(target) || target.includes(detected)
      )
    );
  }

  /**
   * 獲取物體在畫面中的位置
   */
  getObjectPosition(
    detectionResult: DetectionResult,
    targetObject: 'keys' | 'wallet' | 'phone'
  ): { x: number; y: number; confidence: number } | null {
    const targetClasses = GAME_OBJECTS[targetObject];

    for (const obj of detectionResult.objects) {
      const objClass = obj.class.toLowerCase();
      if (targetClasses.some(target => objClass.includes(target) || target.includes(objClass))) {
        const [x, y] = obj.bbox;
        return {
          x: x + obj.bbox[2] / 2, // 中心 X
          y: y + obj.bbox[3] / 2, // 中心 Y
          confidence: obj.score,
        };
      }
    }

    return null;
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isReady = false;
    }
  }
}

// 單例實例
let detectorInstance: ObjectDetector | null = null;

export function getObjectDetector(): ObjectDetector {
  if (!detectorInstance) {
    detectorInstance = new ObjectDetector();
  }
  return detectorInstance;
}
