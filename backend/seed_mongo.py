import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import datetime
import random

async def seed_data():
    uri = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(uri)
    db = client['attendance_app']
    
    print("🌱 Clearing existing data...")
    await db.students.delete_many({})
    await db.attendance.delete_many({})
    
    students = [
        {"student_id": "STU-001", "name": "Aiden Marcus", "face_encoding": [random.uniform(-1, 1) for _ in range(128)]},
        {"student_id": "STU-002", "name": "Zoe Vance", "face_encoding": [random.uniform(-1, 1) for _ in range(128)]},
        {"student_id": "STU-003", "name": "Liam Thorne", "face_encoding": [random.uniform(-1, 1) for _ in range(128)]},
        {"student_id": "STU-004", "name": "Sophia Chen", "face_encoding": [random.uniform(-1, 1) for _ in range(128)]},
        {"student_id": "STU-005", "name": "James Miller", "face_encoding": [random.uniform(-1, 1) for _ in range(128)]}
    ]
    
    print(f"🌱 Seeding {len(students)} students...")
    await db.students.insert_many(students)
    
    print("🌱 Seeding attendance history (last 7 days)...")
    logs = []
    now = datetime.datetime.now()
    for i in range(7): # 7 days
        day = now - datetime.timedelta(days=i)
        # Randomly choose 2-4 students present each day
        present_count = random.randint(2, 5)
        picked_students = random.sample(students, present_count)
        
        for s in picked_students:
            # 2 check-ins per day per student
            for _ in range(random.randint(1, 3)):
                logs.append({
                    "student_id": s["student_id"],
                    "timestamp": day - datetime.timedelta(hours=random.randint(1, 8)),
                    "engagement_score": round(random.uniform(60, 100), 2),
                    "is_present": True
                })
    
    await db.attendance.insert_many(logs)
    
    print("✅ Seed complete!")
    print(f" - Students: {len(students)}")
    print(f" - Logs: {len(logs)}")
    print("\nDatabase is now fully dynamic and runtime-ready!")

if __name__ == "__main__":
    asyncio.run(seed_data())
