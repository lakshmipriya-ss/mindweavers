from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Core settings – pulled from .env or environment
    PROJECT_NAME: str = "DisasterFlow Production API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/disasterflow")

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # AI / CrewAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_API_BASE: str | None = os.getenv("OPENAI_API_BASE")
    OPENAI_MODEL_NAME: str = os.getenv("OPENAI_MODEL_NAME", "phi3")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
