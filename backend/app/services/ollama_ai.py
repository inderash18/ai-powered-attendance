import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral" # or deepseek-r1:7b

def generate_student_report(attendance_data: dict, engagement_trends: list) -> str:
    """
    Generates an AI report for a student using local Ollama instance.
    """
    prompt = f"""
    Analyze the following student performance data and provide a concise summary and recommendations.
    
    Attendance: {attendance_data}
    Engagement Trends (last 5 sessions): {engagement_trends}
    
    Structure the response as:
    1. Summary of Performance
    2. At-risk Status (High/Medium/Low)
    3. Specific Recommendations for the Teacher
    """
    
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        if response.status_code == 200:
            return response.json().get("response", "No response from AI")
        else:
            return f"Error from Ollama: {response.text}"
    except Exception as e:
        return f"Failed to connect to local Ollama service: {str(e)}"
