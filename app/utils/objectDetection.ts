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

// 遊戲物體映射 - 支持更多 COCO 數據集物體
const GAME_OBJECTS: Record<string, string[]> = {
  'cell phone': ['cell phone', 'phone', 'mobile phone', 'smartphone'],
  'cup': ['cup', 'mug', 'glass', 'bottle', 'water bottle'],
  'book': ['book', 'books'],
  'keyboard': ['keyboard', 'computer keyboard'],
  'bottle': ['bottle', 'water bottle', 'wine bottle'],
  'laptop': ['laptop', 'computer'],
  'mouse': ['mouse', 'computer mouse'],
  'monitor': ['monitor', 'tv', 'screen'],
  'chair': ['chair', 'bench'],
  'desk': ['desk', 'table', 'dining table'],
  'sky': ['sky', 'cloud'],
  'door': ['door'],
  'window': ['window'],
  'tv': ['tv', 'television', 'monitor'],
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
            scoreThreshold: 0.3,
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
            .filter((det: any) => (det.categories?.[0]?.score || 0) > 0.3)
            .map((det: any) => ({
              class: det.categories?.[0]?.categoryName || 'unknown',
              score: det.categories?.[0]?.score || 0,
              bbox: det.boundingBox ? 
                [det.boundingBox.originX, det.boundingBox.originY, det.boundingBox.width, det.boundingBox.height] :
                [0, 0, 0, 0],
            }));
        } catch (mpDetectError) {
          console.error('MediaPipe 檢測失敗，回退到 COCO-SSD:', mpDetectError);
          // 回退到 COCO-SSD
          this.useMediaPipe = false;
          const predictions = await this.model.detect(videoElement);
          detectedObjects = predictions
            .filter((pred: any) => (pred.score || pred.confidence || 0) > 0.3)
            .map((pred: any) => ({
              class: pred.class || COCO_CLASSES[pred.classId] || 'unknown',
              score: pred.score || pred.confidence || 0,
              bbox: pred.bbox || [pred.x, pred.y, pred.width, pred.height],
            }));
        }
      } else {
        // COCO-SSD 檢測
        const predictions = await this.model.detect(videoElement);
        detectedObjects = predictions
          .filter((pred: any) => (pred.score || pred.confidence || 0) > 0.3)
          .map((pred: any) => ({
            class: pred.class || COCO_CLASSES[pred.classId] || 'unknown',
            score: pred.score || pred.confidence || 0,
            bbox: pred.bbox || [pred.x, pred.y, pred.width, pred.height],
          }));
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
   * 檢查是否偵測到特定遊戲物體
   */
  checkForGameObject(
    detectionResult: DetectionResult,
    targetObject: string
  ): boolean {
    const targetClasses = GAME_OBJECTS[targetObject] || [targetObject];
    const detectedClasses = detectionResult.objects
      .map(obj => obj.class.toLowerCase())
      .filter(c => c !== 'unknown');

    return targetClasses.some(target =>
      detectedClasses.some(detected =>
        detected.includes(target.toLowerCase()) || 
        target.toLowerCase().includes(detected)
      )
    );
  }

  /**
   * 獲取物體在畫面中的位置
   */
  getObjectPosition(
    detectionResult: DetectionResult,
    targetObject: string
  ): { x: number; y: number; confidence: number } | null {
    const targetClasses = GAME_OBJECTS[targetObject] || [targetObject];

    for (const obj of detectionResult.objects) {
      const objClass = obj.class.toLowerCase();
      if (targetClasses.some(target => 
        objClass.includes(target.toLowerCase()) || 
        target.toLowerCase().includes(objClass)
      )) {
        const [x, y, w, h] = obj.bbox;
        return {
          x: x + w / 2, // 中心 X
          y: y + h / 2, // 中心 Y
          confidence: obj.score,
        };
      }
    }

    return null;
  }

  /**
   * 獲取所有偵測到的物體類別
   */
  getDetectedClasses(detectionResult: DetectionResult): string[] {
    return [...new Set(detectionResult.objects.map(obj => obj.class))];
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
