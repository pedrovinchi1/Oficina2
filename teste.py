import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Configuração do banco de dados para testes
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/certificados_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Criação das tabelas para testes
Base.metadata.create_all(bind=engine)

# Override da função get_db para usar o banco de dados de testes
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def test_client():
    yield client

#teste de cadastro prof#

def test_create_professor_success(test_client):
    response = test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_create_professor_duplicate_email(test_client):
    # Tenta criar um professor com o mesmo email
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "duplicate@example.com", "password": "testpassword"})
    response = test_client.post("/professores/", data={"nome": "Another Professor", "email": "duplicate@example.com", "password": "testpassword"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_create_professor_missing_fields(test_client):
    response = test_client.post("/professores/", data={"nome": "Test Professor"})
    assert response.status_code == 422  # Unprocessable Entity
    assert "email" in response.json()["detail"][0]["loc"]
    assert "password" in response.json()["detail"][0]["loc"]

def test_create_professor_invalid_email(test_client):
    response = test_client.post("/professores/", data={"nome": "Test Professor", "email": "invalid-email", "password": "testpassword"})
    assert response.status_code == 422  # Unprocessable Entity
    assert "value is not a valid email address" in response.json()["detail"][0]["msg"]

#teste de login#

def test_login_success(test_client):
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.cookies

def test_login_invalid_credentials(test_client):
    response = test_client.post("/login", data={"email": "wrong@example.com", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_login_missing_fields(test_client):
    response = test_client.post("/login", data={"email": "test@example.com"})
    assert response.status_code == 422  # Unprocessable Entity
    assert "password" in response.json()["detail"][0]["loc"]

def test_login_empty_credentials(test_client):
    response = test_client.post("/login", data={})
    assert response.status_code == 422  # Unprocessable Entity
    assert "email" in response.json()["detail"][0]["loc"]
    assert "password" in response.json()["detail"][0]["loc"]

#testes de criação de oficina#

def test_create_oficina_success(test_client):
    # Logar primeiro
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    token = response.cookies.get("access_token")

    response = test_client.post("/create-oficina", data={"titulo": "Test Oficina", "descricao": "Descrição da Test Oficina"}, cookies={"access_token": token})
    assert response.status_code == 302  # Redireciona após a criação

def test_create_oficina_unauthenticated(test_client):
    response = test_client.post("/create-oficina", data={"titulo": "Test Oficina", "descricao": "Descrição da Test Oficina"})
    assert response.status_code == 401  # Not authenticated

def test_create_oficina_missing_fields(test_client):
    # Logar primeiro
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    token = response.cookies.get("access_token")

    response = test_client.post("/create-oficina", data={"titulo": "Test Oficina"}, cookies={"access_token": token})
    assert response.status_code == 422  # Unprocessable Entity
    assert "descricao" in response.json()["detail"][0]["loc"]
def test_create_oficina_invalid_data(test_client):
    # Logar primeiro
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    token = response.cookies.get("access_token")

    # Tentar criar uma oficina com título muito curto
    response = test_client.post("/create-oficina", data={"titulo": "T", "descricao": "Descrição da Test Oficina"}, cookies={"access_token": token})
    assert response.status_code == 422  # Unprocessable Entity
    assert "ensure this value has at least 2 characters" in response.json()["detail"][0]["msg"]

#testes de leitura do dashboard#

def test_read_dashboard_success(test_client):
    # Logar primeiro
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    token = response.cookies.get("access_token")

    response = test_client.get("/dashboard", cookies={"access_token": token})
    assert response.status_code == 200
    assert "Bem Vindo ao Seu Dashboard" in response.text

def test_read_dashboard_unauthenticated(test_client):
    response = test_client.get("/dashboard")
    assert response.status_code == 401  # Not authenticated

def test_read_dashboard_invalid_token(test_client):
    response = test_client.get("/dashboard", cookies={"access_token": "invalid_token"})
    assert response.status_code == 401  # Not authenticated

#testes de presença#

def test_register_presenca_success(test_client):
    # Logar primeiro
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    token = response.cookies.get("access_token")

    # Criar uma oficina para registrar presença
    test_client.post("/create-oficina", data={"titulo": "Oficina de Teste", "descricao": "Descrição da Oficina"}, cookies={"access_token": token})

    # Registrar presença
    response = test_client.post("/presencas/", data={"oficina_id": 1, "registro_academico": "123456"}, cookies={"access_token": token})
    assert response.status_code == 200
    assert "Presença registrada com sucesso!" in response.text

def test_register_presenca_unauthenticated(test_client):
    response = test_client.post("/presencas/", data={"oficina_id": 1, "registro_academico": "123456"})
    assert response.status_code == 401  # Not authenticated

def test_register_presenca_invalid_oficina(test_client):
    # Logar primeiro
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    token = response.cookies.get("access_token")

    # Tentar registrar presença em uma oficina que não existe
    response = test_client.post("/presencas/", data={"oficina_id": 999, "registro_academico": "123456"}, cookies={"access_token": token})
    assert response.status_code == 404  # Oficina não encontrada

def test_register_presenca_aluno_not_found(test_client):
    # Logar primeiro
    test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    response = test_client.post("/login", data={"email": "test@example.com", "password": "testpassword"})
    token = response.cookies.get("access_token")

    # Criar uma oficina para registrar presença
    test_client.post("/create-oficina", data={"titulo": "Oficina de Teste", "descricao": "Descrição da Oficina"}, cookies={"access_token": token})

    # Tentar registrar presença com um registro acadêmico que não existe
    response = test_client.post("/presencas/", data={"oficina_id": 1, "registro_academico": "999999"}, cookies={"access_token": token})
    assert response.status_code == 404  # Aluno não encontrado