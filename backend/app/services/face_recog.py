import face_recognition
import cv2
import numpy as np
from typing import List, Optional, Tuple

def encode_face(image_path: str) -> Optional[List[float]]:
    """Encodes a single face from an image file."""
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    if len(encodings) > 0:
        return encodings[0].tolist()
    return None

def recognize_faces(frame: np.ndarray, known_encodings: List[List[float]], known_ids: List[str]) -> List[str]:
    """
    Detects and identifies faces in a video frame.
    Returns a list of student_ids matched.
    """
    # Resize frame for faster processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    found_ids = []
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.6)
        face_distances = face_recognition.face_distance(known_encodings, face_encoding)
        
        if len(face_distances) > 0:
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                found_ids.append(known_ids[best_match_index])
    
    return found_ids
