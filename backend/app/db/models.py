from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class StudentSchema(BaseModel):
    student_id: str
    name: str
    class_name: str = Field(alias="class")
    face_encoding: List[float]
    image_path: str
    registered_at: datetime = Field(default_factory=datetime.utcnow)

class AttendanceLog(BaseModel):
    student_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: str
    engagement_score: float  # 0 to 100
    is_present: bool = True

class EngagementLog(BaseModel):
    student_id: str
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    eye_closure_ratio: float
    head_pose: dict  # {"pitch": x, "yaw": y, "roll": z}
    is_missing: bool
    engagement_snapshot: float
