import React, { useState, useEffect } from 'react';
import { Camera, Play, Pause, RotateCcw, Settings, AlertCircle, Video } from 'lucide-react';
import cameraManager from '../../services/cameraManager';
import PathRecommendation from './PathRecommendation';

const DualCameraView = () => {
  const [cameras, setCameras] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState({}); // { cameraId: { name, status: 'selected'|'loaded' } }
  const [videoUrls, setVideoUrls] = useState({}); // { cameraId: objectUrl }
  const [uploadErrors, setUploadErrors] = useState({}); // { cameraId: errorMessage }
  const videoRefs = {
    camera1: React.useRef(null),
    camera2: React.useRef(null)
  };
  const fileInputRefs = {
    camera1: React.useRef(null),
    camera2: React.useRef(null)
  };

  const handleVideoSelect = (cameraId, file) => {
    console.log('File selected:', file?.name, 'for camera:', cameraId);
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    // Show immediate feedback
    setUploads(prev => ({ ...prev, [cameraId]: { name: file.name, status: 'selected' } }));
    setUploadErrors(prev => ({ ...prev, [cameraId]: undefined }));
    
    // Revoke old URL if exists
    setVideoUrls(prev => {
      const prevUrl = prev[cameraId];
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return prev;
    });
    
    const url = URL.createObjectURL(file);
    console.log('Created URL:', url);
    setVideoUrls(prev => ({ ...prev, [cameraId]: url }));
    
    // Wait for video element to be available
    const checkVideoElement = () => {
      const videoEl = videoRefs[cameraId]?.current;
      if (!videoEl) {
        console.log('Video element not ready, retrying...');
        setTimeout(checkVideoElement, 100);
        return;
      }
      
      console.log('Video element found, setting up events');
      
      const onLoaded = () => {
        console.log('Video loaded successfully');
        videoEl.play().catch(() => {});
        cameraManager.attachVideoElement(cameraId, videoEl);
        setUploads(prev => ({ ...prev, [cameraId]: { name: file.name, status: 'loaded' } }));
        videoEl.removeEventListener('loadeddata', onLoaded);
        videoEl.removeEventListener('error', onError);
      };
      
      const onError = (e) => {
        console.error('Video load error:', e);
        setUploadErrors(prev => ({ ...prev, [cameraId]: 'Failed to load video. Try a different MP4 file.' }));
        setUploads(prev => ({ ...prev, [cameraId]: { name: file.name, status: 'error' } }));
        videoEl.removeEventListener('loadeddata', onLoaded);
        videoEl.removeEventListener('error', onError);
      };
      
      videoEl.addEventListener('loadeddata', onLoaded);
      videoEl.addEventListener('error', onError);
      
      // Set src and load
      videoEl.src = url;
      videoEl.load();
    };
    
    checkVideoElement();
  };

  useEffect(() => {
    initializeCameras();
    return () => {
      cameraManager.stopProcessing();
    };
  }, []);

  const initializeCameras = async () => {
    try {
      // Register two cameras for path comparison
      cameraManager.registerCamera(
        'camera1',
        'NH-86 Main Highway',
        '/api/camera/1',
        { frameRate: 30, resolution: { width: 1280, height: 720 } }
      );

      cameraManager.registerCamera(
        'camera2',
        'Temple Road Bypass',
        '/api/camera/2',
        { frameRate: 30, resolution: { width: 1280, height: 720 } }
      );

      // Get initial camera status
      const cameraStatuses = cameraManager.getAllCamerasStatus();
      setCameras(cameraStatuses);
      setSelectedCameras(['camera1', 'camera2']);

    } catch (error) {
      console.error('Failed to initialize cameras:', error);
    }
  };

  const startProcessing = async () => {
    try {
      setIsLoading(true);
      await cameraManager.startProcessing();
      
      // Activate selected cameras
      selectedCameras.forEach(cameraId => {
        cameraManager.activateCamera(cameraId);
      });

      setIsProcessing(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Failed to start processing:', error);
      setIsLoading(false);
    }
  };

  const stopProcessing = () => {
    cameraManager.stopProcessing();
    selectedCameras.forEach(cameraId => {
      cameraManager.deactivateCamera(cameraId);
    });
    setIsProcessing(false);
  };

  const updateCameraData = () => {
    const cameraStatuses = cameraManager.getAllCamerasStatus();
    setCameras(cameraStatuses);
  };

  const performComparison = () => {
    if (selectedCameras.length === 2) {
      try {
        const comparison = cameraManager.compareCameras(selectedCameras[0], selectedCameras[1]);
        setComparisonData(comparison);
      } catch (error) {
        console.error('Comparison failed:', error);
      }
    }
  };

  const handleCameraSelect = (cameraId) => {
    if (selectedCameras.includes(cameraId)) {
      setSelectedCameras(selectedCameras.filter(id => id !== cameraId));
    } else if (selectedCameras.length < 2) {
      setSelectedCameras([...selectedCameras, cameraId]);
    }
  };

  const getCameraStatusColor = (camera) => {
    if (!camera.isOnline) return 'bg-red-500';
    if (camera.lastDetection?.congestionScore < 30) return 'bg-green-500';
    if (camera.lastDetection?.congestionScore < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCongestionLevel = (score) => {
    if (score < 30) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
  };

  // Efficient live updates without leaking intervals
  useEffect(() => {
    if (!isProcessing || selectedCameras.length !== 2) return;

    const id = setInterval(() => {
      updateCameraData();
      performComparison();
    }, 1500);

    return () => clearInterval(id);
  }, [isProcessing, selectedCameras.join(',')]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Camera className="w-6 h-6 mr-2" />
            Dual Camera Traffic Analysis
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={isProcessing ? stopProcessing : startProcessing}
              disabled={isLoading || selectedCameras.length !== 2}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isProcessing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } ${(isLoading || selectedCameras.length !== 2) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isProcessing ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isProcessing ? 'Stop' : 'Start'} Analysis</span>
            </button>
            
            <button
              onClick={performComparison}
              disabled={!isProcessing}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Camera Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map(camera => (
            <div
              key={camera.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCameras.includes(camera.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{camera.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getCameraStatusColor(camera)}`}></div>
                  <span className="text-sm text-gray-600">
                    {camera.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleCameraSelect(camera.id)}
                  className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                >
                  {selectedCameras.includes(camera.id) ? 'Selected' : 'Select'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ref = fileInputRefs[camera.id];
                    if (ref && ref.current) ref.current.click();
                  }}
                  className="inline-flex items-center space-x-2 text-sm text-gray-700 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                >
                  <Video className="w-4 h-4" />
                  <span>Video file</span>
                </button>
                <input
                  ref={fileInputRefs[camera.id]}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoSelect(camera.id, e.target.files && e.target.files[0])}
                />
              </div>
              {uploads[camera.id] && (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="truncate max-w-[70%] text-gray-600" title={uploads[camera.id].name}>
                    {uploads[camera.id].name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    uploads[camera.id].status === 'loaded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {uploads[camera.id].status === 'loaded' ? 'Uploaded' : 'Selected'}
                  </span>
                </div>
              )}
              
              {camera.lastDetection && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Congestion:</span>
                    <span className="font-semibold">
                      {camera.lastDetection.tracking?.congestion_score || camera.lastDetection.congestionScore}% ({getCongestionLevel(camera.lastDetection.tracking?.congestion_score || camera.lastDetection.congestionScore)})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vehicle Count:</span>
                    <span className="font-semibold text-blue-600">
                      {camera.lastDetection.tracking?.total_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className="font-semibold text-green-600">
                      LIVE
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (camera.lastDetection.tracking?.congestion_score || camera.lastDetection.congestionScore) < 30 ? 'bg-green-500' :
                        (camera.lastDetection.tracking?.congestion_score || camera.lastDetection.congestionScore) < 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${camera.lastDetection.tracking?.congestion_score || camera.lastDetection.congestionScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Camera Feeds */}
      {isProcessing && selectedCameras.length === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedCameras.map(cameraId => {
            const camera = cameras.find(c => c.id === cameraId);
            if (!camera) return null;

            return (
              <div key={cameraId} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{camera.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getCameraStatusColor(camera)} animate-pulse`}></div>
                    <span className="text-sm text-gray-600">LIVE</span>
                  </div>
                </div>

                {/* Video-backed Camera Feed */}
                <div className="aspect-video bg-black rounded-lg relative overflow-hidden mb-4">
                  <video
                    ref={videoRefs[cameraId]}
                    src={videoUrls[cameraId]}
                    className="w-full h-full object-contain"
                    muted
                    playsInline
                    loop
                    controls
                  />
                  {!uploads[cameraId] && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Video className="w-10 h-10 mx-auto mb-2" />
                        <div className="text-sm">Select a video above to preview</div>
                      </div>
                    </div>
                  )}
                  {uploadErrors[cameraId] && (
                    <div className="absolute bottom-2 left-2 right-2 text-xs text-red-200 bg-red-900/70 px-2 py-1 rounded">
                      {uploadErrors[cameraId]}
                    </div>
                  )}
                  {uploads[cameraId] && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                      uploads[cameraId].status === 'loaded' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                    }`}>
                      {uploads[cameraId].status === 'loaded' ? 'UPLOADED' : 'SELECTED'}
                    </div>
                  )}
                  
                  
                </div>

                {/* Detection Stats */}
                {camera.lastDetection && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-lg text-blue-600">{camera.lastDetection.tracking?.total_count || 0}</div>
                      <div className="text-gray-600">Vehicles</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-semibold text-lg text-green-600">LIVE</div>
                      <div className="text-gray-600">Status</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-lg">{camera.lastDetection.tracking?.congestion_score || camera.lastDetection.congestionScore}%</div>
                      <div className="text-gray-600">Congestion</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Path Recommendation */}
      <PathRecommendation 
        comparisonData={comparisonData} 
        isLoading={isLoading && !comparisonData}
      />

      {/* System Status */}
      {isProcessing && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">YOLOv8</div>
              <div className="text-sm text-green-800">AI Detection Active</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-blue-800">Cameras Processing</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Real-time</div>
              <div className="text-sm text-purple-800">Path Analysis</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualCameraView;
