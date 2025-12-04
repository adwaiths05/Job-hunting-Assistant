import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    # This creates a test client for your FastAPI app
    with TestClient(app) as c:
        yield c