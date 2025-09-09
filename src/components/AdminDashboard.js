import React, { useState } from 'react';
import { 
  Car, Users, LogOut, Shield, Activity, Gauge, AlertTriangle, Phone, Camera, Navigation
} from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import CameraFeed from './common/CameraFeed';
import DualCameraView from './traffic/DualCameraView';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { congestionData, walkingPaths, emergencyAlerts, realTimeStats } = useRealTimeData('admin');

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Cameras</p>
              <p className="text-2xl font-bold">24/25</p>
            </div>
            <Activity className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Vehicles Tracked</p>
              <p className="text-2xl font-bold">{realTimeStats.totalVehicles.toLocaleString()}</p>
            </div>
            <Car className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pedestrians</p>
              <p className="text-2xl font-bold">{realTimeStats.pedestrianCount.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold">{emergencyAlerts.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Gauge className="w-5 h-5 mr-2" />
          System Performance
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <div className="text-sm text-green-800">AI Accuracy</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1.2s</div>
            <div className="text-sm text-blue-800">Avg Response</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">99.9%</div>
            <div className="text-sm text-purple-800">Uptime</div>
          </div>
        </div>
      </div>

      {emergencyAlerts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Recent System Alerts
          </h3>
          <div className="space-y-3">
            {emergencyAlerts.slice(-4).map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <span className="font-medium text-sm">
                      {alert.type === 'violation' ? 'Emergency Lane Violation' : 'High Congestion'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      alert.category === 'vehicle' ? 'bg-blue-100 text-blue-800' :
                      alert.category === 'pedestrian' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {alert.category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{alert.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const VehicleCamerasTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2" />
          Vehicle Path Monitoring
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <CameraFeed title="NH-86 Main Entry" type="vehicle" status="active" />
          <CameraFeed title="Temple Road Junction" type="vehicle" status="active" />
          <CameraFeed title="Market Street Traffic" type="vehicle" status="active" />
          <CameraFeed title="Bypass Road Monitor" type="vehicle" status="active" />
          <CameraFeed title="Ring Road Checkpoint" type="vehicle" status="active" />
          <CameraFeed title="Parking Zone Entry" type="vehicle" status="maintenance" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Live Vehicle Analytics</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Vehicle Types Detected</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Cars</span>
                <span className="font-semibold">18,245</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Buses</span>
                <span className="font-semibold">1,832</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Motorcycles</span>
                <span className="font-semibold">8,756</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Trucks</span>
                <span className="font-semibold">445</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Traffic Flow Rate</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span>Ring Road</span>
                <span className="font-semibold text-green-600">245 veh/min</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span>Temple Road</span>
                <span className="font-semibold text-yellow-600">156 veh/min</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span>NH-86 Main</span>
                <span className="font-semibold text-red-600">89 veh/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PedestrianCamerasTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Pedestrian Path Monitoring
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <CameraFeed title="Main Ghat Entrance" type="pedestrian" status="active" />
          <CameraFeed title="Ghat Path 1" type="pedestrian" status="active" />
          <CameraFeed title="Ghat Path 2" type="pedestrian" status="active" />
          <CameraFeed title="Temple Approach" type="pedestrian" status="active" />
          <CameraFeed title="Market Walking Area" type="pedestrian" status="active" />
          <CameraFeed title="Parking to Ghat Path" type="pedestrian" status="active" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Crowd Density Analysis</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Current Density Levels</h4>
            <div className="space-y-2">
              {Object.entries(walkingPaths).map(([path, density]) => (
                <div key={path} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{path}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      density < 30 ? 'bg-green-500' : 
                      density < 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-semibold">{density}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Safety Metrics</h4>
            <div className="space-y-2">
              <div className="p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">No stampede risk</div>
                <div className="text-sm text-green-800">All paths within safe limits</div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">8 Active Volunteers</div>
                <div className="text-sm text-blue-800">Monitoring crowd movement</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">2.3 m/s</div>
                <div className="text-sm text-purple-800">Average walking speed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmergencyCamerasTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Emergency Lane Monitoring
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <CameraFeed title="Emergency Lane 1" type="emergency" status="active" />
          <CameraFeed title="Emergency Lane 2" type="emergency" status="active" />
          <CameraFeed title="Hospital Route" type="emergency" status="active" />
          <CameraFeed title="VIP Lane Monitor" type="emergency" status="active" />
          <CameraFeed title="Ambulance Route" type="emergency" status="active" />
          <CameraFeed title="Fire Safety Lane" type="emergency" status="active" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Emergency Response Status</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Lane Clearance Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>Main Emergency Lane</span>
                <span className="font-semibold text-green-600">98% Clear</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>Hospital Route</span>
                <span className="font-semibold text-green-600">100% Clear</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span>VIP Lane</span>
                <span className="font-semibold text-yellow-600">85% Clear</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span>Ambulance Route</span>
                <span className="font-semibold text-green-600">95% Clear</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Response Metrics</h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">1.8 min</div>
                <div className="text-sm text-blue-800">Average violation clearance</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">24/7</div>
                <div className="text-sm text-green-800">AI monitoring active</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">12</div>
                <div className="text-sm text-purple-800">Violations resolved today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-3">🚨 Emergency Contacts</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span className="text-red-700">Control Room: 108</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span className="text-red-700">Police: 100</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span className="text-red-700">Medical: 102</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span className="text-red-700">Fire: 101</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Control Center</h1>
                <p className="text-red-100 text-sm">{user?.name} • PathaiNetra System</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg flex items-center space-x-2"
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
            {[
              { id: 'overview', label: 'System Overview', icon: Activity },
              { id: 'traffic', label: 'Traffic Analysis', icon: Navigation },
              { id: 'vehicle', label: 'Vehicle Cameras', icon: Car },
              { id: 'pedestrian', label: 'Pedestrian Cameras', icon: Users },
              { id: 'emergency', label: 'Emergency Lanes', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'traffic' && <DualCameraView />}
        {activeTab === 'vehicle' && <VehicleCamerasTab />}
        {activeTab === 'pedestrian' && <PedestrianCamerasTab />}
        {activeTab === 'emergency' && <EmergencyCamerasTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
