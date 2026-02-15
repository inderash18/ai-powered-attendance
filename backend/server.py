from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import cv2
import numpy as np
import os
from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient

# AI Services (Imported from existing structure)
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.services.face_recog import recognize_faces, encode_face
from app.services.engagement import engagement_detector
from app.services.ollama_ai import generate_student_report

app = FastAPI(title="SmartView AI - MongoDB Backend")

# MongoDB Setup
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "attendance_app"
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

@app.on_event("startup")
async def startup_event():
    print("\n" + "="*50)
    print("🚀 SMARTVIEW AI BACKEND IS ONLINE & READY")
    print(f"📍 API BASE: http://127.0.0.1:8000/api/v1")
    print(f"📊 DATABASE: MongoDB (Local)")
    print("="*50 + "\n")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    try:
        await client.admin.command('ping')
        return {"status": "ready", "db": "MongoDB Connected"}
    except Exception as e:
        return {"status": "error", "db": f"MongoDB Connection Failed: {str(e)}"}

@app.post("/api/v1/students/register")
async def register_student(
    student_id: str = Form(...),
    name: str = Form(...),
    image: UploadFile = File(...)
):
    # Save temp image to encode
    temp_path = f"temp_{student_id}.jpg"
    with open(temp_path, "wb") as f:
        f.write(await image.read())
    
    encoding = encode_face(temp_path)
    if os.path.exists(temp_path):
        os.remove(temp_path)
    
    if encoding is None:
        raise HTTPException(status_code=400, detail="No face detected in registration image")
    
    try:
        await db.students.update_one(
            {"student_id": student_id},
            {"$set": {"student_id": student_id, "name": name, "face_encoding": encoding}},
            upsert=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"status": "ok", "student_id": student_id}

@app.post("/api/v1/attendance/process-frame")
async def process_frame(image: UploadFile = File(...)):
    contents = await image.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Fetch known faces
    students_cursor = db.students.find({}, {"student_id": 1, "face_encoding": 1})
    known_ids = []
    known_encodings = []
    async for student in students_cursor:
        known_ids.append(student["student_id"])
        known_encodings.append(student["face_encoding"])

    if not known_encodings:
        return {"recognized_students": [], "count": 0, "message": "No students registered"}

    # Recognize
    found_ids = recognize_faces(frame, known_encodings, known_ids)
    
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔍 Analyzed frame: {len(found_ids)} student(s) detected.")

    # Engagement
    engagement_metrics = engagement_detector.detect_engagement(frame)

    # Log in DB
    results = []
    for i, student_id in enumerate(found_ids):
        score = engagement_metrics[i]["engagement_score"] if i < len(engagement_metrics) else 100.0
        timestamp = datetime.now()
        log = {
            "student_id": student_id, 
            "timestamp": timestamp, 
            "engagement_score": score, 
            "is_present": True
        }
        await db.attendance.insert_one(log)
        results.append({"student_id": student_id, "score": score})

    return {"recognized_students": found_ids, "count": len(found_ids), "details": results}

@app.get("/api/v1/analytics/overview")
async def get_overview():
    try:
        total_students = await db.students.count_documents({})
        
        # Aggregate average engagement
        pipeline = [
            {"$group": {"_id": None, "avg_engage": {"$avg": "$engagement_score"}}}
        ]
        agg_result = await db.attendance.aggregate(pipeline).to_list(1)
        avg_engagement = agg_result[0]["avg_engage"] if agg_result else 0.0
        
        # Today's attendance
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_attendance = await db.attendance.distinct("student_id", {"timestamp": {"$gte": today_start}})
        
        # Get last 10 engagement points for AI analysis
        recent_logs = await db.attendance.find({}, {"engagement_score": 1}).sort("timestamp", -1).to_list(10)
        trends = [l["engagement_score"] for l in recent_logs]
        
        # Generate AI Insight (Fast, non-blocking-ish or with default)
        ai_insight = "System gathering data for analysis..."
        if len(trends) >= 3:
            # We use a summarized version for the main dashboard
            ai_insight = generate_student_report(
                attendance_data={"total": total_students, "present_today": len(today_attendance)},
                engagement_trends=trends
            )

        return {
            "total_students": total_students,
            "avg_engagement": round(avg_engagement, 2),
            "today_attendance": len(today_attendance),
            "ai_insight": ai_insight,
            "status": "Online (MongoDB + Ollama)"
        }
    except Exception as e:
        print(f"Analytics error: {str(e)}")
        return {"error": str(e), "total_students": 0, "avg_engagement": 0, "today_attendance": 0}

@app.get("/api/v1/students")
async def list_students():
    try:
        students_cursor = db.students.find({}, {"_id": 0, "face_encoding": 0})
        students = await students_cursor.to_list(100)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/attendance/logs")
async def list_attendance_logs():
    try:
        logs_cursor = db.attendance.find({}, {"_id": 0}).sort("timestamp", -1).limit(50)
        logs = await logs_cursor.to_list(50)
        # Convert datetime to string for JSON serialization
        results = []
        for log in logs:
            if isinstance(log.get("timestamp"), datetime):
                log["timestamp"] = log["timestamp"].isoformat()
            results.append(log)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
