import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db


SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/certificados"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

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

def test_create_professor(test_client):
    response = test_client.post("/professores/", data={"nome": "Test Professor", "email": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_login(test_client):
    response = test_client.post("/login", data={"username": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.cookies

def test_create_oficina(test_client):
    response = test_client.post("/login", data={"username": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    token = response.cookies.get("access_token")

    response = test_client.post("/create-oficina", data={"titulo": "Test Oficina", "descricao": "Descrição da Test Oficina"}, cookies={"access_token": token})
    assert response.status_code == 302  

def test_read_dashboard(test_client):
    response = test_client.get("/dashboard")
    assert response.status_code == 200
    assert "Dashboard" in response.text