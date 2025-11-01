from dotenv import load_dotenv
import os

# Load variables from the .env file
load_dotenv()

# Weaviate URL
WEAVIATE_URL = os.getenv("WEAVIATE_URL", "http://localhost:8080")

# Optional: other variables
PORT = os.getenv("PORT", 8000)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./db.sqlite3")
