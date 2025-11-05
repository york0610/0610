/**
 * 物體偵測模組 - 使用 MediaPipe 或 COCO-SSD 進行物體識別
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

// ✅ Stage 3: 優化物體映射 - 縮小範圍以提高準確度
const GAME_OBJECTS: Record<string, string[]> = {
  // 電子產品 - 縮小映射範圍
  'cell phone': ['cell phone', 'phone'], // 移除 'remote'
  'laptop': ['laptop'], // 移除 'monitor', 'tv'
  'mouse': ['mouse', 'computer mouse'], // 移除 'remote'
  'keyboard': ['keyboard'],
  'monitor': ['monitor', 'tv'], // 保留相似的螢幕設備
  'tv': ['tv', 'television'],
  'remote': ['remote'], // 移除 'cell phone'

  // 容器類 - 縮小映射範圍
  'cup': ['cup', 'mug'], // 移除 'wine glass', 'glass', 'bowl'
  'bottle': ['bottle'], // 移除 'cup'
  'bowl': ['bowl'], // 移除 'cup', 'sink'
  'vase': ['vase'], // 移除 'bottle', 'cup'

  // 家具 - 縮小映射範圍
  'chair': ['chair'], // 移除 'bench', 'couch', 'bed'
  'desk': ['dining table', 'table'], // 移除 'bed'
  'bed': ['bed'], // 移除 'couch', 'chair'
  'couch': ['couch'], // 新增獨立類別

  // 書籍和文具
  'book': ['book'],
  'scissors': ['scissors'], // 移除 'knife', 'fork'

  // 廚房用品 - 縮小映射範圍
  'microwave': ['microwave'], // 移除 'oven', 'refrigerator'
  'toaster': ['toaster'], // 移除 'microwave'
  'refrigerator': ['refrigerator'], // 移除 'door', 'microwave'
  'sink': ['sink'], // 移除 'toilet', 'bowl'
  'toilet': ['toilet'], // 移除 'sink'

  // 餐具 - 縮小映射範圍
  'fork': ['fork'], // 移除 'knife', 'spoon', 'scissors'
  'knife': ['knife'], // 移除 'fork', 'spoon', 'scissors'
  'spoon': ['spoon'], // 移除 'fork', 'knife'

  // 食物 - 縮小映射範圍
  'banana': ['banana'], // 移除 'remote'
  'apple': ['apple'], // 移除 'orange', 'ball'
  'orange': ['orange'], // 移除 'apple', 'ball'
  'sandwich': ['sandwich'], // 移除 'book'
  'pizza': ['pizza'], // 移除 'cake', 'plate'
  'cake': ['cake'], // 移除 'pizza', 'plate'
  'donut': ['donut'], // 移除 'cup', 'bowl'

  // 其他物品
  'backpack': ['backpack', 'handbag'], // 移除 'suitcase', 'chair'
  'umbrella': ['umbrella'], // 移除 'bottle'
  'tie': ['tie'], // 移除 'belt'
  'clock': ['clock'], // 移除 'cell phone'
  'potted plant': ['potted plant'],
  'teddy bear': ['teddy bear'], // 移除 'cat', 'dog'
  'hair drier': ['hair drier'], // 移除 'remote', 'cell phone'
  'toothbrush': ['toothbrush'], // 移除 'fork', 'spoon'

  // 建築元素 - 保持較寬鬆（這些較難識別）
  'door': ['door'],
  'window': ['window'],
  'sky': ['sky'],

  // 特殊物件
  'person': ['person'],
  'rabbit-hole': ['cell phone', 'laptop', 'tv', 'monitor'], // 兔子洞效應：任何螢幕設備
};

// COCO 數據集中的物體類別
const COCO_CLASSES = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck',
  'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
  'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe',
  'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis',
  'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove',
  'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
  'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
  'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
  'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
  'remote', 'keyboard', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator',
  'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];

export class ObjectDetector {
  private model: any = null;
  private isLoading = false;
  private isReady = false;
  private useMediaPipe = false;

  // ✅ Stage 1: 提高信心度閾值以減少誤報
  private readonly CONFIDENCE_THRESHOLD = 0.55; // 從 0.30 提高到 0.55 (55%)
  private readonly NMS_THRESHOLD = 0.40; // 降低 NMS 閾值以減少重複偵測
  private readonly MAX_DETECTIONS = 25; // 最大偵測數量

  // ✅ Stage 2: 添加穩定性檢查參數
  private readonly STABILITY_WINDOW = 2000; // 2 秒時間窗口
  private readonly STABILITY_COUNT = 3; // 需要連續偵測 3 次
  private detectionHistory: Map<string, number[]> = new Map(); // 偵測歷史記錄

  async initialize() {
    if (this.isReady) return;
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      // 強制使用 MediaPipe（不再回退到 COCO-SSD）
      console.log('[DETECTION] 正在加載 MediaPipe EfficientDet Lite0 模型...');

      // ✅ 修復：動態導入 MediaPipe 並正確初始化
      const vision = await import('@mediapipe/tasks-vision');
      const { ObjectDetector, FilesetResolver } = vision;

      if (!ObjectDetector || !FilesetResolver) {
        throw new Error('MediaPipe ObjectDetector or FilesetResolver not found');
      }

      // ✅ 修復：先初始化 FilesetResolver（必需步驟）
      console.log('[DETECTION] 正在初始化 FilesetResolver...');
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      console.log('[DETECTION] ✅ FilesetResolver 初始化成功');

      // ✅ 修復：使用正確的參數順序創建 ObjectDetector
      this.model = await ObjectDetector.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite'
          },
          scoreThreshold: this.CONFIDENCE_THRESHOLD,
          maxResults: this.MAX_DETECTIONS,
          runningMode: 'VIDEO'
        }
      );
      this.useMediaPipe = true;
      this.isReady = true;
      this.isLoading = false;
      console.log('[DETECTION] ✅ MediaPipe 物體偵測模型已成功加載');
    } catch (error) {
      console.error('[DETECTION] ❌ MediaPipe 模型加載失敗:', error);
      this.isLoading = false;
      this.isReady = false;
      throw new Error('MediaPipe 模型加載失敗，請檢查網路連接或瀏覽器支持');
    }
  }

  async detectObjects(videoElement: HTMLVideoElement): Promise<DetectionResult> {
    if (!this.isReady || !this.model) {
      return { objects: [], timestamp: Date.now() };
    }

    try {
      let detectedObjects: DetectedObject[] = [];

      if (this.useMediaPipe) {
        // MediaPipe 檢測
        try {
          const result = this.model.detectForVideo(videoElement, Date.now());
          detectedObjects = (result.detections || [])
            .filter((det: any) => (det.categories?.[0]?.score || 0) > this.CONFIDENCE_THRESHOLD)
            .map((det: any) => ({
              class: det.categories?.[0]?.categoryName || 'unknown',
              score: det.categories?.[0]?.score || 0,
              bbox: det.boundingBox ?
                [det.boundingBox.originX, det.boundingBox.originY, det.boundingBox.width, det.boundingBox.height] :
                [0, 0, 0, 0],
            }))
            .sort((a: DetectedObject, b: DetectedObject) => b.score - a.score) // 按信心度排序
            .slice(0, this.MAX_DETECTIONS); // 限制最大偵測數量
        } catch (mpDetectError) {
          console.error('MediaPipe 檢測失敗，回退到 COCO-SSD:', mpDetectError);
          // 回退到 COCO-SSD
          this.useMediaPipe = false;
          const predictions = await this.model.detect(videoElement, this.MAX_DETECTIONS);
          detectedObjects = predictions
            .filter((pred: any) => (pred.score || pred.confidence || 0) > this.CONFIDENCE_THRESHOLD)
            .map((pred: any) => ({
              class: pred.class || COCO_CLASSES[pred.classId] || 'unknown',
              score: pred.score || pred.confidence || 0,
              bbox: pred.bbox || [pred.x, pred.y, pred.width, pred.height],
            }))
            .sort((a: DetectedObject, b: DetectedObject) => b.score - a.score); // 按信心度排序
        }
      } else {
        // COCO-SSD 檢測
        const predictions = await this.model.detect(videoElement, this.MAX_DETECTIONS);
        detectedObjects = predictions
          .filter((pred: any) => (pred.score || pred.confidence || 0) > this.CONFIDENCE_THRESHOLD)
          .map((pred: any) => ({
            class: pred.class || COCO_CLASSES[pred.classId] || 'unknown',
            score: pred.score || pred.confidence || 0,
            bbox: pred.bbox || [pred.x, pred.y, pred.width, pred.height],
          }))
          .sort((a: DetectedObject, b: DetectedObject) => b.score - a.score); // 按信心度排序
      }

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
   * ✅ Stage 2: 檢查偵測穩定性
   * 需要在時間窗口內連續偵測多次才確認
   */
  private checkStability(objectClass: string): boolean {
    const now = Date.now();
    const history = this.detectionHistory.get(objectClass) || [];

    // 添加當前偵測時間
    history.push(now);

    // 移除超過時間窗口的舊記錄
    const validHistory = history.filter(
      time => now - time < this.STABILITY_WINDOW
    );

    // 更新歷史記錄
    this.detectionHistory.set(objectClass, validHistory);

    // 檢查是否達到穩定性要求
    const isStable = validHistory.length >= this.STABILITY_COUNT;

    if (isStable) {
      console.log(`[STABILITY] ✅ ${objectClass} 穩定偵測 (${validHistory.length}/${this.STABILITY_COUNT})`);
    } else {
      console.log(`[STABILITY] ⏳ ${objectClass} 偵測中 (${validHistory.length}/${this.STABILITY_COUNT})`);
    }

    return isStable;
  }

  /**
   * 清除特定物體的偵測歷史
   */
  private clearDetectionHistory(objectClass: string): void {
    this.detectionHistory.delete(objectClass);
    console.log(`[STABILITY] 🗑️ 清除 ${objectClass} 的偵測歷史`);
  }

  /**
   * 清除所有偵測歷史
   */
  clearAllDetectionHistory(): void {
    this.detectionHistory.clear();
    console.log('[STABILITY] 🗑️ 清除所有偵測歷史');
  }

  /**
   * 獲取特定物體的偵測進度 (0-3)
   */
  getDetectionProgress(objectClass: string): number {
    const now = Date.now();
    const history = this.detectionHistory.get(objectClass) || [];

    // 只計算時間窗口內的有效偵測
    const validHistory = history.filter(
      time => now - time < this.STABILITY_WINDOW
    );

    return Math.min(validHistory.length, this.STABILITY_COUNT);
  }

  /**
   * 檢查是否偵測到特定遊戲物體 - 改善的匹配邏輯 + 穩定性檢查
   * 返回: { matched: boolean, progress: number, detectedClass: string | null }
   */
  checkForGameObject(
    detectionResult: DetectionResult,
    targetObject: string
  ): boolean {
    const targetClasses = GAME_OBJECTS[targetObject] || [targetObject];
    const detectedObjects = detectionResult.objects
      .filter(obj => obj.class !== 'unknown' && obj.score > this.CONFIDENCE_THRESHOLD)
      .sort((a: DetectedObject, b: DetectedObject) => b.score - a.score); // 按信心度排序

    // ✅ Stage 4: 優先匹配完全相同的類別
    for (const target of targetClasses) {
      for (const detected of detectedObjects) {
        const detectedClass = detected.class.toLowerCase();
        const targetClass = target.toLowerCase();

        // 完全匹配
        if (detectedClass === targetClass) {
          console.log(`[DETECTION] 完全匹配: ${detectedClass} === ${targetClass} (信心度: ${detected.score.toFixed(2)})`);

          // ✅ 檢查穩定性
          if (this.checkStability(detectedClass)) {
            return true;
          } else {
            return false; // 未達到穩定性要求
          }
        }

        // 包含匹配（降低優先級）
        if (detectedClass.includes(targetClass) || targetClass.includes(detectedClass)) {
          console.log(`[DETECTION] 包含匹配: ${detectedClass} <-> ${targetClass} (信心度: ${detected.score.toFixed(2)})`);

          // ✅ 包含匹配也需要穩定性檢查
          if (this.checkStability(detectedClass)) {
            return true;
          } else {
            return false; // 未達到穩定性要求
          }
        }
      }
    }

    // 記錄未匹配的情況以便調試
    if (detectedObjects.length > 0) {
      const detectedClasses = detectedObjects.map(obj => `${obj.class}(${obj.score.toFixed(2)})`).join(', ');
      console.log(`[DETECTION] 未找到 ${targetObject}，偵測到: ${detectedClasses}`);
    }

    return false;
  }

  /**
   * ✅ 新增: 獲取當前偵測狀態（用於 UI 顯示）
   * 返回: { isDetecting: boolean, progress: number, targetClass: string | null }
   */
  getDetectionStatus(
    detectionResult: DetectionResult,
    targetObject: string
  ): { isDetecting: boolean; progress: number; targetClass: string | null } {
    const targetClasses = GAME_OBJECTS[targetObject] || [targetObject];
    const detectedObjects = detectionResult.objects
      .filter(obj => obj.class !== 'unknown' && obj.score > this.CONFIDENCE_THRESHOLD);

    // 檢查是否有匹配的物體
    for (const target of targetClasses) {
      for (const detected of detectedObjects) {
        const detectedClass = detected.class.toLowerCase();
        const targetClass = target.toLowerCase();

        if (detectedClass === targetClass ||
            detectedClass.includes(targetClass) ||
            targetClass.includes(detectedClass)) {
          const progress = this.getDetectionProgress(detectedClass);
          return {
            isDetecting: progress > 0 && progress < this.STABILITY_COUNT,
            progress,
            targetClass: detected.class
          };
        }
      }
    }

    return { isDetecting: false, progress: 0, targetClass: null };
  }

  /**
   * 獲取最佳匹配的物體信息
   */
  getBestMatchingObject(
    detectionResult: DetectionResult,
    targetObject: string
  ): DetectedObject | null {
    const targetClasses = GAME_OBJECTS[targetObject] || [targetObject];
    let bestMatch: DetectedObject | null = null;
    let bestScore = 0;

    for (const obj of detectionResult.objects) {
      if (obj.score <= this.CONFIDENCE_THRESHOLD) continue;

      const objClass = obj.class.toLowerCase();
      for (const target of targetClasses) {
        const targetClass = target.toLowerCase();

        // 計算匹配分數
        let matchScore = 0;
        if (objClass === targetClass) {
          matchScore = obj.score * 1.0; // 完全匹配
        } else if (objClass.includes(targetClass) || targetClass.includes(objClass)) {
          matchScore = obj.score * 0.8; // 部分匹配
        }

        if (matchScore > bestScore) {
          bestScore = matchScore;
          bestMatch = obj;
        }
      }
    }

    return bestMatch;
  }

  /**
   * 獲取物體在畫面中的位置 - 改善版本
   */
  getObjectPosition(
    detectionResult: DetectionResult,
    targetObject: string
  ): { x: number; y: number; confidence: number } | null {
    const bestMatch = this.getBestMatchingObject(detectionResult, targetObject);

    if (bestMatch) {
      const [x, y, w, h] = bestMatch.bbox;
      return {
        x: x + w / 2, // 中心 X
        y: y + h / 2, // 中心 Y
        confidence: bestMatch.score,
      };
    }

    return null;
  }

  /**
   * 獲取所有偵測到的物體類別
   */
  getDetectedClasses(detectionResult: DetectionResult): string[] {
    return [...new Set(detectionResult.objects.map(obj => obj.class))];
  }

  /**
   * 獲取詳細的偵測報告 - 用於調試
   */
  getDetectionReport(detectionResult: DetectionResult): string {
    if (detectionResult.objects.length === 0) {
      return '未偵測到任何物體';
    }

    const report = detectionResult.objects
      .sort((a: DetectedObject, b: DetectedObject) => b.score - a.score)
      .map(obj => `${obj.class}: ${(obj.score * 100).toFixed(1)}%`)
      .join(', ');

    return `偵測到 ${detectionResult.objects.length} 個物體: ${report}`;
  }

  /**
   * 檢查特定物體的偵測歷史 - 用於改善準確度
   */
  analyzeDetectionAccuracy(
    detectionResults: DetectionResult[],
    targetObject: string
  ): {
    totalDetections: number;
    successfulDetections: number;
    averageConfidence: number;
    mostCommonFalsePositives: string[];
  } {
    let totalDetections = 0;
    let successfulDetections = 0;
    let confidenceSum = 0;
    const falsePositives: Record<string, number> = {};

    for (const result of detectionResults) {
      totalDetections++;
      const bestMatch = this.getBestMatchingObject(result, targetObject);

      if (bestMatch) {
        successfulDetections++;
        confidenceSum += bestMatch.score;
      } else {
        // 記錄可能的誤報
        result.objects.forEach(obj => {
          if (obj.score > this.CONFIDENCE_THRESHOLD) {
            falsePositives[obj.class] = (falsePositives[obj.class] || 0) + 1;
          }
        });
      }
    }

    const mostCommonFalsePositives = Object.entries(falsePositives)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([className]) => className);

    return {
      totalDetections,
      successfulDetections,
      averageConfidence: successfulDetections > 0 ? confidenceSum / successfulDetections : 0,
      mostCommonFalsePositives
    };
  }

  dispose() {
    if (this.model) {
      if (this.model.close) {
        this.model.close();
      } else if (this.model.dispose) {
        this.model.dispose();
      }
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
