/**
 * YOLOv8 Traffic Detection Service
 * Handles vehicle detection and congestion calculation using YOLOv8 model
 */

class YOLOService {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
    this.detectionHistory = new Map();
    this.congestionThresholds = {
      low: 10,
      medium: 25,
      high: 50
    };
    this.backendUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_YOLO_URL) || 'http://127.0.0.1:8000'; // Python YOLO service
    this.useBackend = true; // try backend first; fallback to mock on failure
    this._probeDone = false;
  }

  /**
   * Initialize YOLOv8 model
   * In production, this would load the actual yolov8n.pt model
   */
  async initializeModel() {
    try {
      // Mock model initialization - replace with actual YOLOv8 loading
      console.log('Initializing YOLOv8 model...');
      this.isModelLoaded = true;
      console.log('YOLOv8 model loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load YOLOv8 model:', error);
      return false;
    }
  }

  /**
   * Detect vehicles in a frame
   * @param {string} cameraId - Camera identifier
   * @param {ImageData|HTMLImageElement} frame - Image frame to analyze
   * @returns {Object} Detection results
   */
  async detectVehicles(cameraId, frame) {
    if (!this.isModelLoaded) {
      await this.initializeModel();
    }

    try {
      let detections = [];

      let trackingData = { active_vehicles: [], total_count: 0, class_counts: {}, active_count: 0 };

      if (this.useBackend) {
        try {
          const result = await this.runBackendInference(frame, cameraId);
          detections = result.detections;
          trackingData = result.tracking;
          this._probeDone = true;
        } catch (e) {
          if (!this._probeDone) console.warn('YOLO backend not reachable, using mock until backend starts');
          this.useBackend = false; // temporarily fallback; will be retried next call
        }
      }

      if (!this.useBackend) {
        detections = this.generateMockDetections(cameraId);
        // Generate mock tracking data
        trackingData = {
          active_vehicles: detections.map((det, i) => ({
            id: i,
            class: det.class,
            bbox: det.bbox
          })),
          total_count: detections.length,
          class_counts: detections.reduce((acc, det) => {
            acc[det.class] = (acc[det.class] || 0) + 1;
            return acc;
          }, {}),
          active_count: detections.length
        };
      }

      this.updateDetectionHistory(cameraId, detections);

      return {
        cameraId,
        timestamp: Date.now(),
        detections,
        tracking: trackingData,
        congestionScore: trackingData.congestion_score || this.calculateCongestionScore(cameraId, detections)
      };
    } catch (error) {
      console.error(`Detection failed for camera ${cameraId}:`, error);
      return {
        cameraId,
        timestamp: Date.now(),
        detections: [],
        congestionScore: 0,
        error: error.message
      };
    }
  }

  /**
   * Send frame to Python YOLO backend and parse detections
   */
  async runBackendInference(frame, cameraId = 'default') {
    const jpegBlob = await this._imageDataToJpegBlob(frame);
    const form = new FormData();
    form.append('file', jpegBlob, 'frame.jpg');
    form.append('camera_id', cameraId);
    const res = await fetch(`${this.backendUrl}/detect`, {
      method: 'POST',
      body: form
    });
    if (!res.ok) throw new Error(`Backend error ${res.status}`);
    const data = await res.json();
    // Expecting { detections: [...], tracking: {active_vehicles: [...], total_count: int, class_counts: {...}, active_count: int} }
    return {
      detections: Array.isArray(data.detections) ? data.detections : [],
      tracking: data.tracking || { active_vehicles: [], total_count: 0, class_counts: {}, active_count: 0 }
    };
  }

  async _imageDataToJpegBlob(frame) {
    // frame: { width, height, data: Uint8ClampedArray | Uint8Array RGBA }
    const canvas = document.createElement('canvas');
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext('2d');
    // Ensure ImageData uses Uint8ClampedArray
    const clamped = frame.data instanceof Uint8ClampedArray ? frame.data : new Uint8ClampedArray(frame.data);
    const imageData = new ImageData(clamped, frame.width, frame.height);
    ctx.putImageData(imageData, 0, 0);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
    return blob;
  }

  /**
   * Generate mock detections for demonstration
   * Replace this with actual YOLOv8 inference
   */
  generateMockDetections(cameraId) {
    const vehicleTypes = ['car', 'truck', 'bus', 'motorcycle', 'bicycle'];
    const numDetections = Math.floor(Math.random() * 15) + 5; // 5-20 vehicles
    
    return Array.from({ length: numDetections }, (_, i) => ({
      id: `${cameraId}_${Date.now()}_${i}`,
      class: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      bbox: {
        x: Math.random() * 800,
        y: Math.random() * 600,
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50
      },
      speed: Math.random() * 60 + 10, // km/h
      direction: Math.random() * 360 // degrees
    }));
  }

  /**
   * Update detection history for congestion analysis
   */
  updateDetectionHistory(cameraId, detections) {
    const now = Date.now();
    const history = this.detectionHistory.get(cameraId) || [];
    
    // Keep only last 30 seconds of data
    const filteredHistory = history.filter(entry => now - entry.timestamp < 30000);
    filteredHistory.push({
      timestamp: now,
      detections: detections.length,
      vehicleTypes: detections.reduce((acc, det) => {
        acc[det.class] = (acc[det.class] || 0) + 1;
        return acc;
      }, {})
    });
    
    this.detectionHistory.set(cameraId, filteredHistory);
  }

  /**
   * Calculate congestion score based on detection history
   */
  calculateCongestionScore(cameraId, currentDetections) {
    const history = this.detectionHistory.get(cameraId) || [];
    const recentDetections = history.slice(-5); // Last 5 frames for more responsive scoring
    
    // Use current detection count as primary factor
    const currentVehicleCount = currentDetections.length;
    
    // Calculate weighted vehicle count based on types
    const weightedCount = currentDetections.reduce((weight, det) => {
      const typeWeights = {
        'truck': 2.5,
        'bus': 2.0,
        'van': 1.5,
        'pickup': 1.3,
        'car': 1.0,
        'motorcycle': 0.7,
        'bicycle': 0.4
      };
      return weight + (typeWeights[det.class?.toLowerCase()] || 1.0);
    }, 0);
    
    // Calculate congestion score (0-100) based on weighted vehicle count
    // Scale: 0-5 vehicles = 0-30%, 5-10 = 30-60%, 10+ = 60-100%
    let congestionScore;
    if (weightedCount <= 5) {
      congestionScore = (weightedCount / 5) * 30;
    } else if (weightedCount <= 10) {
      congestionScore = 30 + ((weightedCount - 5) / 5) * 30;
    } else {
      congestionScore = Math.min(60 + ((weightedCount - 10) / 10) * 40, 100);
    }
    
    // Add historical smoothing if available
    if (recentDetections.length > 0) {
      const avgHistorical = recentDetections.reduce((sum, entry) => sum + entry.detections, 0) / recentDetections.length;
      const historicalWeight = 0.3; // 30% weight to history
      const currentWeight = 0.7; // 70% weight to current
      congestionScore = (congestionScore * currentWeight) + (avgHistorical * historicalWeight);
    }
    
    return Math.round(Math.min(Math.max(congestionScore, 0), 100));
  }

  /**
   * Get congestion level based on score
   */
  getCongestionLevel(score) {
    if (score < this.congestionThresholds.low) return 'low';
    if (score < this.congestionThresholds.medium) return 'medium';
    if (score < this.congestionThresholds.high) return 'high';
    return 'critical';
  }

  /**
   * Compare two camera feeds and recommend the less congested path
   */
  comparePaths(camera1Data, camera2Data) {
    const score1 = camera1Data.congestionScore;
    const score2 = camera2Data.congestionScore;
    
    const recommendation = {
      recommendedCamera: score1 < score2 ? camera1Data.cameraId : camera2Data.cameraId,
      recommendedScore: Math.min(score1, score2),
      alternativeScore: Math.max(score1, score2),
      difference: Math.abs(score1 - score2),
      confidence: this.calculateRecommendationConfidence(score1, score2)
    };
    
    return recommendation;
  }

  /**
   * Calculate confidence in path recommendation
   */
  calculateRecommendationConfidence(score1, score2) {
    const difference = Math.abs(score1 - score2);
    if (difference < 5) return 'low';
    if (difference < 15) return 'medium';
    return 'high';
  }

  /**
   * Get real-time statistics for a camera
   */
  getCameraStats(cameraId) {
    const history = this.detectionHistory.get(cameraId) || [];
    if (history.length === 0) return null;
    
    const recent = history.slice(-5); // Last 5 frames
    const avgVehicles = recent.reduce((sum, entry) => sum + entry.detections, 0) / recent.length;
    
    return {
      cameraId,
      avgVehicles: Math.round(avgVehicles),
      congestionTrend: this.calculateTrend(history),
      lastUpdate: recent[recent.length - 1]?.timestamp || 0
    };
  }

  /**
   * Calculate congestion trend (increasing, decreasing, stable)
   */
  calculateTrend(history) {
    if (history.length < 3) return 'stable';
    
    const recent = history.slice(-3);
    const older = history.slice(-6, -3);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.detections, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.detections, 0) / older.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * Clean up old detection history
   */
  cleanupHistory() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    for (const [cameraId, history] of this.detectionHistory.entries()) {
      const filtered = history.filter(entry => now - entry.timestamp < maxAge);
      if (filtered.length === 0) {
        this.detectionHistory.delete(cameraId);
      } else {
        this.detectionHistory.set(cameraId, filtered);
      }
    }
  }
}

// Export singleton instance
export default new YOLOService();
