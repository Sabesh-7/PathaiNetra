import React, { useState } from 'react';
import { Car, Users, LogOut, User, AlertTriangle, Navigation, MapPin } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import CongestionLevel from './common/CongestionLevel';

const CivilianDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('routes');
  const { congestionData, walkingPaths, emergencyAlerts } = useRealTimeData('civilian');

  const getRelevantAlerts = (category) => {
    return emergencyAlerts.filter(alert => 
      alert.category === category || alert.category === 'emergency'
    ).slice(-3);
  };

  const RouteView = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2 text-blue-500" />
          Live Vehicle Route Status
        </h3>
        <div className="space-y-3">
          {Object.entries(congestionData).map(([route, level]) => (
            <div key={route} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{route}</span>
              <CongestionLevel level={level} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Navigation className="w-5 h-5 mr-2" />
          🟢 Best Route Recommendation
        </h3>
        <p className="text-green-100 mb-2">Ring Road → Zone 4 Parking</p>
        <div className="text-sm text-green-100">
          <p>• Estimated time: 15 minutes</p>
          <p>• Traffic level: Low (23%)</p>
          <p>• Distance: 8.2 km</p>
        </div>
      </div>

      {getRelevantAlerts('vehicle').length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Vehicle Route Alerts
          </h3>
          <div className="space-y-3">
            {getRelevantAlerts('vehicle').map(alert => (
              <div key={alert.id} className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                <p className="font-medium text-orange-800">Heavy congestion at {alert.location}</p>
                <p className="text-sm text-orange-600">Consider alternate route • {alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const WalkView = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-green-500" />
          Live Walking Path Status
        </h3>
        <div className="space-y-3">
          {Object.entries(walkingPaths).map(([path, crowdLevel]) => (
            <div key={path} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{path}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  crowdLevel < 30 ? 'bg-green-500' : 
                  crowdLevel < 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {crowdLevel < 30 ? 'Clear' : crowdLevel < 70 ? 'Busy' : 'Crowded'}
                </span>
                <span className="text-xs text-gray-500">({crowdLevel}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          🚶 Recommended Walking Path
        </h3>
        <p className="text-blue-100 mb-2">Ghat Path 2 → Main Bathing Area</p>
        <div className="text-sm text-blue-100">
          <p>• Walking time: 12 minutes</p>
          <p>• Crowd level: Light (18%)</p>
          <p>• Distance: 850 meters</p>
          <p>• Facilities: Wheelchairs, Water stations</p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2">🛡️ Safety Guidelines</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Stay hydrated and carry water</li>
          <li>• Follow designated walking paths</li>
          <li>• Report any emergencies to volunteers</li>
          <li>• Assistance available for elderly & Divyangjan</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
                <p className="text-blue-100 text-sm">Civilian Dashboard • Simhastha 2028</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'routes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="font-medium">Vehicle Routes</span>
            </button>
            <button
              onClick={() => setActiveTab('walk')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'walk'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">Walking Paths</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'routes' && <RouteView />}
        {activeTab === 'walk' && <WalkView />}
      </main>
    </div>
  );
};

export default CivilianDashboard;
