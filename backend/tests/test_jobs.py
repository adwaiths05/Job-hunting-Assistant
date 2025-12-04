def test_add_job(client):
    job_data = {
        "title": "Software Engineer Test",
        "company": "Test Corp",
        "description": "Looking for a python developer for testing.",
        "embedding": [0.1] * 384  # Mock embedding to skip API call if possible
    }
    response = client.post("/api/v1/jobs/add-job", json=job_data)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_search_jobs(client):
    search_data = {
        "query_text": "python developer",
        "top_k": 2
    }
    response = client.post("/api/v1/jobs/search-jobs", json=search_data)
    assert response.status_code == 200
    assert "results" in response.json()