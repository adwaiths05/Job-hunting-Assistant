def test_upload_resume(client):
    # Mock a text file
    files = {
        'file': ('resume.txt', 'Experienced Python Developer with 5 years of experience...', 'text/plain')
    }
    response = client.post("/api/v1/resume/upload", files=files)
    
    assert response.status_code == 200
    json_data = response.json()
    assert "message" in json_data
    assert json_data["message"] == "Resume processed"
    assert "data" in json_data