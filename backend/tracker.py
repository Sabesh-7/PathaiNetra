import cv2
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from collections import defaultdict, deque
import time

class VehicleTracker:
    def __init__(self, count_line_y=100, buffer=10):
        # Fixed counting line at 100 pixels from top
        self.count_line_y = count_line_y
        self.buffer = buffer
        
        # Vehicle counts
        self.total_count = 0
        self.current_count = 0
        
        # Vehicle classes
        self.VEHICLE_CLASSES = ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'van', 'pickup']
        
        # Tracking history for line crossing detection
        self.vehicle_history = {}  # {track_id: {'label': str, 'counted': bool, 'last_cy': int}}
        
        # Current frame detections
        self.current_detections = []
        
        # Debug tracking
        self.debug_count = 0
        
    def calculate_center(self, bbox):
        """Calculate center point of bounding box"""
        x, y, w, h = bbox
        return (x + w/2, y + h/2)
    
    def calculate_distance(self, center1, center2):
        """Calculate Euclidean distance between two centers"""
        return np.sqrt((center1[0] - center2[0])**2 + (center1[1] - center2[1])**2)
    
    def update_with_tracking(self, results) -> Dict[str, Any]:
        """Update tracker using YOLO tracking results - SIMPLIFIED COUNTING"""
        self.current_detections = []
        
        if results.boxes is not None and len(results.boxes) > 0:
            for box in results.boxes:
                cls_id = int(box.cls[0])
                track_id = int(box.id[0]) if box.id is not None else None
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cx = int((x1 + x2) / 2)
                cy = int((y1 + y2) / 2)
                
                # Get class name
                label = results.names[cls_id] if hasattr(results, 'names') else str(cls_id)
                
                # Only track vehicles
                if label not in self.VEHICLE_CLASSES or track_id is None:
                    continue
                
                # Store current detection
                self.current_detections.append({
                    'id': track_id,
                    'class': label,
                    'bbox': {
                        'x': x1,
                        'y': y1,
                        'width': x2 - x1,
                        'height': y2 - y1
                    },
                    'confidence': conf,
                    'center': (cx, cy)
                })
        
        # Update current count
        self.current_count = len(self.current_detections)
        
        # SIMPLIFIED COUNTING: Just count current vehicles as total
        # This is more reliable for web API usage
        self.total_count = self.current_count
        
        return self._get_tracking_info()
    
    def update(self, detections: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Fallback update method for non-tracking detections"""
        # Convert detections to current format
        self.current_detections = []
        for det in detections:
            self.current_detections.append({
                'id': f"det_{len(self.current_detections)}",
                'class': det['class'],
                'bbox': det['bbox'],
                'confidence': det['confidence'],
                'center': (det['bbox']['x'] + det['bbox']['width']/2, 
                          det['bbox']['y'] + det['bbox']['height']/2)
            })
        
        return self._get_tracking_info()
    
    def _register_object(self, bbox_info):
        """Register a new object"""
        obj_id = self.next_id
        self.next_id += 1
        
        self.objects[obj_id] = {
            'bbox': bbox_info['bbox'],
            'class': bbox_info['class'],
            'last_seen': time.time(),
            'disappeared': 0
        }
        
        # Update counts
        self.vehicle_counts[bbox_info['class']] += 1
        self.total_vehicles += 1
    
    def _remove_object(self, obj_id):
        """Remove an object and update counts"""
        if obj_id in self.objects:
            vehicle_class = self.objects[obj_id]['class']
            self.vehicle_counts[vehicle_class] = max(0, self.vehicle_counts[vehicle_class] - 1)
            self.total_vehicles = max(0, self.total_vehicles - 1)
            del self.objects[obj_id]
    
    def _get_tracking_info(self):
        """Get current tracking information"""
        # Create class counts from current detections
        class_counts = defaultdict(int)
        for det in self.current_detections:
            class_counts[det['class']] += 1
        
        return {
            'active_vehicles': self.current_detections,
            'total_count': self.total_count,
            'current_count': self.current_count,
            'class_counts': dict(class_counts),
            'active_count': len(self.current_detections),
            'entry_count': self.total_count,  # Total vehicles that crossed the line
            'exit_count': 0  # Not tracking exits in this implementation
        }
    
    def reset(self):
        """Reset tracker state"""
        self.vehicle_history.clear()
        self.current_detections.clear()
        self.total_count = 0
        self.current_count = 0
