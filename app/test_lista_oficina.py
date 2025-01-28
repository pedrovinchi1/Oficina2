import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_oficinas():
    response = client.get("/oficinas")
    assert response.status_code == 200
    oficinas = response.json()
    assert isinstance(oficinas, list)
    
    # Verificar se a lista não está vazia
    assert len(oficinas) > 0
    
    # Verificar se cada oficina tem os campos esperados
    for oficina in oficinas:
        assert "id" in oficina
        assert "titulo" in oficina
        assert "descricao" in oficina