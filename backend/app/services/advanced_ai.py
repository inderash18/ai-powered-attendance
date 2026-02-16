"""
Advanced AI Services - Enterprise Edition
Features: Emotion Recognition, Posture Analysis, Attention Heatmaps
"""

import cv2
import numpy as np
from typing import Dict, List, Tuple, Optional
import mediapipe as mp

try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DEEPFACE_AVAILABLE = False
    print("⚠️  DeepFace not installed. Emotion recognition will be limited.")


class EmotionRecognitionEngine:
    """
    Advanced emotion recognition using DeepFace
    Detects: Happy, Sad, Angry, Fear, Surprise, Disgust, Neutral
    """
    
    def __init__(self):
        self.emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        self.enabled = DEEPFACE_AVAILABLE
        
    def analyze_emotions(self, frame: np.ndarray, face_locations: List[Tuple]) -> List[Dict]:
        """
        Analyze emotions for each detected face
        Returns: List of emotion dictionaries with confidence scores
        """
        if not self.enabled:
            return [{'dominant_emotion': 'neutral', 'confidence': 0.0}] * len(face_locations)
        
        results = []
        for (top, right, bottom, left) in face_locations:
            try:
                # Extract face ROI
                face_roi = frame[top:bottom, left:right]
                
                # Resize for better performance
                if face_roi.size == 0:
                    results.append({'dominant_emotion': 'neutral', 'confidence': 0.0})
                    continue
                    
                # Analyze with DeepFace
                analysis = DeepFace.analyze(
                    face_roi,
                    actions=['emotion'],
                    enforce_detection=False,
                    silent=True
                )
                
                if isinstance(analysis, list):
                    analysis = analysis[0]
                
                emotion_scores = analysis.get('emotion', {})
                dominant_emotion = analysis.get('dominant_emotion', 'neutral')
                confidence = emotion_scores.get(dominant_emotion, 0.0) / 100.0
                
                results.append({
                    'dominant_emotion': dominant_emotion,
                    'confidence': confidence,
                    'all_emotions': emotion_scores
                })
                
            except Exception as e:
                print(f"Emotion analysis error: {e}")
                results.append({'dominant_emotion': 'neutral', 'confidence': 0.0})
        
        return results


class PostureAnalyzer:
    """
    Analyze student posture using MediaPipe Pose
    Detects: Slouching, Head tilt, Leaning
    """
    
    def __init__(self):
        try:
            self.mp_pose = mp.solutions.pose
            self.pose = self.mp_pose.Pose(
                static_image_mode=False,
                model_complexity=1,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            self.enabled = True
        except Exception as e:
            print(f"⚠️  Pose detection initialization failed: {e}")
            self.enabled = False
    
    def analyze_posture(self, frame: np.ndarray) -> List[Dict]:
        """
        Analyze posture for all people in frame
        Returns: List of posture analysis dictionaries
        """
        if not self.enabled:
            return []
        
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(rgb_frame)
            
            if not results.pose_landmarks:
                return []
            
            landmarks = results.pose_landmarks.landmark
            
            # Calculate posture metrics
            posture_data = {
                'slouching': self._detect_slouching(landmarks),
                'head_tilt': self._calculate_head_tilt(landmarks),
                'leaning': self._detect_leaning(landmarks),
                'posture_score': 0.0
            }
            
            # Calculate overall posture score (0-100)
            score = 100
            if posture_data['slouching']:
                score -= 30
            score -= abs(posture_data['head_tilt']) * 2  # Reduce score based on tilt
            if posture_data['leaning']:
                score -= 20
            
            posture_data['posture_score'] = max(0, min(100, score))
            
            return [posture_data]
            
        except Exception as e:
            print(f"Posture analysis error: {e}")
            return []
    
    def _detect_slouching(self, landmarks) -> bool:
        """Detect if person is slouching based on shoulder-hip angle"""
        try:
            # Get key points
            left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            left_hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value]
            
            # Calculate angle
            shoulder_y = (left_shoulder.y + right_shoulder.y) / 2
            hip_y = left_hip.y
            
            # If shoulders are significantly lower than hips, likely slouching
            return (hip_y - shoulder_y) < 0.15
            
        except:
            return False
    
    def _calculate_head_tilt(self, landmarks) -> float:
        """Calculate head tilt angle in degrees"""
        try:
            nose = landmarks[self.mp_pose.PoseLandmark.NOSE.value]
            left_ear = landmarks[self.mp_pose.PoseLandmark.LEFT_EAR.value]
            right_ear = landmarks[self.mp_pose.PoseLandmark.RIGHT_EAR.value]
            
            # Calculate tilt based on ear positions
            ear_diff = left_ear.y - right_ear.y
            tilt_angle = np.arctan(ear_diff) * 180 / np.pi
            
            return tilt_angle
            
        except:
            return 0.0
    
    def _detect_leaning(self, landmarks) -> bool:
        """Detect if person is leaning to one side"""
        try:
            left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            
            # Check horizontal difference
            shoulder_diff = abs(left_shoulder.x - right_shoulder.x)
            
            return shoulder_diff > 0.3
            
        except:
            return False


class AttentionHeatmapGenerator:
    """
    Generate attention heatmaps based on gaze direction
    Useful for understanding where students are looking
    """
    
    def __init__(self, frame_width: int = 1280, frame_height: int = 720):
        self.heatmap = np.zeros((frame_height, frame_width), dtype=np.float32)
        self.frame_width = frame_width
        self.frame_height = frame_height
        self.decay_factor = 0.95  # Heatmap decay over time
    
    def update(self, gaze_points: List[Tuple[int, int]]):
        """
        Update heatmap with new gaze points
        Args:
            gaze_points: List of (x, y) coordinates where students are looking
        """
        # Decay existing heatmap
        self.heatmap *= self.decay_factor
        
        # Add new gaze points with Gaussian blur
        for (x, y) in gaze_points:
            if 0 <= x < self.frame_width and 0 <= y < self.frame_height:
                # Create Gaussian kernel
                kernel_size = 50
                sigma = 20
                kernel = cv2.getGaussianKernel(kernel_size, sigma)
                kernel = kernel @ kernel.T
                
                # Calculate region to update
                x_start = max(0, x - kernel_size // 2)
                y_start = max(0, y - kernel_size // 2)
                x_end = min(self.frame_width, x + kernel_size // 2)
                y_end = min(self.frame_height, y + kernel_size // 2)
                
                # Update heatmap
                try:
                    region = self.heatmap[y_start:y_end, x_start:x_end]
                    kernel_crop = kernel[:region.shape[0], :region.shape[1]]
                    self.heatmap[y_start:y_end, x_start:x_end] += kernel_crop
                except:
                    pass
    
    def get_heatmap_overlay(self, frame: np.ndarray, alpha: float = 0.4) -> np.ndarray:
        """
        Get heatmap overlay on original frame
        Returns: Frame with heatmap overlay
        """
        # Normalize heatmap
        if self.heatmap.max() > 0:
            normalized = (self.heatmap / self.heatmap.max() * 255).astype(np.uint8)
        else:
            normalized = self.heatmap.astype(np.uint8)
        
        # Apply colormap
        heatmap_colored = cv2.applyColorMap(normalized, cv2.COLORMAP_JET)
        
        # Resize if needed
        if heatmap_colored.shape[:2] != frame.shape[:2]:
            heatmap_colored = cv2.resize(heatmap_colored, (frame.shape[1], frame.shape[0]))
        
        # Blend with original frame
        overlay = cv2.addWeighted(frame, 1 - alpha, heatmap_colored, alpha, 0)
        
        return overlay
    
    def get_attention_zones(self) -> Dict[str, float]:
        """
        Divide frame into zones and calculate attention percentage
        Returns: Dictionary with zone names and attention percentages
        """
        h, w = self.heatmap.shape
        zones = {
            'top_left': self.heatmap[0:h//2, 0:w//2].sum(),
            'top_right': self.heatmap[0:h//2, w//2:w].sum(),
            'bottom_left': self.heatmap[h//2:h, 0:w//2].sum(),
            'bottom_right': self.heatmap[h//2:h, w//2:w].sum(),
            'center': self.heatmap[h//4:3*h//4, w//4:3*w//4].sum(),
        }
        
        total = sum(zones.values())
        if total > 0:
            zones = {k: (v / total * 100) for k, v in zones.items()}
        
        return zones


# Initialize global instances
emotion_engine = EmotionRecognitionEngine()
posture_analyzer = PostureAnalyzer()
attention_heatmap = AttentionHeatmapGenerator()
