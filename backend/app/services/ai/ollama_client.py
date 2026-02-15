import subprocess
import json
import requests
from typing import Optional

OLLAMA_HTTP = "http://127.0.0.1:11434/v1/generate"

def generate_with_ollama(prompt: str, model: str = "mistral") -> str:
    # try HTTP API
    try:
        resp = requests.post(OLLAMA_HTTP, json={"model": model, "prompt": prompt}, timeout=10)
        data = resp.json()
        return data.get("text") or json.dumps(data)
    except Exception:
        # fallback to CLI
        try:
            cmd = ["ollama", "generate", model, "--prompt", prompt]
            proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return proc.stdout
        except Exception as e:
            return f"OLLAMA_ERROR: {e}"
