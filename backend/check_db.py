import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_mongo():
    uri = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(uri)
    try:
        # Check connection
        await client.admin.command('ping')
        print("✅ SUCCESS: Successfully connected to MongoDB at localhost:27017")
        
        # Check database and collections
        db = client['attendance_app']
        
        # List databases to see if it even exists
        db_names = await client.list_database_names()
        print(f"Existing Databases: {db_names}")
        
        if 'attendance_app' in db_names:
            students_count = await db.students.count_documents({})
            attendance_count = await db.attendance.count_documents({})
            print(f"Database 'attendance_app' exists.")
            print(f" - Students: {students_count}")
            print(f" - Attendance Logs: {attendance_count}")
        else:
            print("❌ Database 'attendance_app' does not exist yet. You need to register a student or start monitoring.")
            
    except Exception as e:
        print(f"❌ FAILURE: Could not connect to MongoDB. Error: {e}")
        print("\nPossible solutions:")
        print("1. Ensure MongoDB Community Server is installed.")
        print("2. Ensure the 'MongoDB' service is running in Windows Services.")
        print("3. Try restarting MongoDB.")

if __name__ == "__main__":
    asyncio.run(check_mongo())
