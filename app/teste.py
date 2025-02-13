import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# filepath: /c:/Users/pedro/Desktop/Oficina2/app/test_teste.py

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

# Happy Path Tests
def test_create_professor_success(test_client):
    response = test_client.post(
        "/professores/",
        data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_login_success(test_client):
    test_client.post(
        "/professores/",
        data={"nome": "Login Professor", "email": "login@example.com", "password": "loginpassword"}
    )
    response = test_client.post(
        "/token",
        data={"username": "login@example.com", "password": "loginpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_oficina_success(test_client):
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
    assert response.status_code == 200

def test_register_presenca_success(test_client):
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

    test_client.post(
        "/create-oficina",
        data={"titulo": "Oficina de Teste", "descricao": "Descrição da Oficina"},
        headers={"Authorization": f"Bearer {token}"},
        allow_redirects=True
    )

    test_client.post(
        "/alunos/",
        data={
            "registro_academico": "123456",
            "nome": "Aluno Teste",
            "email": "aluno@example.com",
            "telefone": "123456789"
        }
    )

    response = test_client.post(
        "/presencas/",
        data={"oficina_id": 1, "registro_academico": "123456"},
        headers={"Authorization": f"Bearer {token}"},
        allow_redirects=True
    )
    assert response.status_code == 200

def test_read_dashboard_success(test_client):
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

def test_create_aluno_success(test_client):
    response = test_client.post(
        "/alunos/",
        data={
            "registro_academico": "654321",
            "nome": "Aluno Novo",
            "email": "novoaluno@example.com",
            "telefone": "987654321"
        }
    )
    assert response.status_code == 200
    assert response.json()["email"] == "novoaluno@example.com"

def test_read_aluno_success(test_client):
     test_client.post(
        "/alunos/",
        data={
            "registro_academico": "654321",
            "nome": "Aluno Novo",
            "email": "novoaluno@example.com",
            "telefone": "987654321"
        }
    )
     response = test_client.get(f"/alunos/654321")
     assert response.status_code == 200
     assert response.json()["nome"] == "Aluno Novo"


def test_list_oficinas_success(test_client):
    test_client.post(
        "/professores/",
        data={"nome": "Professor Lista", "email": "lista@example.com", "password": "listpass"}
    )
    token_response = test_client.post(
        "/token",
        data={"username": "lista@example.com", "password": "listpass"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = token_response.json().get("access_token")

    test_client.post(
        "/create-oficina",
        data={"titulo": "Oficina Teste", "descricao": "Descrição teste"},
        headers={"Authorization": f"Bearer {token}"}
    )

    response = test_client.get(
        "/oficinas/",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["titulo"] == "Oficina Teste"


# Bad Path Tests
def test_create_professor_missing_fields(test_client):
    response = test_client.post(
        "/professores/",
        data={"nome": "Test Professor"}
    )
    assert response.status_code == 422
    errors = [error["loc"][1] for error in response.json()["detail"]]
    assert "password" in errors or "email" in errors

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

def test_create_professor_duplicate_email(test_client):
    test_client.post(
        "/professores/",
        data={"nome": "Test Professor", "email": "duplicate@example.com", "password": "testpassword"}
    )
    response = test_client.post(
        "/professores/",
        data={"nome": "Another Professor", "email": "duplicate@example.com", "password": "anotherpassword"}
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login_incorrect_password(test_client):
    test_client.post(
        "/professores/",
        data={"nome": "Login Professor", "email": "loginfail@example.com", "password": "loginpassword"}
    )
    response = test_client.post(
        "/token",
        data={"username": "loginfail@example.com", "password": "wrongpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 400
    assert "Incorrect username or password" in response.json()["detail"]

def test_create_oficina_unauthorized(test_client):
    response = test_client.post(
        "/create-oficina",
        data={"titulo": "Unauthorized Oficina", "descricao": "Descrição não autorizada"}
    )
    assert response.status_code == 401


def test_create_aluno_invalid_ra(test_client):
    response = test_client.post(
        "/alunos/",
        data={
            "registro_academico": "12", 
            "nome": "Aluno Teste",
            "email": "aluno@example.com",
            "telefone": "123456789"
        }
    )
    assert response.status_code == 422

def test_create_aluno_duplicate_ra(test_client):
    test_client.post(
        "/alunos/",
        data={
            "registro_academico": "123456",
            "nome": "Aluno Original",
            "email": "aluno1@example.com",
            "telefone": "123456789"
        }
    )
    
    response = test_client.post(
        "/alunos/",
        data={
            "registro_academico": "123456",
            "nome": "Aluno Duplicado",
            "email": "aluno2@example.com",
            "telefone": "987654321"
        }
    )
    assert response.status_code == 400
    assert "Registration number already exists" in response.json()["detail"]

def test_register_presenca_invalid_oficina(test_client):
    test_client.post(
        "/professores/",
        data={"nome": "Professor Teste", "email": "prof@example.com", "password": "testpass"}
    )
    token_response = test_client.post(
        "/token",
        data={"username": "prof@example.com", "password": "testpass"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = token_response.json().get("access_token")


    response = test_client.post(
        "/presencas/",
        data={"oficina_id": 999, "registro_academico": "123456"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert "Workshop not found" in response.json()["detail"]

# Mocking Strategies
def test_mock_create_professor(test_client, mocker):
    mocker.patch("app.crud.create_professor", return_value={"email": "mock@example.com"})
    response = test_client.post(
        "/professores/",
        data={"nome": "Mock Professor", "email": "mock@example.com", "password": "mockpassword"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "mock@example.com"

def test_mock_login(test_client, mocker):
    mocker.patch("app.crud.authenticate_user", return_value={"access_token": "mocktoken"})
    response = test_client.post(
        "/token",
        data={"username": "mock@example.com", "password": "mockpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    assert response.json()["access_token"] == "mocktoken"

def test_mock_create_oficina(test_client, mocker):
    mocker.patch("app.crud.create_oficina", return_value={"titulo": "Mock Oficina"})
    test_client.post(
        "/professores/",
        data={"nome": "Oficina Professor", "email": "oficina_mock@example.com", "password": "oficinapassword"}
    )
    token_response = test_client.post(
        "/token",
        data={"username": "oficina_mock@example.com", "password": "oficinapassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = token_response.json().get("access_token")
    assert token is not None

    response = test_client.post(
        "/create-oficina",
        data={"titulo": "Mocked Oficina", "descricao": "Descrição Mock"},
        headers={"Authorization": f"Bearer {token}"},
        allow_redirects=True
    )
    assert response.status_code == 200