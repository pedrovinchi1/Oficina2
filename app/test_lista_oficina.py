def test_read_oficinas(test_client):
    response = test_client.get("/oficinas")
    assert response.status_code == 200
    oficinas = response.json()
    assert isinstance(oficinas, list)
