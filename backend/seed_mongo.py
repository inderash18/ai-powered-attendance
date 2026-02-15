import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import datetime

async def seed_data():
    uri = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(uri)
    db = client['attendance_app']
    
    print("🌱 Seeding a test student...")
    
    test_student = {
        "student_id": "TEST-001",
        "name": "Diagnostic Student",
        "face_encoding": [0.0] * 128
    }
    
    await db.students.update_one(
        {"student_id": "TEST-001"},
        {"$set": test_student},
        upsert=True
    )
    
    await db.attendance.insert_one({
        "student_id": "TEST-001",
        "timestamp": datetime.datetime.now(),
        "engagement_score": 95.0,
        "is_present": True
    })
    
    print("✅ Seed complete! database 'attendance_app' and collections 'students' and 'attendance' should now be visible in MongoDB Compass.")
    print("Please refresh Compass (press the refresh icon or F5).")

if __name__ == "__main__":
    asyncio.run(seed_data())
