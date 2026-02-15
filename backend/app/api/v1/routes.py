from fastapi import APIRouter
from app.api.v1 import students, attendance, analytics

router = APIRouter()
router.include_router(students.router, prefix="/students", tags=["students"])
router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
