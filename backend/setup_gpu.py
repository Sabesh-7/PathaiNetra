#!/usr/bin/env python3
"""
GPU Setup Script for YOLO Traffic Detection
Checks and configures GPU support for optimal performance
"""

import torch
import sys
import subprocess

def check_gpu_availability():
    """Check if GPU is available and properly configured"""
    print("🔍 Checking GPU availability...")
    
    # Check CUDA availability
    cuda_available = torch.cuda.is_available()
    print(f"CUDA Available: {cuda_available}")
    
    if cuda_available:
        print(f"CUDA Version: {torch.version.cuda}")
        print(f"GPU Count: {torch.cuda.device_count()}")
        
        for i in range(torch.cuda.device_count()):
            gpu_name = torch.cuda.get_device_name(i)
            gpu_memory = torch.cuda.get_device_properties(i).total_memory / 1024**3
            print(f"GPU {i}: {gpu_name} ({gpu_memory:.1f} GB)")
    else:
        print("❌ No GPU detected. Using CPU mode.")
        print("For GPU acceleration, install CUDA toolkit and PyTorch with CUDA support.")
    
    return cuda_available

def install_gpu_dependencies():
    """Install GPU-optimized dependencies"""
    print("\n📦 Installing GPU-optimized dependencies...")
    
    try:
        # Install PyTorch with CUDA support
        subprocess.run([
            sys.executable, "-m", "pip", "install", 
            "torch", "torchvision", "torchaudio", 
            "--index-url", "https://download.pytorch.org/whl/cu118"
        ], check=True)
        
        print("✅ GPU dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install GPU dependencies: {e}")
        return False

def optimize_yolo_model():
    """Optimize YOLO model for GPU inference"""
    print("\n⚡ Optimizing YOLO model for GPU...")
    
    try:
        from ultralytics import YOLO
        import os
        
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "yolov8n.pt")
        
        if not os.path.exists(model_path):
            print(f"❌ Model not found at {model_path}")
            return False
        
        # Load model and optimize
        model = YOLO(model_path)
        
        # Move to GPU if available
        if torch.cuda.is_available():
            model.to('cuda')
            print("✅ Model moved to GPU")
        else:
            print("⚠️  Using CPU mode")
        
        # Test inference
        import numpy as np
        test_image = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
        
        # Warm up
        for _ in range(3):
            _ = model.predict(test_image, verbose=False)
        
        print("✅ Model optimization complete!")
        return True
        
    except Exception as e:
        print(f"❌ Model optimization failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 YOLO Traffic Detection - GPU Setup")
    print("=" * 50)
    
    # Check GPU
    gpu_available = check_gpu_availability()
    
    if not gpu_available:
        print("\n💡 To enable GPU acceleration:")
        print("1. Install CUDA Toolkit 11.8 or later")
        print("2. Run: pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118")
        print("3. Restart this script")
        return
    
    # Install dependencies
    if not install_gpu_dependencies():
        return
    
    # Optimize model
    if not optimize_yolo_model():
        return
    
    print("\n🎉 Setup complete! Your system is optimized for GPU acceleration.")
    print("\nTo start the server:")
    print("python main.py")

if __name__ == "__main__":
    main()
