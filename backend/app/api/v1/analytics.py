from fastapi import APIRouter
from app.db.mongodb import db
from app.services.ollama_ai import generate_student_report
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/student/{student_id}/report")
async def get_student_report(student_id: str):
    # Fetch student info
    student = await db["students"].find_one({"student_id": student_id})
    if not student:
        return {"error": "Student not found"}

    # Fetch last 30 days attendance
    last_month = datetime.utcnow() - timedelta(days=30)
    logs = await db["attendance"].find({
        "student_id": student_id,
        "timestamp": {"$gte": last_month}
    }).to_list(100)

    attendance_pct = (len(logs) / 20) * 100 # Assuming 20 sessions per month
    engagement_scores = [log["engagement_score"] for log in logs]
    avg_engagement = sum(engagement_scores) / len(engagement_scores) if engagement_scores else 0

    # AI Analysis
    ai_summary = generate_student_report(
        attendance_data={"percentage": attendance_pct, "days_present": len(logs)},
        engagement_trends=engagement_scores[-5:]
    )

    return {
        "student_name": student["name"],
        "attendance": attendance_pct,
        "avg_engagement": avg_engagement,
        "ai_analysis": ai_summary
    }

@router.get("/dashboard/stats")
async def get_dashboard_stats():
    total_students = await db["students"].count_documents({})
    # simplified today stats
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    present_today = await db["attendance"].distinct("student_id", {"timestamp": {"$gte": today_start}})
    
    return {
        "total_students": total_students,
        "present_today": len(present_today),
        "absent_today": total_students - len(present_today)
    }
