from fastapi import APIRouter, File, UploadFile, HTTPException
import cv2
import numpy as np
from datetime import datetime
from app.services.face_recog import recognize_faces
from app.services.engagement import engagement_detector
from app.db.mongodb import db
from app.db.models import AttendanceLog

router = APIRouter()

@router.post("/process-frame")
async def process_frame(image: UploadFile = File(...)):
    """
    Receives a frame from the frontend, identifies students and calculates engagement.
    """
    contents = await image.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 1. Fetch all known face encodings
    students_cursor = db["students"].find({}, {"student_id": 1, "face_encoding": 1})
    known_ids = []
    known_encodings = []
    async for student in students_cursor:
        known_ids.append(student["student_id"])
        known_encodings.append(student["face_encoding"])

    if not known_encodings:
        return {"status": "no_students_registered"}

    # 2. Recognize faces
    found_ids = recognize_faces(frame, known_encodings, known_ids)

    # 3. Detect Engagement
    engagement_metrics = engagement_detector.detect_engagement(frame)

    # 4. Log Attendance (if any recognized)
    results = []
    for i, student_id in enumerate(found_ids):
        # Match metrics with face index (simplified logic for demo)
        score = engagement_metrics[i]["engagement_score"] if i < len(engagement_metrics) else 100.0
        
        log = {
            "student_id": student_id,
            "timestamp": datetime.utcnow(),
            "engagement_score": score,
            "is_present": True
        }
        await db["attendance"].insert_one(log)
        results.append(log)

    return {"recognized_students": found_ids, "count": len(found_ids)}
