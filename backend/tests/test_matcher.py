def test_match_jobs(client):
    # Matches backend/app/api/v1/matcher.py
    payload = {
        "resume_text": "Experienced Python Developer with FastAPI skills",
        "top_k": 3
    }
    response = client.post("/api/v1/matcher/match", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "top_matches" in data
    assert isinstance(data["top_matches"], list)