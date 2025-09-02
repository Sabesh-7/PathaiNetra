import { useState, useEffect } from 'react';

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
      const interval = setInterval(() => {
        setCongestionData({
          'NH-86 Main Highway': Math.floor(Math.random() * 100),
          'Temple Road': Math.floor(Math.random() * 100),
          'Market Street': Math.floor(Math.random() * 100),
          'Bypass Road': Math.floor(Math.random() * 100),
          'Ring Road': Math.floor(Math.random() * 100)
        });

        setWalkingPaths({
          'Ghat Path 1': Math.floor(Math.random() * 100),
          'Ghat Path 2': Math.floor(Math.random() * 100),
          'Temple Approach': Math.floor(Math.random() * 100),
          'Market Route': Math.floor(Math.random() * 100)
        });

        setParkingData({
          'Zone 1 Near Ghat': { total: 500, occupied: Math.floor(Math.random() * 500) },
          'Zone 2 Temple': { total: 300, occupied: Math.floor(Math.random() * 300) },
          'Zone 3 Market': { total: 800, occupied: Math.floor(Math.random() * 800) },
          'Zone 4 Bypass': { total: 200, occupied: Math.floor(Math.random() * 200) }
        });

        setRealTimeStats({
          totalVehicles: Math.floor(Math.random() * 50000) + 30000,
          pedestrianCount: Math.floor(Math.random() * 200000) + 100000,
          avgCongestion: Math.floor(Math.random() * 100),
          emergencyLaneStatus: Math.floor(Math.random() * 20) + 80
        });

        if (Math.random() < 0.15) {
          setEmergencyAlerts(prev => [
            ...prev.slice(-4),
            {
              id: Date.now(),
              type: Math.random() < 0.5 ? 'violation' : 'congestion',
              category: Math.random() < 0.33 ? 'vehicle' : Math.random() < 0.5 ? 'pedestrian' : 'emergency',
              location: `Junction ${Math.floor(Math.random() * 10) + 1}`,
              time: new Date().toLocaleTimeString(),
              severity: Math.random() < 0.3 ? 'high' : 'medium',
              message: 'Traffic congestion detected'
            }
          ]);
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
