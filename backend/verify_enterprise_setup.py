import sys
import importlib.util

def check_library(name):
    if name in sys.modules:
        print(f"✅ {name} is already imported")
        return True
    elif (spec := importlib.util.find_spec(name)) is not None:
        print(f"✅ {name} installed")
        return True
    else:
        print(f"❌ {name} NOT installed")
        return False

print("🔍 Validating Enterprise AI Environment...")

try:
    import tensorflow
    print(f"✅ TensorFlow version: {tensorflow.__version__}")
except ImportError:
    print("❌ TensorFlow NOT installed")

libs = [
    "deepface",
    "mediapipe",
    "face_recognition",
    "cv2",
    "dlib",
    "sklearn",
    "pandas",
    "fastapi",
    "uvicorn",
    "pymongo"
]

all_good = True
for lib in libs:
    if not check_library(lib):
        all_good = False

if all_good:
    print("\n✨ Enterprise Environment Verified! You are ready to launch.")
else:
    print("\n⚠️ Some libraries are missing. Please run 'pip install -r requirements_enterprise.txt'")
