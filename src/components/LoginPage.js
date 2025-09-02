import React, { useState } from 'react';
import { Camera, Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ setCurrentView, setUser }) => {
  const [loginForm, setLoginForm] = useState({ 
    username: '', 
    password: '', 
    showPassword: false 
  });

  const users = {
    'admin': { password: 'admin123', type: 'admin', name: 'Admin User' },
    'user': { password: 'user123', type: 'civilian', name: 'Civilian User' },
    'demo': { password: 'demo', type: 'civilian', name: 'Demo User' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = users[loginForm.username];
    if (userData && userData.password === loginForm.password) {
      setUser({ ...userData, username: loginForm.username });
      setCurrentView(userData.type);
      setLoginForm({ username: '', password: '', showPassword: false });
    } else {
      alert('Invalid credentials! Try: admin/admin123 or user/user123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Login to PathaiNetra</h2>
          <p className="text-gray-600">Access your smart mobility dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="input-field"
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={loginForm.showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="input-field pr-10"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setLoginForm({...loginForm, showPassword: !loginForm.showPassword})}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {loginForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Demo credentials:</p>
          <p className="text-sm text-gray-500">Admin: admin/admin123 | User: user/user123</p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentView('home')}
            className="text-orange-500 hover:text-orange-600"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
