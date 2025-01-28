import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_update_oficina_success():
    # Logar e obter token
    response = client.post("/login", data={"username": "login@test.com", "password": "testpassword"})
    assert response.status_code == 200
    token = response.cookies.get("access_token")

    # Criar uma oficina para atualizar
    response = client.post(
        "/create-oficina",
        data={"titulo": "Oficina Antiga", "descricao": "Descrição antiga"},
        cookies={"access_token": token}
    )
    assert response.status_code == 302
    oficina_id = response.json()["id"]

    # Teste de atualização de oficina com sucesso
    response = client.put(
        f"/update-oficina/{oficina_id}",
        data={"titulo": "Oficina Atualizada", "descricao": "Descrição atualizada"},
        cookies={"access_token": token}
    )
    assert response.status_code == 200
    updated_oficina = response.json()
    assert updated_oficina["titulo"] == "Oficina Atualizada"
    assert updated_oficina["descricao"] == "Descrição atualizada"

def test_update_oficina_no_token():
    # Criar uma oficina para atualizar
    response = client.post(
        "/create-oficina",
        data={"titulo": "Oficina Antiga", "descricao": "Descrição antiga"}
    )
    assert response.status_code == 302
    oficina_id = response.json()["id"]

    # Teste de atualização de oficina sem token
    response = client.put(
        f"/update-oficina/{oficina_id}",
        data={"titulo": "Oficina Atualizada", "descricao": "Descrição atualizada"}
    )
    assert response.status_code == 401  # Espera-se falha de autenticação

def test_update_oficina_invalid_token():
    # Criar uma oficina para atualizar
    response = client.post(
        "/create-oficina",
        data={"titulo": "Oficina Antiga", "descricao": "Descrição antiga"}
    )
    assert response.status_code == 302
    oficina_id = response.json()["id"]

    # Teste de atualização de oficina com token inválido
    response = client.put(
        f"/update-oficina/{oficina_id}",
        data={"titulo": "Oficina Atualizada", "descricao": "Descrição atualizada"},
        cookies={"access_token": "invalid_token"}
    )
    assert response.status_code == 401  # Espera-se falha de autenticação