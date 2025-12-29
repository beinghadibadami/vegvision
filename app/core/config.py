import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Fruit and Vegetable Analysis API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API to analyze fruits and vegetables for quality, moisture, size, insights, and prices."
    
    MONGODB_URL: str = os.getenv("MONGODB_URL", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: list = [
        "https://vegvision.onrender.com",
        "http://localhost:3000",
        "http://localhost:8080", 
    ]

settings = Settings()
