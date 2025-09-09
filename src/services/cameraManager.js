/**
 * Camera Management Service
 * Handles dual camera inputs and real-time processing
 */

import yoloService from './yoloService';

class CameraManager {
  constructor() {
    this.cameras = new Map();
    this.processingInterval = null;
    this.isProcessing = false;
    this.callbacks = new Map();
    this.concurrentLimit = 2; // limit parallel processing for smoother UI
    this.offscreenCanvases = new Map(); // per-camera offscreen canvas for frame capture
  }

  /**
   * Register a camera
   * @param {string} cameraId - Unique camera identifier
   * @param {string} cameraName - Human-readable camera name
   * @param {string} cameraPath - Camera source path (URL, file path, etc.)
   * @param {Object} config - Camera configuration
   */
  registerCamera(cameraId, cameraName, cameraPath, config = {}) {
    const cameraConfig = {
      id: cameraId,
      name: cameraName,
      path: cameraPath,
      videoEl: null, // optional HTMLVideoElement attached
      isActive: false,
      lastFrame: null,
      detectionHistory: [],
      config: {
        frameRate: config.frameRate || 30,
        resolution: config.resolution || { width: 1280, height: 720 },
        detectionInterval: config.detectionInterval || 500, // ms - faster processing
        ...config
      }
    };

    this.cameras.set(cameraId, cameraConfig);
    console.log(`Camera registered: ${cameraName} (${cameraId})`);
  }

  /**
   * Attach an HTMLVideoElement to a camera for local file/URL playback
   */
  attachVideoElement(cameraId, videoEl) {
    const camera = this.cameras.get(cameraId);
    if (!camera) return;
    camera.videoEl = videoEl;
    console.log(`Video element attached to camera ${camera.name}`);
  }

  /**
   * Start processing cameras
   */
  async startProcessing() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    console.log('Starting camera processing...');

    // Initialize YOLO service
    await yoloService.initializeModel();

    // Start processing loop
    let isTickRunning = false;
    this.processingInterval = setInterval(async () => {
      if (isTickRunning) return; // prevent overlapping cycles
      isTickRunning = true;
      try {
        await this.processAllCameras();
      } finally {
        isTickRunning = false;
      }
    }, 800); // tighter loop with internal staggering

    console.log('Camera processing started');
  }

  /**
   * Stop processing cameras
   */
  stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log('Camera processing stopped');
  }

  /**
   * Process all active cameras
   */
  async processAllCameras() {
    const now = Date.now();
    const activeCameras = Array.from(this.cameras.values()).filter(cam => cam.isActive);
    
    if (activeCameras.length === 0) return;

    // Select only cameras due based on detectionInterval, and stagger work
    const dueCameras = activeCameras
      .filter(cam => !cam._nextDueAt || now >= cam._nextDueAt)
      .sort((a, b) => (a._nextDueAt || 0) - (b._nextDueAt || 0))
      .slice(0, this.concurrentLimit);

    if (dueCameras.length === 0) return;

    // Process a limited batch in parallel
    const promises = dueCameras.map(camera => this.processCamera(camera));
    const results = await Promise.allSettled(promises);

    // Handle results
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Camera processing failed for ${activeCameras[index].name}:`, result.reason);
      }
    });

    // Clean up old data
    yoloService.cleanupHistory();
  }

  /**
   * Process a single camera
   */
  async processCamera(camera) {
    try {
      // Simulate frame capture - replace with actual camera capture
      const frame = await this.captureFrame(camera);
      
      if (!frame) {
        console.warn(`No frame captured for camera ${camera.name}`);
        return;
      }

      // Detect vehicles using YOLO
      const detectionResult = await yoloService.detectVehicles(camera.id, frame);
      
      // Update camera data
      camera.lastFrame = frame;
      camera.detectionHistory.push(detectionResult);
      camera._nextDueAt = Date.now() + (camera.config.detectionInterval || 1000);
      
      // Keep only last 100 detection results
      if (camera.detectionHistory.length > 100) {
        camera.detectionHistory = camera.detectionHistory.slice(-100);
      }

      // Notify callbacks
      this.notifyCallbacks(camera.id, detectionResult);

    } catch (error) {
      console.error(`Error processing camera ${camera.name}:`, error);
    }
  }

  /**
   * Simulate frame capture
   * Replace with actual camera capture implementation
   */
  async captureFrame(camera) {
    // Prefer capturing from an attached HTMLVideoElement if available
    const video = camera.videoEl;
    if (video && video.readyState >= 2) {
      const width = video.videoWidth || camera.config.resolution.width;
      const height = video.videoHeight || camera.config.resolution.height;

      let canvas = this.offscreenCanvases.get(camera.id);
      if (!canvas) {
        canvas = document.createElement('canvas');
        this.offscreenCanvases.set(camera.id, canvas);
      }
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);

      return {
        width,
        height,
        timestamp: Date.now(),
        data: imageData.data
      };
    }

    // Fallback mock frame if no video is attached/ready
    return {
      width: camera.config.resolution.width,
      height: camera.config.resolution.height,
      timestamp: Date.now(),
      data: new Uint8Array(camera.config.resolution.width * camera.config.resolution.height * 4)
    };
  }

  /**
   * Activate a camera
   */
  activateCamera(cameraId) {
    const camera = this.cameras.get(cameraId);
    if (camera) {
      camera.isActive = true;
      console.log(`Camera activated: ${camera.name}`);
    }
  }

  /**
   * Deactivate a camera
   */
  deactivateCamera(cameraId) {
    const camera = this.cameras.get(cameraId);
    if (camera) {
      camera.isActive = false;
      console.log(`Camera deactivated: ${camera.name}`);
    }
  }

  /**
   * Get camera status
   */
  getCameraStatus(cameraId) {
    const camera = this.cameras.get(cameraId);
    if (!camera) return null;

    const stats = yoloService.getCameraStats(cameraId);
    const lastDetection = camera.detectionHistory[camera.detectionHistory.length - 1];

    return {
      ...camera,
      stats,
      lastDetection,
      isOnline: camera.isActive && lastDetection && (Date.now() - lastDetection.timestamp) < 5000
    };
  }

  /**
   * Get all cameras status
   */
  getAllCamerasStatus() {
    const statuses = [];
    for (const cameraId of this.cameras.keys()) {
      statuses.push(this.getCameraStatus(cameraId));
    }
    return statuses;
  }

  /**
   * Compare two cameras and get path recommendation
   */
  compareCameras(cameraId1, cameraId2) {
    const camera1 = this.cameras.get(cameraId1);
    const camera2 = this.cameras.get(cameraId2);

    if (!camera1 || !camera2) {
      throw new Error('One or both cameras not found');
    }

    const lastDetection1 = camera1.detectionHistory[camera1.detectionHistory.length - 1];
    const lastDetection2 = camera2.detectionHistory[camera2.detectionHistory.length - 1];

    if (!lastDetection1 || !lastDetection2) {
      throw new Error('No recent detection data available');
    }

    const recommendation = yoloService.comparePaths(lastDetection1, lastDetection2);
    
    return {
      camera1: {
        id: camera1.id,
        name: camera1.name,
        congestionScore: lastDetection1.congestionScore,
        congestionLevel: yoloService.getCongestionLevel(lastDetection1.congestionScore)
      },
      camera2: {
        id: camera2.id,
        name: camera2.name,
        congestionScore: lastDetection2.congestionScore,
        congestionLevel: yoloService.getCongestionLevel(lastDetection2.congestionScore)
      },
      recommendation
    };
  }

  /**
   * Register callback for camera updates
   */
  onCameraUpdate(cameraId, callback) {
    if (!this.callbacks.has(cameraId)) {
      this.callbacks.set(cameraId, []);
    }
    this.callbacks.get(cameraId).push(callback);
  }

  /**
   * Unregister callback
   */
  offCameraUpdate(cameraId, callback) {
    const callbacks = this.callbacks.get(cameraId);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Notify callbacks of camera updates
   */
  notifyCallbacks(cameraId, detectionResult) {
    const callbacks = this.callbacks.get(cameraId);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(detectionResult);
        } catch (error) {
          console.error('Callback error:', error);
        }
      });
    }
  }

  /**
   * Get real-time traffic data for dashboard
   */
  getTrafficData() {
    const cameras = this.getAllCamerasStatus();
    const activeCameras = cameras.filter(cam => cam.isOnline);
    
    const totalVehicles = activeCameras.reduce((sum, cam) => {
      return sum + (cam.lastDetection?.detections?.length || 0);
    }, 0);

    const avgCongestion = activeCameras.length > 0 
      ? activeCameras.reduce((sum, cam) => sum + (cam.lastDetection?.congestionScore || 0), 0) / activeCameras.length
      : 0;

    return {
      totalCameras: cameras.length,
      activeCameras: activeCameras.length,
      totalVehicles,
      avgCongestion: Math.round(avgCongestion),
      cameras: activeCameras.map(cam => ({
        id: cam.id,
        name: cam.name,
        congestionScore: cam.lastDetection?.congestionScore || 0,
        congestionLevel: yoloService.getCongestionLevel(cam.lastDetection?.congestionScore || 0),
        vehicleCount: cam.lastDetection?.detections?.length || 0,
        lastUpdate: cam.lastDetection?.timestamp || 0
      }))
    };
  }
}

// Export singleton instance
export default new CameraManager();
