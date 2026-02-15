# Start backend and frontend (PowerShell)
Write-Host "Start MongoDB separately; this script starts backend and frontend dev servers."

Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit","-Command","cd 'I:/vac/backend'; .venv\Scripts\activate; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit","-Command","cd 'I:/vac/frontend'; npm install; npm run dev"
