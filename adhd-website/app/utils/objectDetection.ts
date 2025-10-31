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
  'cell phone': ['cell phone', 'phone', 'mobile phone', 'smartphone'],
  'cup': ['cup', 'mug', 'wine glass', 'glass'],
  'book': ['book', 'books'],
  'keyboard': ['keyboard', 'computer keyboard'],
  'bottle': ['bottle', 'water bottle', 'wine bottle'],
  'laptop': ['laptop', 'computer'],
  'mouse': ['mouse', 'computer mouse'],
  'monitor': ['monitor', 'tv', 'screen', 'television'],
  'chair': ['chair', 'bench', 'couch'],
  'desk': ['dining table', 'table', 'desk'], // 桌子主要識別為 dining table
  'sky': ['sky', 'cloud'],
  'door': ['door'],
  'window': ['window'],
  'tv': ['tv', 'television', 'monitor'],
  'bed': ['bed', 'couch'], // 床可能被識別為沙發
  'clock': ['clock'],
  'scissors': ['scissors'],
  'remote': ['remote'],
  'microwave': ['microwave', 'oven'],
  'toaster': ['toaster'],
  'refrigerator': ['refrigerator'],
  'sink': ['sink'],
  'toilet': ['toilet'],
  'backpack': ['backpack', 'handbag', 'suitcase'],
  'umbrella': ['umbrella'],
  'tie': ['tie'],
  'banana': ['banana'],
  'apple': ['apple'],
  'orange': ['orange'],
  'sandwich': ['sandwich'],
  'pizza': ['pizza'],
  'cake': ['cake'],
  'donut': ['donut'],
  'bowl': ['bowl'],
  'fork': ['fork'],
  'knife': ['knife'],
  'spoon': ['spoon'],
  'vase': ['vase'],
  'potted plant': ['potted plant'],
  'teddy bear': ['teddy bear'],
  'hair drier': ['hair drier'],
  'toothbrush': ['toothbrush'],
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

  // 改善的偵測參數
  private readonly CONFIDENCE_THRESHOLD = 0.25; // 降低閾值以提高召回率
  private readonly NMS_THRESHOLD = 0.45; // 非極大值抑制閾值
  private readonly MAX_DETECTIONS = 20; // 最大偵測數量

  async initialize() {
    if (this.isReady) return;
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      // 嘗試加載 MediaPipe
      try {
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
        console.log('MediaPipe 物體偵測模型已加載');
      } catch (mpError) {
        console.warn('MediaPipe 加載失敗，回退到 COCO-SSD:', mpError);
        // 回退到 COCO-SSD
        const tf = await import('@tensorflow/tfjs');
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        this.model = await cocoSsd.load();
        this.useMediaPipe = false;
        this.isReady = true;
        console.log('COCO-SSD 物體偵測模型已加載');
      }
    } catch (error) {
      console.error('物體偵測模型加載失敗:', error);
      this.isLoading = false;
      this.isReady = false;
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
