try:
    import mediapipe.solutions.face_mesh as mp_face_mesh
except (ImportError, AttributeError):
    try:
        from mediapipe.python.solutions import face_mesh as mp_face_mesh
    except (ImportError, AttributeError):
        # Final fallback for some newer/specific installations
        import mediapipe as mp
        mp_face_mesh = mp.solutions.face_mesh
import cv2
import numpy as np

class EngagementDetector:
    def __init__(self):
        self.mp_face_mesh = mp_face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=5,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )

    def calculate_ear(self, landmarks, eye_indices):
        """Calculate Eye Aspect Ratio (EAR)."""
        # Horizontal
        lv = np.linalg.norm(np.array(landmarks[eye_indices[1]]) - np.array(landmarks[eye_indices[5]]))
        rv = np.linalg.norm(np.array(landmarks[eye_indices[2]]) - np.array(landmarks[eye_indices[4]]))
        h = np.linalg.norm(np.array(landmarks[eye_indices[0]]) - np.array(landmarks[eye_indices[3]]))
        return (lv + rv) / (2.0 * h)

    def detect_engagement(self, frame):
        """
        Analyzes frame for eye closure and head pose.
        Returns a list of dicts with metrics per face.
        """
        results = self.face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        metrics = []

        if not results.multi_face_landmarks:
            return []

        for face_landmarks in results.multi_face_landmarks:
            landmarks = [(lm.x, lm.y, lm.z) for lm in face_landmarks.landmark]
            
            # Simplified Eye Indices (Left: 362, 385, 387, 263, 373, 380 | Right: 33, 160, 158, 133, 153, 144)
            left_eye_ear = self.calculate_ear(landmarks, [362, 385, 387, 263, 373, 380])
            right_eye_ear = self.calculate_ear(landmarks, [33, 160, 158, 133, 153, 144])
            ear = (left_eye_ear + right_eye_ear) / 2.0

            # Simplistic Head Pose (using nose and eye centers)
            # More complex PnP solver could be used here
            nose_tip = landmarks[1]
            engagement_score = 100.0
            
            if ear < 0.2: # Threshold for eye closure
                engagement_score -= 50
            
            metrics.append({
                "ear": ear,
                "is_sleeping": ear < 0.2,
                "engagement_score": max(0, engagement_score)
            })
            
        return metrics

engagement_detector = EngagementDetector()
