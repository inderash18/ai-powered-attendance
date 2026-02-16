# 🚀 SmartView AI - Enterprise Edition

Welcome to the Enterprise Edition of SmartView AI. This version has been significantly enhanced to meet a ₹10 Crore product valuation standard, featuring advanced AI capabilities, a world-class UI/UX, and robust backend architecture.

## 🌟 Key Enhancements

### 1. World-Class UI/UX
- **New Design System**: A comprehensive `design-system.css` implementing a 60-30-10 color rule, 8pt grid, and enterprise-grade typography.
- **Enterprise Components**: Reusable, polished components (`EnterpriseCard`, `StatCard`, `Badge`) with glassmorphism and advanced states.
- **Responsive Shell**: A completely redesigned layout with a collapsible sidebar, dynamic header, and polished navigation.

### 2. Advanced AI Capabilities
- **Emotion Recognition**: Real-time detection of 7 emotions (Happy, Sad, Neutral, etc.) using DeepFace.
- **Posture Analysis**: Neural monitoring of student posture (slouching, head tilt) for engagement scoring.
- **Predictive Analytics**: Dropout risk scoring and engagement forecasting using linear regression.
- **Automated Reports**: AI-generated weekly summaries and actionable advice.

### 3. Analytics & Reporting
- **New Reports Center**: A dedicated page for viewing and exporting intelligence reports.
- **Dynamic Dashboard**: Real-time visualization of engagement trends and attendance metrics.
- **Risk Assessment**: Instant identification of at-risk students with visual indicators.

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### Quick Start
Run the enterprise installer/launcher:
```powershell
.\run_product.ps1
```
This script will:
1. Create a Python virtual environment.
2. Install all enterprise dependencies (`requirements_enterprise.txt`).
3. Install frontend dependencies.
4. Launch both Backend and Frontend servers.

### Manual Setup
 **Backend**:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements_enterprise.txt
python server.py
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

- `frontend/src/components/enterprise/`: New high-end UI components.
- `frontend/src/styles/design-system.css`: The core design tokens.
- `backend/app/services/advanced_ai.py`: The brain of the new AI features.
- `backend/app/services/analytics_engine.py`: Predictive models and scoring logic.

## 📝 Notes
- The application uses local processing for all AI tasks to ensure **GDPR/FERPA compliance**. No data leaves the machine.
- First run may take a few minutes to download the DeepFace models.

Enjoy the new SmartView AI Enterprise Experience!
