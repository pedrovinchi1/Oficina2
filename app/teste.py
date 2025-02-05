import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/certificados_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def test_client():
    return TestClient(app)

def test_create_professor_success(test_client):
    response = test_client.post(
        "/professores/",
        data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_create_professor_missing_fields(test_client):
    response = test_client.post(
        "/professores/",
        data={"nome": "Test Professor"}
    )
    assert response.status_code == 422
    errors = [error["loc"][1] for error in response.json()["detail"]]
    assert "password" in errors or "email" in errors

def test_login_success(test_client):
    # Cria o professor primeiro
    test_client.post(
        "/professores/",
        data={"nome": "Login Professor", "email": "login@example.com", "password": "loginpassword"}
    )
    
    # Tenta login via /token
    response = test_client.post(
        "/token",
        data={"username": "login@example.com", "password": "loginpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_oficina_success(test_client):
    # Cria o professor e faz login
    test_client.post(
        "/professores/",
        data={"nome": "Oficina Professor", "email": "oficina@example.com", "password": "oficinapassword"}
    )
    token_response = test_client.post(
        "/token",
        data={"username": "oficina@example.com", "password": "oficinapassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = token_response.json().get("access_token")
    assert token is not None

    response = test_client.post(
        "/create-oficina",
        data={"titulo": "Test Oficina", "descricao": "Descrição da Test Oficina"},
        headers={"Authorization": f"Bearer {token}"},
        allow_redirects=True
    )
    test_client.cookies = {"access_token": f"Bearer {token}"}
    assert response.status_code == 200

def test_register_presenca_success(test_client):
    # Cria o professor e faz login
    test_client.post(
        "/professores/",
        data={"nome": "Presenca Professor", "email": "presenca@example.com", "password": "presencapassword"}
    )
    token_response = test_client.post(
        "/token",
        data={"username": "presenca@example.com", "password": "presencapassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = token_response.json().get("access_token")
    assert token is not None

    # Cria oficina
    test_client.post(
        "/create-oficina",
        data={"titulo": "Oficina de Teste", "descricao": "Descrição da Oficina"},
        headers={"Authorization": f"Bearer {token}"},
        allow_redirects=True
    )

    # Cria aluno
    test_client.post(
        "/alunos/",
        data={
            "registro_academico": "123456",
            "nome": "Aluno Teste",
            "email": "aluno@example.com",
            "telefone": "123456789"
        }
    )

    # Registra presença
    response = test_client.post(
        "/presencas/",
        data={"oficina_id": 1, "registro_academico": "123456"},
        headers={"Authorization": f"Bearer {token}"},
        allow_redirects=True
    )
    assert response.status_code == 200

def test_read_dashboard_success(test_client):
    # Cria o professor e faz login
    test_client.post(
        "/professores/",
        data={"nome": "Dashboard Professor", "email": "dashboard@example.com", "password": "dashboardpassword"}
    )
    token_response = test_client.post(
        "/token",
        data={"username": "dashboard@example.com", "password": "dashboardpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = token_response.json().get("access_token")
    assert token is not None

    response = test_client.get(
        "/dashboard",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

def test_unauthorized_access(test_client):
    response = test_client.get("/dashboard")
    assert response.status_code == 401

    response = test_client.post(
        "/create-oficina",
        data={"titulo": "Test", "descricao": "Test"},
        allow_redirects=False
    )
    assert response.status_code == 401

    response = test_client.post(
        "/presencas/",
        data={"oficina_id": 1, "registro_academico": "123456"},
        allow_redirects=False
    )
    assert response.status_code == 401