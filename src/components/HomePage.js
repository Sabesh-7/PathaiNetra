import React from 'react';
import { 
  Camera, LogIn, UserPlus, Navigation, Shield, Home, FileText, 
  Settings, Phone, AlertTriangle, MapPin, Users, Car, 
  Activity, Clock, ArrowRight, Menu, X, Brain, Zap, Globe
} from 'lucide-react';

const HomePage = ({ setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const quickLinks = [
    { name: 'Home', icon: Home, action: () => setCurrentView('home') },
    { name: 'Services', icon: Settings, action: () => setCurrentView('login') },
    { name: 'Emergency', icon: AlertTriangle, action: () => setCurrentView('login') }
  ];

  const services = [
    {
      icon: MapPin,
      title: 'Live Traffic Monitoring',
      description: 'Real-time traffic updates and congestion alerts',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Crowd Management',
      description: 'AI-powered crowd density analysis and safety monitoring',
      color: 'bg-green-50 border-green-200',
      iconColor: 'bg-green-500'
    },
    {
      icon: Car,
      title: 'Smart Parking',
      description: 'Intelligent parking guidance and availability tracking',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Emergency Response',
      description: '24/7 emergency lane monitoring and rapid response',
      color: 'bg-red-50 border-red-200',
      iconColor: 'bg-red-500'
    }
  ];

  const stats = [
    { number: '10Cr+', label: 'Pilgrims Served', icon: Users },
    { number: '30%', label: 'Congestion Reduction', icon: Activity },
    { number: '95%', label: 'Emergency Clearance', icon: Shield },
    { number: '24/7', label: 'Monitoring Active', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">PathaiNetra</h1>
                <p className="text-sm text-gray-600">Smart Mobility for Simhastha 2028</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.action}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </button>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex space-x-3">
              <button
                onClick={() => setCurrentView('login')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-orange-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      link.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </button>
                ))}
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      setCurrentView('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              AI-Powered Smart Mobility for
              <span className="block md:inline md:ml-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Simhastha 2028</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-4xl mx-auto">
              Experience seamless crowd and traffic management with computer vision, real-time monitoring, and intelligent routing for 10+ crore pilgrims.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentView('register')}
                className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transition-all"
              >
                Get Started
              </button>
              <button
                onClick={() => setCurrentView('login')}
                className="px-8 py-4 rounded-xl text-lg font-semibold border border-gray-300 text-gray-700 bg-white hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive smart mobility solutions designed for the world's largest religious gathering
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className={`${service.color} p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 h-full`}>
                  <div className={`w-12 h-12 ${service.iconColor} rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Impact & Performance</h2>
            <p className="text-xl text-gray-600">Real results for real-world challenges</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-lg text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose PathaiNetra?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets practical solutions for seamless crowd management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Real-Time AI Monitoring</h3>
              <p className="text-gray-600 text-sm mb-3">Advanced computer vision tracking</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced computer vision tracks vehicles, pedestrians, and congestion patterns in real-time with 98.2% accuracy.
              </p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                <span>Login required for this service</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Intelligent Routing</h3>
              <p className="text-gray-600 text-sm mb-3">Smart path guidance system</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dynamic path guidance reduces travel time by 30% with smart route recommendations and traffic optimization.
              </p>
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                <span>Login required for this service</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 text-sm mb-3">Predictive analytics and recommendations</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get intelligent insights and predictions for crowd patterns, traffic flow, and optimal routing strategies.
              </p>
              <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
                <span>Login required for this service</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Emergency Management</h3>
              <p className="text-gray-600 text-sm mb-3">24/7 emergency response system</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Automated emergency lane monitoring ensures 95% clearance for critical services and rapid response.
              </p>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                <span>Login required for this service</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            
            <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Alerts</h3>
              <p className="text-gray-600 text-sm mb-3">Real-time notifications and updates</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive instant alerts about traffic conditions, crowd density, and emergency situations.
              </p>
              <div className="mt-4 flex items-center text-cyan-600 text-sm font-medium">
                <span>Login required for this service</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Multi-Language Support</h3>
              <p className="text-gray-600 text-sm mb-3">Accessible in multiple languages</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Interface available in Hindi, English, and regional languages for better accessibility.
              </p>
              <div className="mt-4 flex items-center text-pink-600 text-sm font-medium">
                <span>Login required for this service</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">PathaiNetra</h3>
                  <p className="text-gray-400 text-sm">Smart Mobility System</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Ujjain, Madhya Pradesh 456001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>0734-1234567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>info@pathainetra.gov.in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={link.action}
                    className="block text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Emergency</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Control Room: 108</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Police: 100</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span>Medical: 102</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PathaiNetra - Smart Mobility for Simhastha 2028. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <button className="hover:text-orange-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-orange-400 transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
