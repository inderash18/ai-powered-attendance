# SmartView AI - Running Product

This project has been simplified for ease of use. It now uses a local SQLite database and a single-file backend.

## 🚀 One-Click Start

To install everything and start the product, run the following command in PowerShell:

```powershell
.\run_product.ps1
```

## 🛠 Manual Steps (if script fails)

### 1. Backend Setup
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\activate.ps1`
4. Install libs: `pip install -r requirements_simple.txt`
5. Run server: `python server.py`

### 2. Frontend Setup
1. Navigate to `frontend/`
2. Install libs: `npm install`
3. Run dev server: `npm run dev`

## 📊 Components Included
- **Register**: Enroll students with biometric (face) data.
- **Monitoring**: Real-time face recognition and engagement tracking.
- **Dashboard**: Institutional overview and analytics.

The system is 100% local and does not require MongoDB or any cloud services.
