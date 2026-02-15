# 🎓 SmartView AI - Setup & Running Guide

This project consists of a **FastAPI backend** and a **React (Vite) frontend**. All services run 100% locally.

## 📌 Prerequisites

1.  **Python 3.10+**: [Download Python](https://www.python.org/downloads/)
2.  **Node.js & npm**: [Download Node.js](https://nodejs.org/)
3.  **MongoDB**: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) (Run it on default port 27017)
4.  **Ollama**: [Download Ollama](https://ollama.com/) (For local AI analysis)
5.  **C++ Build Tools**: Required for `face_recognition` (dlib). Install "Desktop development with C++" from [Visual Studio Installer](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

---

## 🚀 How to Run

### 1. Setup Local AI (Ollama)
Open a terminal and run:
```powershell
ollama pull llama3
```

### 2. Start the Backend
Open a **new** terminal:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# If you get errors with dlib, ensure C++ Build Tools are installed
uvicorn app.main:app --reload --port 8000
```

### 3. Start the Frontend
Open a **new** terminal:
```powershell
cd frontend
npm install
npm run dev
```
The app will be available at: `http://localhost:5173`

---

## 📁 Project Structure
- `backend/`: Python FastAPI logic, AI services (MediaPipe, OpenCV).
- `frontend/`: React components and dashboard.
- `data/face_images/`: Local storage for enrolled student photos.

## 🛠️ Configuration
If your MongoDB or Ollama is running on a different port, update:
- **Backend DB**: `backend/app/db/mongodb.py`
- **AI Model**: `backend/app/services/ollama_ai.py`
