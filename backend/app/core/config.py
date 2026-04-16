import os

class Settings:
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://unocade:secret@localhost:5432/fitpulse"
    )
    
    # Security & CORS
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")

settings = Settings()
