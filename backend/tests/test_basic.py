import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core import config

client = TestClient(app)

@pytest.fixture(scope="module")
def test_user():
    # Register a test user (idempotent on first run)
    payload = {"email": "test@example.com", "password": "test123"}
    resp = client.post("/auth/register", json=payload)
    assert resp.status_code in (200, 400)  # 400 if already exists
    return payload

def test_login(test_user):
    resp = client.post("/auth/login", json=test_user)
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_create_incident(test_user):
    # Get token
    login = client.post("/auth/login", json=test_user).json()
    token = login["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"tweet_text": "Mock fire incident"}
    resp = client.post("/incidents/create", json=payload, headers=headers)
    assert resp.status_code == 200
    incident = resp.json()
    assert incident["tweet_text"] == "Mock fire incident"
    assert "id" in incident
