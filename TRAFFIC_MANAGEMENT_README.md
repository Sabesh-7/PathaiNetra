# 🚦 Traffic Management System with Dynamic Congestion Scoring

A real-time traffic management system using YOLOv8 for vehicle detection and dynamic congestion scoring to suggest optimal routes.

## ✨ Features

- **Real-time Vehicle Detection**: YOLOv8 with ByteTrack for accurate vehicle counting
- **Dynamic Congestion Scoring**: Intelligent scoring based on:
  - Current vehicle density (0-50 points)
  - Recent traffic flow (0-30 points) 
  - Historical patterns (0-20 points)
- **Dual Camera Support**: Compare two camera feeds simultaneously
- **Path Recommendation**: Suggest less congested routes
- **Video Upload**: Upload MP4 videos for analysis
- **Live Statistics**: Real-time current/total vehicle counts and congestion levels

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask with CORS support
- **AI Model**: YOLOv8n with ByteTrack tracking
- **GPU Support**: CUDA acceleration with FP16 precision
- **Dynamic Scoring**: Multi-factor congestion calculation

### Frontend (React)
- **Framework**: React.js with modern hooks
- **UI**: Tailwind CSS for responsive design
- **Real-time**: Live video feeds with detection overlays
- **Upload**: Drag-and-drop video file support

## 🚀 Quick Start

### 1. Setup Backend
```bash
# Install Python dependencies
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
pip install -r requirements.txt

# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt

# Start Flask server
python main.py
```

### 2. Setup Frontend
```bash
# Install Node.js dependencies
npm install --legacy-peer-deps

# Start React development server
npm start
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## 📊 Dynamic Congestion Scoring

The system calculates congestion scores using three factors:

### 1. Current Vehicle Density (0-50 points)
- More vehicles = higher congestion
- Scale: 0-5 vehicles = 0-30%, 5-10 = 30-60%, 10+ = 60-100%

### 2. Recent Traffic Flow (0-30 points)
- Calculates vehicles per minute in last 5 minutes
- Higher flow rate = higher congestion

### 3. Historical Patterns (0-20 points)
- Compares with average congestion in last hour
- Accounts for typical traffic patterns

## 🎯 API Endpoints

### Detection
```http
POST /detect
Content-Type: multipart/form-data

Parameters:
- file: Image file (JPEG)
- camera_id: Camera identifier

Response:
{
  "detections": [...],
  "tracking": {
    "current_count": 5,
    "total_count": 25,
    "congestion_score": 45.2
  }
}
```

### Camera Status
```http
GET /status/{camera_id}

Response:
{
  "camera_id": "camera1",
  "total_count": 25,
  "current_count": 5,
  "congestion_score": 45.2,
  "recent_flow": 12
}
```

### Congestion History
```http
GET /congestion/{camera_id}

Response:
{
  "camera_id": "camera1",
  "congestion_history": [45.2, 42.1, 38.5],
  "average_congestion": 41.9
}
```

## 🔧 Configuration

### YOLO Parameters
- **Confidence**: 0.4 (balanced accuracy/speed)
- **NMS**: 0.5 (non-maximum suppression)
- **Image Size**: 416 (optimized for speed)
- **Tracker**: ByteTrack for persistent IDs

### Counting Line
- **Position**: Fixed at y=100 pixels from top
- **Logic**: Count vehicles crossing from above to below

### GPU Optimization
- **CUDA**: Automatic detection and usage
- **FP16**: Half-precision for faster inference
- **Batch Processing**: Optimized for real-time

## 📁 Project Structure

```
traffic-management/
├── backend/
│   ├── main.py              # Flask server
│   ├── tracker.py           # Vehicle tracking logic
│   ├── requirements.txt     # Python dependencies
│   └── test_flask_api.py    # API testing
├── src/
│   ├── components/
│   │   ├── traffic/
│   │   │   ├── DualCameraView.js
│   │   │   └── PathRecommendation.js
│   │   └── common/
│   │       ├── CameraFeed.js
│   │       └── CongestionLevel.js
│   └── services/
│       ├── yoloService.js   # YOLO integration
│       └── cameraManager.js # Camera management
├── models/
│   └── yolov8n.pt          # YOLOv8 model
└── start_backend.py        # Backend startup script
```

## 🧪 Testing

### Test Backend API
```bash
cd backend
python test_flask_api.py
```

### Test with Real Video
1. Upload MP4 video in web interface
2. Click "Start Analysis"
3. Monitor real-time statistics
4. Check console for debug logs

## 🎮 Usage

1. **Upload Videos**: Click "Video file" button for each camera
2. **Select Cameras**: Choose two cameras for comparison
3. **Start Analysis**: Click "Start Analysis" to begin processing
4. **Monitor Results**: View real-time statistics and congestion scores
5. **Get Recommendations**: System automatically suggests less congested path

## 🔍 Troubleshooting

### Common Issues

1. **No Detections**: Check if YOLO model is loaded and CUDA is available
2. **Zero Counts**: Verify counting line position and vehicle positions
3. **High Latency**: Enable GPU acceleration and reduce image size
4. **Upload Errors**: Ensure video format is MP4 and file size is reasonable

### Debug Logs
- Backend: Check console for detection and counting logs
- Frontend: Check browser console for API errors
- Network: Verify backend is running on port 8000

## 🚀 Performance Optimization

- **GPU Acceleration**: Automatic CUDA detection and usage
- **Image Optimization**: JPEG compression for faster uploads
- **Caching**: Model loading and tracking state persistence
- **Concurrent Processing**: Multiple camera support

## 📈 Future Enhancements

- [ ] Real-time camera feeds (RTSP/WebRTC)
- [ ] Machine learning-based traffic prediction
- [ ] Mobile app integration
- [ ] Cloud deployment support
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for smart traffic management**
