import React from 'react';
import { Camera } from 'lucide-react';

const CameraFeed = ({ title, type, status = 'active' }) => (
  <div className="bg-gray-900 rounded-lg p-4 relative">
    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <div className="absolute top-2 left-2 flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <span className="text-white text-xs">LIVE</span>
      </div>
      
      {type === 'vehicle' && (
        <div className="absolute top-1/4 left-1/3 w-8 h-6 border-2 border-green-400 bg-green-400/20">
          <span className="text-green-400 text-xs absolute -top-5">Car</span>
        </div>
      )}
      
      {type === 'pedestrian' && (
        <div className="absolute top-1/3 left-1/4 w-4 h-8 border-2 border-blue-400 bg-blue-400/20">
          <span className="text-blue-400 text-xs absolute -top-5">Person</span>
        </div>
      )}
      
      {type === 'emergency' && (
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
  </div>
);

export default CameraFeed;
