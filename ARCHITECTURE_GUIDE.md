# AI Student Attendance & Engagement Monitoring - Implementation Guide

## 1. Complete Folder Structure
```text
vac/
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point
│   │   ├── api/v1/             # Modular routes (Students, Attendance, Analytics)
│   │   ├── db/                 # MongoDB connection & Pydantic models
│   │   ├── services/           # AI Modules (FaceRecog, MediaPipe, Ollama)
│   │   └── core/               # App configuration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                # API Client services
│   │   ├── components/         # Premium UI Components
│   │   ├── pages/              # Dashboard, Attendance, Registration pages
│   │   ├── state/              # Zustand Store
│   │   └── App.jsx             # Routes & Layout
│   └── package.json
└── data/
    └── face_images/            # Local storage for student photos
```

## 2. API Endpoint List (RESTful)
- `POST /api/v1/students/register`: Registers student (Name, ID, Photo).
- `GET /api/v1/students/`: List all students.
- `POST /api/v1/attendance/process-frame`: Identifies student and engagement in a frame.
- `GET /api/v1/analytics/dashboard/stats`: Returns summary counts.
- `GET /api/v1/analytics/student/{id}/report`: Generates Ollama AI analysis.
- `GET /api/v1/analytics/export/csv`: Download attendance history.

## 3. MongoDB Schema Design
- **Collection: `students`**
  - `student_id`: String (Unique)
  - `name`: String
  - `class`: String
  - `face_encoding`: Array[Float] (128d vector)
  - `image_path`: String
- **Collection: `attendance`**
  - `student_id`: String
  - `timestamp`: Date
  - `engagement_score`: Float (0-100)
  - `is_present`: Boolean

## 4. Engagement Detection Logic (MediaPipe)
- Use **Facial Landmarks** to calculate EAR.
- Head Pose: Calculate Pitch, Yaw, Roll using landmarks on nose, chin, eyes, and ears.
- Absense: If `results.multi_face_landmarks` is empty, log student as "Away".

## 5. Ollama Integration (Local LLM)
- Request: `POST http://localhost:11434/api/generate`
- Model: `llama3` or `mistral` (7B models run well locally).
- Prompting: Feed aggregate attendance % and engagement scores to generate teacher-facing tips.

## 6. Recommended State Management
- **Zustand**: Lightweight and scalable. Use separate stores for `attendanceStore` (real-time data) and `authStore` (if needed later).

## 7. Development Phases
1. **Infra**: MongoDB + Ollama setup.
2. **Backend**: CRUD for students + Face Encoding.
3. **Engine**: MediaPipe + OpenCV real-time processor.
4. **Front**: Dashboard with Recharts & Camera component.
5. **AI**: Ollama insight generation.
