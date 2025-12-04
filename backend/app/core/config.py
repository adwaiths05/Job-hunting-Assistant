import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Job Hunting Agent"
    PROJECT_VERSION: str = "1.0.0"

    # 🐘 Database (PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/job_agent")

    # 🧠 AI & Vectors
    WEAVIATE_URL: str = os.getenv("WEAVIATE_URL", "http://localhost:8080")
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY")

    # 🔐 Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_change_me_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 🤖 MCP Agent URLs
    BROWSER_MCP_URL: str = os.getenv("BROWSER_MCP_URL", "http://localhost:3001/sse")
    NOTION_MCP_URL: str = os.getenv("NOTION_MCP_URL", "http://localhost:3002/sse")
    GMAIL_MCP_URL: str = os.getenv("GMAIL_MCP_URL", "http://localhost:3003/sse")
    CALENDAR_MCP_URL: str = os.getenv("CALENDAR_MCP_URL", "http://localhost:3004/sse")

settings = Settings()