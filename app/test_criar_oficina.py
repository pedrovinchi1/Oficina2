import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_oficina_success():
    response = client.post("/login", data={"username": "login@test.com", "password": "testpassword"})
    assert response.status_code == 200
    token = response.cookies.get("access_token")

    response = client.post(
        "/create-oficina",
        data={"titulo": "Nova Oficina", "descricao": "Descrição da oficina"},
        cookies={"access_token": token}
    )
    assert response.status_code == 302  

def test_create_oficina_no_token():
    response = client.post(
        "/create-oficina",
        data={"titulo": "Nova Oficina", "descricao": "Descrição da oficina"}
    )
    assert response.status_code == 401  

def test_create_oficina_invalid_token():
    response = client.post(
        "/create-oficina",
        data={"titulo": "Nova Oficina", "descricao": "Descrição da oficina"},
        cookies={"access_token": "invalid_token"}
    )
    assert response.status_code == 401  