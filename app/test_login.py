def test_login(test_client):
    # Registrar professor para o teste
    test_client.post(
        "/professores/",
        data={"nome": "Login Test", "email": "login@test.com", "password": "testpassword"}
    )

    # Teste de login com sucesso
    response = test_client.post("/login", data={"username": "login@test.com", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.cookies

    # Teste de login com senha errada
    response = test_client.post("/login", data={"username": "login@test.com", "password": "wrongpassword"})
    assert response.status_code == 401
