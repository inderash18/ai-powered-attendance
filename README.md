# 🎓 SmartView AI - Student Attendance & Engagement

SmartView AI is a premium, locally-hosted student monitoring system that uses **Face Recognition**, **MediaPipe Gaze Tracking**, and **Ollama Gen-AI** to provide real-time classroom analytics.

---

### 🏛️ Technology Stack
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons
- **Backend**: FastAPI (Python) + Uvicorn
- **Database**: Local MongoDB (Compass Compatible)
- **AI Engines**: 
  - `face_recognition`: Identity Verification
  - `MediaPipe`: Gaze & Engagement Tracking
  - `Ollama`: Generative Institutional Reporting

---

### 🚀 Quick Start (One-Click)

1.  **Start Services**: Ensure **MongoDB** and **Ollama** are running.
2.  **Run System**: Open PowerShell in the root folder and run:
    ```powershell
    .\run_product.ps1
    ```
3.  **Access UI**: Open the link shown in the terminal (usually `http://localhost:5173`).

---

### 📊 Making it Dynamic (Run-time Ready)

If the dashboard and student list are empty, you can populate them with realistic mock data instantly:
1.  Open a terminal in the `backend/` folder.
2.  Run the seed script:
    ```powershell
    .\venv\Scripts\python seed_mongo.py
    ```
This will create 5 students and 7 days of attendance history for immediate visualization across all pages.

---

### 📁 Key Components
- **`backend/server.py`**: The heart of the system. Manages MongoDB connections, AI processing, and Ollama integration.
- **`backend/seed_mongo.py`**: Custom script to populate your database with initial students and logs.
- **`frontend/src/pages/`**: 
  - `Dashboard.jsx`: Dynamic stats and AI intelligence reports.
  - `Monitoring.jsx` & `Attendance.jsx`: Real-time biometric sensing interfaces.
  - `Students.jsx`: Database directory linked to MongoDB.

---

### 🔒 Privacy Note
All biometric hashing and AI reasoning occur **locally**. No student data ever leaves this machine.
