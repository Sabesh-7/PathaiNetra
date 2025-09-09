import React from 'react';
import { Camera } from 'lucide-react';

const CameraFeed = React.memo(({ title, type, status = 'active', congestionScore = 0, vehicleCount = 0, detections = [] }) => (
  <div className="bg-gray-900 rounded-lg p-4 relative">
    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <div className="absolute top-2 left-2 flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <span className="text-white text-xs">LIVE</span>
      </div>
      
      {/* Real-time detection overlays */}
      {detections.slice(0, 8).map((detection, index) => (
        <div
          key={detection.id || index}
          className="absolute border-2 border-green-400 bg-green-400/20"
          style={{
            left: `${detection.bbox?.x || Math.random() * 80 + 10}%`,
            top: `${detection.bbox?.y || Math.random() * 60 + 20}%`,
            width: `${detection.bbox?.width || 8}%`,
            height: `${detection.bbox?.height || 6}%`,
            animationDelay: `${index * 0.1}s`
          }}
        >
          <span className="text-green-400 text-xs absolute -top-5">
            {detection.class || 'Vehicle'}
          </span>
        </div>
      ))}
      
      {/* Fallback mock detections if no real data */}
      {detections.length === 0 && type === 'vehicle' && (
        <div className="absolute top-1/4 left-1/3 w-8 h-6 border-2 border-green-400 bg-green-400/20">
          <span className="text-green-400 text-xs absolute -top-5">Car</span>
        </div>
      )}
      
      {detections.length === 0 && type === 'pedestrian' && (
        <div className="absolute top-1/3 left-1/4 w-4 h-8 border-2 border-blue-400 bg-blue-400/20">
          <span className="text-blue-400 text-xs absolute -top-5">Person</span>
        </div>
      )}
      
      {detections.length === 0 && type === 'emergency' && (
        <div className="absolute top-1/3 right-1/4 w-8 h-6 border-2 border-red-400 bg-red-400/20">
          <span className="text-red-400 text-xs absolute -top-5">Violation</span>
        </div>
      )}
      
      <Camera className="w-12 h-12 text-gray-600" />
    </div>
    <div className="mt-2 flex justify-between items-center">
      <h4 className="text-white font-medium text-sm">{title}</h4>
      <span className={`px-2 py-1 rounded text-xs ${
        status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
      }`}>
        {status.toUpperCase()}
      </span>
    </div>
    <div className="mt-1 text-xs text-gray-400">
      {type === 'vehicle' && 'YOLOv8 Vehicle Detection'}
      {type === 'pedestrian' && 'DeepSORT Crowd Tracking'}
      {type === 'emergency' && 'Lane Violation Monitor'}
    </div>
    
    {/* Real-time stats */}
    {(congestionScore > 0 || vehicleCount > 0) && (
      <div className="mt-2 flex justify-between text-xs text-gray-300">
        <span>Congestion: {congestionScore}%</span>
        <span>Vehicles: {vehicleCount}</span>
      </div>
    )}
  </div>
));

export default CameraFeed;
