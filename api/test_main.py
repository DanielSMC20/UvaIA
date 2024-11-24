import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == "Hello, I am alive"

def test_predict_valid_image():
    with open("test_image.jpg", "rb") as image_file:
        response = client.post("/predict", files={"file": image_file})
    assert response.status_code == 200
    assert "class" in response.json()
    assert "confidence" in response.json()
    assert "suggestions" in response.json()

def test_predict_invalid_image():
    with open("invalid_image.txt", "rb") as image_file:
        response = client.post("/predict", files={"file": image_file})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid image file"}