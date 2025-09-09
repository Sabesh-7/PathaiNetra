import React from 'react';
import { Navigation, AlertTriangle, CheckCircle, Clock, Car, Users } from 'lucide-react';

const PathRecommendation = React.memo(({ comparisonData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center text-gray-500">
          <Navigation className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No path comparison data available</p>
        </div>
      </div>
    );
  }

  const { camera1, camera2, recommendation } = comparisonData;
  const isCamera1Recommended = recommendation.recommendedCamera === camera1.id;

  const getCongestionColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCongestionIcon = (level) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Navigation className="w-5 h-5 mr-2" />
          Path Recommendation
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
          {recommendation.confidence.toUpperCase()} CONFIDENCE
        </div>
      </div>

      {/* Recommendation Header */}
      <div className={`p-4 rounded-lg border-2 mb-6 ${
        isCamera1Recommended 
          ? 'border-green-500 bg-green-50' 
          : 'border-blue-500 bg-blue-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCamera1Recommended ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                {isCamera1Recommended ? camera1.name : camera2.name}
              </h4>
              <p className="text-sm text-gray-600">Recommended Route</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {isCamera1Recommended ? camera1.congestionScore : camera2.congestionScore}%
            </div>
            <div className="text-sm text-gray-600">Congestion</div>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Camera 1 */}
        <div className={`p-4 rounded-lg border-2 ${
          isCamera1Recommended 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold flex items-center">
              <Car className="w-4 h-4 mr-2" />
              {camera1.name}
            </h5>
            {isCamera1Recommended && (
              <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                RECOMMENDED
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Congestion Level:</span>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium border ${getCongestionColor(camera1.congestionLevel)}`}>
                {getCongestionIcon(camera1.congestionLevel)}
                <span>{camera1.congestionLevel.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Score:</span>
              <span className="font-semibold">{camera1.congestionScore}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  camera1.congestionLevel === 'low' ? 'bg-green-500' :
                  camera1.congestionLevel === 'medium' ? 'bg-yellow-500' :
                  camera1.congestionLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${camera1.congestionScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Camera 2 */}
        <div className={`p-4 rounded-lg border-2 ${
          !isCamera1Recommended 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold flex items-center">
              <Car className="w-4 h-4 mr-2" />
              {camera2.name}
            </h5>
            {!isCamera1Recommended && (
              <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                RECOMMENDED
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Congestion Level:</span>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium border ${getCongestionColor(camera2.congestionLevel)}`}>
                {getCongestionIcon(camera2.congestionLevel)}
                <span>{camera2.congestionLevel.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Score:</span>
              <span className="font-semibold">{camera2.congestionScore}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  camera2.congestionLevel === 'low' ? 'bg-green-500' :
                  camera2.congestionLevel === 'medium' ? 'bg-yellow-500' :
                  camera2.congestionLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${camera2.congestionScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-800">Difference</div>
            <div className="text-lg font-bold text-blue-600">{recommendation.difference}%</div>
            <div className="text-gray-600">Congestion gap</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">Time Saved</div>
            <div className="text-lg font-bold text-green-600">
              {Math.round(recommendation.difference * 0.5)} min
            </div>
            <div className="text-gray-600">Estimated</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">Last Updated</div>
            <div className="text-lg font-bold text-gray-600">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="text-gray-600">Real-time</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Navigate to Recommended Route
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
});

export default PathRecommendation;
