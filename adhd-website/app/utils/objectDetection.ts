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

// 遊戲物體映射 - 改善的物體識別映射表
const GAME_OBJECTS: Record<string, string[]> = {
  'cell phone': ['cell phone', 'phone', 'mobile phone', 'smartphone', 'remote'], // 手機可能被識別為遙控器
  'cup': ['cup', 'mug', 'wine glass', 'glass', 'bowl'], // 杯子可能被識別為碗
  'book': ['book', 'books'],
  'keyboard': ['keyboard', 'computer keyboard'],
  'bottle': ['bottle', 'water bottle', 'wine bottle', 'cup'], // 瓶子可能被識別為杯子
  'laptop': ['laptop', 'computer', 'monitor', 'tv'], // 筆電可能被識別為螢幕
  'mouse': ['mouse', 'computer mouse', 'remote'], // 滑鼠可能被識別為遙控器
  'monitor': ['monitor', 'tv', 'screen', 'television', 'laptop'],
  'chair': ['chair', 'bench', 'couch', 'bed'], // 椅子可能被識別為沙發或床
  'desk': ['dining table', 'table', 'desk', 'bed'], // 桌子主要識別為 dining table
  'sky': ['sky', 'cloud', 'ceiling'], // 天空可能需要看窗外，或被識別為天花板
  'door': ['door', 'refrigerator'], // 門可能被識別為冰箱
  'window': ['window', 'door', 'tv', 'monitor'], // 窗戶可能被識別為門或螢幕
  'tv': ['tv', 'television', 'monitor', 'laptop'],
  'bed': ['bed', 'couch', 'chair'], // 床可能被識別為沙發
  'clock': ['clock', 'cell phone'], // 時鐘可能被識別為手機
  'scissors': ['scissors', 'knife', 'fork'],
  'remote': ['remote', 'cell phone', 'mouse'],
  'microwave': ['microwave', 'oven', 'refrigerator'],
  'toaster': ['toaster', 'microwave'],
  'refrigerator': ['refrigerator', 'door', 'microwave'],
  'sink': ['sink', 'toilet', 'bowl'],
  'toilet': ['toilet', 'sink'],
  'backpack': ['backpack', 'handbag', 'suitcase', 'chair'], // 背包可能被識別為椅子上的物品
  'umbrella': ['umbrella', 'bottle'],
  'tie': ['tie', 'belt'],
  'banana': ['banana', 'remote'], // 香蕉可能被識別為遙控器（經典案例）
  'apple': ['apple', 'orange', 'ball'],
  'orange': ['orange', 'apple', 'ball'],
  'sandwich': ['sandwich', 'book'],
  'pizza': ['pizza', 'cake', 'plate'],
  'cake': ['cake', 'pizza', 'plate'],
  'donut': ['donut', 'cup', 'bowl'],
  'bowl': ['bowl', 'cup', 'sink'],
  'fork': ['fork', 'knife', 'spoon', 'scissors'],
  'knife': ['knife', 'fork', 'spoon', 'scissors'],
  'spoon': ['spoon', 'fork', 'knife'],
  'vase': ['vase', 'bottle', 'cup'],
  'potted plant': ['potted plant', 'vase'],
  'teddy bear': ['teddy bear', 'cat', 'dog'],
  'hair drier': ['hair drier', 'remote', 'cell phone'],
  'toothbrush': ['toothbrush', 'fork', 'spoon'],
  // 新增：缺失的物件映射
  'keys': ['scissors', 'fork', 'knife', 'remote', 'cell phone'], // 鑰匙可能被識別為小型金屬物品
  'mirror': ['tv', 'monitor', 'window', 'laptop'], // 鏡子可能被識別為螢幕或窗戶
  'person': ['person'], // 人物偵測
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

  // 優化偵測參數以平衡準確度和召回率
  private readonly CONFIDENCE_THRESHOLD = 0.30; // 進一步降低閾值以提高召回率（從 0.35 降到 0.30）
  private readonly NMS_THRESHOLD = 0.40; // 降低 NMS 閾值以減少重複偵測（從 0.45 降到 0.40）
  private readonly MAX_DETECTIONS = 25; // 增加最大偵測數量（從 20 增加到 25）

  async initialize() {
    if (this.isReady) return;
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      // 強制使用 MediaPipe（不再回退到 COCO-SSD）
      console.log('[DETECTION] 正在加載 MediaPipe EfficientDet Lite0 模型...');

      // 動態導入 MediaPipe
      const vision = await import('@mediapipe/tasks-vision' as any);
      const MPObjectDetector = vision.ObjectDetector;

      if (!MPObjectDetector) {
        throw new Error('MediaPipe ObjectDetector not found');
      }

      this.model = await MPObjectDetector.createFromOptions(
        undefined,
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
   * 檢查是否偵測到特定遊戲物體 - 改善的匹配邏輯
   */
  checkForGameObject(
    detectionResult: DetectionResult,
    targetObject: string
  ): boolean {
    const targetClasses = GAME_OBJECTS[targetObject] || [targetObject];
    const detectedObjects = detectionResult.objects
      .filter(obj => obj.class !== 'unknown' && obj.score > this.CONFIDENCE_THRESHOLD)
      .sort((a: DetectedObject, b: DetectedObject) => b.score - a.score); // 按信心度排序

    // 精確匹配優先
    for (const target of targetClasses) {
      for (const detected of detectedObjects) {
        const detectedClass = detected.class.toLowerCase();
        const targetClass = target.toLowerCase();

        // 完全匹配
        if (detectedClass === targetClass) {
          console.log(`[DETECTION] 完全匹配: ${detectedClass} === ${targetClass} (信心度: ${detected.score.toFixed(2)})`);
          return true;
        }

        // 包含匹配
        if (detectedClass.includes(targetClass) || targetClass.includes(detectedClass)) {
          console.log(`[DETECTION] 包含匹配: ${detectedClass} <-> ${targetClass} (信心度: ${detected.score.toFixed(2)})`);
          return true;
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
