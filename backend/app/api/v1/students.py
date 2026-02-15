from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from datetime import datetime
import aiofiles
import uuid
from app.services.face_recog import encode_face
from app.db.mongodb import db

router = APIRouter()


@router.post("/register")
async def register_student(
    name: str = Form(...),
    student_id: str = Form(...),
    class_name: str = Form(""),
    image: UploadFile = File(...),
):
    if image.content_type.split("/")[0] != "image":
        raise HTTPException(status_code=400, detail="Invalid image")
    filename = f"{student_id}_{uuid.uuid4().hex}.jpg"
    path = f"I:/vac/data/face_images/{filename}"
    # ensure folder exists
    import os
    os.makedirs(os.path.dirname(path), exist_ok=True)
    # save file
    async with aiofiles.open(path, "wb") as out_file:
        content = await image.read()
        await out_file.write(content)
    # encode
    encoding = encode_face(path)
    if encoding is None:
        raise HTTPException(status_code=400, detail="No face detected")
    doc = {
        "student_id": student_id,
        "name": name,
        "class": class_name,
        "face_encoding": encoding,
        "image_path": path,
        "registered_at": datetime.utcnow(),
    }
    await db["students"].insert_one(doc)
    return {"status": "ok", "student_id": student_id}
