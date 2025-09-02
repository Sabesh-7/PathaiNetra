import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const RegisterPage = ({ setCurrentView, setUser }) => {
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    username: '', 
    password: '', 
    userType: 'civilian', 
    showPassword: false 
  });

  const handleRegister = (e) => {
    e.preventDefault();
    setUser({ 
      name: registerForm.name, 
      username: registerForm.username, 
      type: registerForm.userType 
    });
    setCurrentView(registerForm.userType);
    setRegisterForm({ name: '', username: '', password: '', userType: 'civilian', showPassword: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Join PathaiNetra</h2>
          <p className="text-gray-600">Create your account for smart mobility</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
              className="input-field"
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
              className="input-field"
              placeholder="Choose username"
              autoComplete="username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={registerForm.showPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                className="input-field pr-10"
                placeholder="Create password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setRegisterForm({...registerForm, showPassword: !registerForm.showPassword})}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {registerForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <select
              value={registerForm.userType}
              onChange={(e) => setRegisterForm({...registerForm, userType: e.target.value})}
              className="input-field"
            >
              <option value="civilian">Civilian/Pilgrim</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Create Account
          </button>
        </form>

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

export default RegisterPage;
