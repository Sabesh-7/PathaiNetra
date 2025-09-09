#!/usr/bin/env python3
"""
Flask-based Traffic Management Backend with Dynamic Congestion Scoring
"""

import os
import io
import time
from typing import Dict, Any, List
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
from ultralytics import YOLO
# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global variables
MODEL = None

def load_model():
    """Load YOLOv8 model"""
    global MODEL
    if MODEL is None:
        try:
            model_path = os.path.join(os.path.dirname(__file__), "..", "models", "yolov8n.pt")
            MODEL = YOLO(model_path)
            print(f"✅ YOLOv8 model loaded from {model_path}")
            
            # Check if CUDA is available
            if torch.cuda.is_available():
                print(f"🚀 CUDA available: {torch.cuda.get_device_name(0)}")
                MODEL.to('cuda')
            else:
                print("⚠️ CUDA not available, using CPU")
                
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            MODEL = None


@app.route('/detect', methods=['POST'])
def detect():
    """Detect vehicles and calculate congestion"""
    load_model()
    
    if MODEL is None:
        return jsonify({
            "detections": [],
            "tracking": {
                "active_vehicles": [],
                "total_count": 0,
                "class_counts": {},
                "active_count": 0,
                "congestion_score": 0
            }
        })
    
    # Get camera ID
    camera_id = request.form.get('camera_id', 'default')
    
    try:
        # Get uploaded file
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Read and process image
        content = file.read()
        image = Image.open(io.BytesIO(content)).convert("RGB")
        
        # Run YOLO detection - exactly like your working script
        results = MODEL(
            source=image,
            conf=0.4,
            iou=0.5,
            imgsz=640,
            device='cuda' if MODEL.device.type == 'cuda' else 'cpu',
            half=True if MODEL.device.type == 'cuda' else False,
            verbose=False,
            save=False,
            save_txt=False,
            save_conf=False,
            save_crop=False,
            show=False,
            stream=False
        )[0]
        
        # Process YOLO detections - simple count only
        vehicle_count = 0
        
        if results.boxes is not None and len(results.boxes) > 0:
            vehicle_classes = ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'van', 'pickup']
            
            for box in results.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                name = results.names[cls_id] if hasattr(results, 'names') else str(cls_id)
                
                # Count vehicles with confidence > 0.4
                if name.lower() in vehicle_classes and conf > 0.4:
                    vehicle_count += 1
        
        # Simple congestion score
        congestion_score = min(vehicle_count * 10, 100)
        
        # Debug logging
        print(f"🔍 Camera {camera_id}: Detected={vehicle_count}, Congestion={congestion_score:.1f}%")
        
        return jsonify({
            "detections": [],  # No detection boxes
            "tracking": {
                "active_vehicles": [],
                "total_count": vehicle_count,
                "current_count": vehicle_count,
                "class_counts": {},
                "active_count": vehicle_count,
                "congestion_score": round(congestion_score, 1)
            }
        })
        
    except Exception as e:
        print(f"❌ Detection error: {e}")
        return jsonify({
            "detections": [],
            "tracking": {
                "active_vehicles": [],
                "total_count": 0,
                "class_counts": {},
                "active_count": 0,
                "congestion_score": 0
            }
        }), 500

@app.route('/status/<camera_id>', methods=['GET'])
def get_camera_status(camera_id):
    """Get current status of specific camera"""
    return jsonify({
        "camera_id": camera_id,
        "status": "YOLO detection only",
        "model_loaded": MODEL is not None
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": MODEL is not None,
        "cuda_available": torch.cuda.is_available(),
        "mode": "YOLO detection only"
    })

if __name__ == "__main__":
    print("🚀 Starting Flask Traffic Management Backend")
    print("=" * 50)
    
    # Load model on startup
    load_model()
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True,
        threaded=True
    )