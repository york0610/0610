/**
 * 物體偵測準確度測試
 * 測試信心度閾值、穩定性檢查和物體映射
 */

import { ObjectDetector, DetectionResult, DetectedObject } from '@/app/utils/objectDetection';

describe('物體偵測準確度改進', () => {
  let detector: ObjectDetector;

  beforeEach(() => {
    detector = new ObjectDetector();
    // 清除偵測歷史
    detector.clearAllDetectionHistory();
  });

  afterEach(() => {
    detector.dispose();
  });

  describe('Stage 1: 信心度閾值過濾', () => {
    test('應該過濾低信心度的偵測 (< 55%)', () => {
      const lowConfidenceResult: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.30, bbox: [0, 0, 100, 100] }, // 30% - 應該被過濾
          { class: 'book', score: 0.45, bbox: [0, 0, 100, 100] }, // 45% - 應該被過濾
        ],
        timestamp: Date.now()
      };

      const matched = detector.checkForGameObject(lowConfidenceResult, 'cup');
      expect(matched).toBe(false);
    });

    test('應該接受高信心度的偵測 (>= 55%)', () => {
      const highConfidenceResult: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.60, bbox: [0, 0, 100, 100] }, // 60% - 應該通過
        ],
        timestamp: Date.now()
      };

      // 需要連續偵測 3 次才會匹配
      detector.checkForGameObject(highConfidenceResult, 'cup');
      detector.checkForGameObject(highConfidenceResult, 'cup');
      const matched = detector.checkForGameObject(highConfidenceResult, 'cup');
      
      expect(matched).toBe(true);
    });
  });

  describe('Stage 2: 穩定性檢查', () => {
    test('單次偵測不應該觸發匹配', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      const matched = detector.checkForGameObject(result, 'cup');
      expect(matched).toBe(false); // 第一次偵測，不應該匹配
    });

    test('連續 3 次偵測應該觸發匹配', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 第一次
      const match1 = detector.checkForGameObject(result, 'cup');
      expect(match1).toBe(false);

      // 第二次
      const match2 = detector.checkForGameObject(result, 'cup');
      expect(match2).toBe(false);

      // 第三次 - 應該匹配
      const match3 = detector.checkForGameObject(result, 'cup');
      expect(match3).toBe(true);
    });

    test('超過時間窗口的偵測應該被清除', async () => {
      const result: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 第一次偵測
      detector.checkForGameObject(result, 'cup');

      // 等待超過時間窗口 (2 秒)
      await new Promise(resolve => setTimeout(resolve, 2100));

      // 再次偵測，應該重新開始計數
      const matched = detector.checkForGameObject(result, 'cup');
      expect(matched).toBe(false); // 應該重新開始，不匹配
    });

    test('getDetectionProgress 應該返回正確的進度', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 初始進度應該是 0
      expect(detector.getDetectionProgress('cup')).toBe(0);

      // 第一次偵測
      detector.checkForGameObject(result, 'cup');
      expect(detector.getDetectionProgress('cup')).toBe(1);

      // 第二次偵測
      detector.checkForGameObject(result, 'cup');
      expect(detector.getDetectionProgress('cup')).toBe(2);

      // 第三次偵測
      detector.checkForGameObject(result, 'cup');
      expect(detector.getDetectionProgress('cup')).toBe(3);
    });
  });

  describe('Stage 3: 物體映射優化', () => {
    test('cup 不應該匹配 bowl (已移除映射)', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'bowl', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 連續偵測 3 次
      detector.checkForGameObject(result, 'cup');
      detector.checkForGameObject(result, 'cup');
      const matched = detector.checkForGameObject(result, 'cup');

      expect(matched).toBe(false); // bowl 不再映射到 cup
    });

    test('cup 應該匹配 mug (保留映射)', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'mug', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 連續偵測 3 次
      detector.checkForGameObject(result, 'cup');
      detector.checkForGameObject(result, 'cup');
      const matched = detector.checkForGameObject(result, 'cup');

      expect(matched).toBe(true); // mug 仍然映射到 cup
    });

    test('cell phone 不應該匹配 remote (已移除映射)', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'remote', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 連續偵測 3 次
      detector.checkForGameObject(result, 'cell phone');
      detector.checkForGameObject(result, 'cell phone');
      const matched = detector.checkForGameObject(result, 'cell phone');

      expect(matched).toBe(false); // remote 不再映射到 cell phone
    });

    test('laptop 不應該匹配 monitor (已移除映射)', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'monitor', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 連續偵測 3 次
      detector.checkForGameObject(result, 'laptop');
      detector.checkForGameObject(result, 'laptop');
      const matched = detector.checkForGameObject(result, 'laptop');

      expect(matched).toBe(false); // monitor 不再映射到 laptop
    });
  });

  describe('Stage 4: 偵測狀態 API', () => {
    test('getDetectionStatus 應該返回正確的狀態', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      // 初始狀態
      const status0 = detector.getDetectionStatus(result, 'cup');
      expect(status0.isDetecting).toBe(false);
      expect(status0.progress).toBe(0);

      // 第一次偵測
      detector.checkForGameObject(result, 'cup');
      const status1 = detector.getDetectionStatus(result, 'cup');
      expect(status1.isDetecting).toBe(true);
      expect(status1.progress).toBe(1);
      expect(status1.targetClass).toBe('cup');

      // 第二次偵測
      detector.checkForGameObject(result, 'cup');
      const status2 = detector.getDetectionStatus(result, 'cup');
      expect(status2.isDetecting).toBe(true);
      expect(status2.progress).toBe(2);

      // 第三次偵測（完成）
      detector.checkForGameObject(result, 'cup');
      const status3 = detector.getDetectionStatus(result, 'cup');
      expect(status3.isDetecting).toBe(false); // 已完成，不再偵測中
      expect(status3.progress).toBe(3);
    });

    test('未匹配的物體應該返回空狀態', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'book', score: 0.70, bbox: [0, 0, 100, 100] },
        ],
        timestamp: Date.now()
      };

      const status = detector.getDetectionStatus(result, 'cup');
      expect(status.isDetecting).toBe(false);
      expect(status.progress).toBe(0);
      expect(status.targetClass).toBe(null);
    });
  });

  describe('整合測試', () => {
    test('完整的偵測流程', () => {
      const result: DetectionResult = {
        objects: [
          { class: 'cup', score: 0.75, bbox: [0, 0, 100, 100] },
          { class: 'book', score: 0.40, bbox: [100, 100, 100, 100] }, // 低信心度，應該被過濾
        ],
        timestamp: Date.now()
      };

      // 第一次偵測
      const match1 = detector.checkForGameObject(result, 'cup');
      const status1 = detector.getDetectionStatus(result, 'cup');
      expect(match1).toBe(false);
      expect(status1.isDetecting).toBe(true);
      expect(status1.progress).toBe(1);

      // 第二次偵測
      const match2 = detector.checkForGameObject(result, 'cup');
      const status2 = detector.getDetectionStatus(result, 'cup');
      expect(match2).toBe(false);
      expect(status2.isDetecting).toBe(true);
      expect(status2.progress).toBe(2);

      // 第三次偵測 - 成功
      const match3 = detector.checkForGameObject(result, 'cup');
      const status3 = detector.getDetectionStatus(result, 'cup');
      expect(match3).toBe(true);
      expect(status3.progress).toBe(3);

      // 清除歷史後應該重新開始
      detector.clearAllDetectionHistory();
      const match4 = detector.checkForGameObject(result, 'cup');
      expect(match4).toBe(false);
      expect(detector.getDetectionProgress('cup')).toBe(1);
    });
  });
});

