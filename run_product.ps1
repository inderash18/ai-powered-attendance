# SmartView AI - One-Click Run Script

Write-Host "Starting SmartView AI Setup..."

# 1. Backend Setup
Write-Host "Setting up Backend..."
$backendPath = "i:\vac\backend"
Set-Location $backendPath
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}
& ".\venv\Scripts\activate.ps1"
python -m pip install --upgrade pip
python -m pip install -r requirements_simple.txt

# 2. Frontend Setup
Write-Host "Setting up Frontend..."
$frontendPath = "i:\vac\frontend"
Set-Location $frontendPath
npm install

# 3. Launching
Write-Host "Launching Product..."

# Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $backendPath; .\venv\Scripts\activate.ps1; python server.py"

# Start Frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $frontendPath; npm run dev"

Write-Host "Both servers are starting up!"
Write-Host "Backend: http://127.0.0.1:8000"
Write-Host "Frontend: Check the Vite output"
