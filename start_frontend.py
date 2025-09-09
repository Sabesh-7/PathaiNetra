#!/usr/bin/env python3
"""
Start React frontend for traffic management
"""

import subprocess
import sys
import os

def main():
    print("🚀 Starting Traffic Management Frontend")
    print("=" * 50)
    
    # Change to project root directory
    project_root = os.path.dirname(__file__)
    os.chdir(project_root)
    
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Check if node_modules exists
    if os.path.exists("node_modules"):
        print("✅ Node modules found")
    else:
        print("📦 Installing node modules...")
        subprocess.run(["npm", "install", "--legacy-peer-deps"], check=True)
    
    # Start React app
    print("🚀 Starting React development server...")
    subprocess.run(["npm", "start"], check=True)

if __name__ == "__main__":
    main()
