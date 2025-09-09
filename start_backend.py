#!/usr/bin/env python3
"""
Start Flask backend for traffic management
"""

import subprocess
import sys
import os

def main():
    print("🚀 Starting Traffic Management Backend")
    print("=" * 50)
    
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    os.chdir(backend_dir)
    
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Check if virtual environment exists
    venv_path = os.path.join(backend_dir, "venv")
    if os.path.exists(venv_path):
        print("✅ Virtual environment found")
        
        # Activate virtual environment and run
        if sys.platform == "win32":
            activate_script = os.path.join(venv_path, "Scripts", "activate.bat")
            python_exe = os.path.join(venv_path, "Scripts", "python.exe")
        else:
            activate_script = os.path.join(venv_path, "bin", "activate")
            python_exe = os.path.join(venv_path, "bin", "python")
        
        print(f"🐍 Using Python: {python_exe}")
        
        # Install requirements if needed
        print("📦 Installing requirements...")
        subprocess.run([python_exe, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        
        # Start Flask app
        print("🚀 Starting Flask server...")
        subprocess.run([python_exe, "main.py"], check=True)
        
    else:
        print("❌ Virtual environment not found!")
        print("Please run setup_gpu.py first to create the virtual environment")
        sys.exit(1)

if __name__ == "__main__":
    main()
