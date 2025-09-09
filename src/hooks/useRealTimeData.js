import { useState, useEffect } from 'react';
import cameraManager from '../services/cameraManager';
import yoloService from '../services/yoloService';

export const useRealTimeData = (currentView) => {
  const [congestionData, setCongestionData] = useState({});
  const [parkingData, setParkingData] = useState({});
  const [walkingPaths, setWalkingPaths] = useState({});
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({
    totalVehicles: 0,
    pedestrianCount: 0,
    avgCongestion: 0,
    emergencyLaneStatus: 95
  });

  useEffect(() => {
    if (currentView === 'civilian' || currentView === 'admin') {
      // Initialize cameras if not already done
      if (cameraManager.getAllCamerasStatus().length === 0) {
        cameraManager.registerCamera(
          'nh86_main',
          'NH-86 Main Highway',
          '/api/camera/nh86',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );
        cameraManager.registerCamera(
          'temple_road',
          'Temple Road',
          '/api/camera/temple',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );
        cameraManager.registerCamera(
          'market_street',
          'Market Street',
          '/api/camera/market',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );
        cameraManager.registerCamera(
          'bypass_road',
          'Bypass Road',
          '/api/camera/bypass',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );
        cameraManager.registerCamera(
          'ring_road',
          'Ring Road',
          '/api/camera/ring',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );

        // Register pedestrian cameras
        cameraManager.registerCamera(
          'ghat_path1',
          'Ghat Path 1',
          '/api/camera/ghat1',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );
        cameraManager.registerCamera(
          'ghat_path2',
          'Ghat Path 2',
          '/api/camera/ghat2',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );
        cameraManager.registerCamera(
          'temple_approach',
          'Temple Approach',
          '/api/camera/temple_approach',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );
        cameraManager.registerCamera(
          'market_route',
          'Market Route',
          '/api/camera/market_route',
          { frameRate: 30, resolution: { width: 1280, height: 720 } }
        );

        // Start processing
        cameraManager.startProcessing();
        
        // Activate all cameras
        const allCameras = cameraManager.getAllCamerasStatus();
        allCameras.forEach(camera => {
          cameraManager.activateCamera(camera.id);
        });
      }

      const interval = setInterval(() => {
        // Get real-time traffic data from YOLO service
        const trafficData = cameraManager.getTrafficData();
        
        // Update congestion data based on real camera feeds
        const congestion = {};
        trafficData.cameras.forEach(camera => {
          congestion[camera.name] = camera.congestionScore;
        });
        setCongestionData(congestion);

        // Update walking paths (pedestrian cameras)
        const pedestrianCameras = trafficData.cameras.filter(cam => 
          cam.name.includes('Path') || cam.name.includes('Approach') || cam.name.includes('Route')
        );
        const walkingPathsData = {};
        pedestrianCameras.forEach(camera => {
          walkingPathsData[camera.name] = camera.congestionScore;
        });
        setWalkingPaths(walkingPathsData);

        // Update parking data (simulated based on congestion)
        const parkingZones = {
          'Zone 1 Near Ghat': { total: 500, occupied: Math.floor(congestion['Ghat Path 1'] * 5) },
          'Zone 2 Temple': { total: 300, occupied: Math.floor(congestion['Temple Approach'] * 3) },
          'Zone 3 Market': { total: 800, occupied: Math.floor(congestion['Market Street'] * 8) },
          'Zone 4 Bypass': { total: 200, occupied: Math.floor(congestion['Bypass Road'] * 2) }
        };
        setParkingData(parkingZones);

        // Update real-time stats
        setRealTimeStats({
          totalVehicles: trafficData.totalVehicles,
          pedestrianCount: Math.floor(trafficData.totalVehicles * 0.3), // Estimate pedestrians
          avgCongestion: trafficData.avgCongestion,
          emergencyLaneStatus: Math.max(95 - trafficData.avgCongestion * 0.1, 80)
        });

        // Generate emergency alerts based on high congestion
        if (trafficData.avgCongestion > 80 && Math.random() < 0.3) {
          const highCongestionCameras = trafficData.cameras.filter(cam => cam.congestionScore > 80);
          if (highCongestionCameras.length > 0) {
            const randomCamera = highCongestionCameras[Math.floor(Math.random() * highCongestionCameras.length)];
            setEmergencyAlerts(prev => [
              ...prev.slice(-4),
              {
                id: Date.now(),
                type: 'congestion',
                category: 'vehicle',
                location: randomCamera.name,
                time: new Date().toLocaleTimeString(),
                severity: randomCamera.congestionScore > 90 ? 'high' : 'medium',
                message: `High congestion detected at ${randomCamera.name}`
              }
            ]);
          }
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentView]);

  return {
    congestionData,
    parkingData,
    walkingPaths,
    emergencyAlerts,
    realTimeStats
  };
};
