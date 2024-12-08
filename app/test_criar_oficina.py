def test_create_oficina(test_client):
    # Logar e obter token
    response = test_client.post("/login", data={"username": "login@test.com", "password": "testpassword"})
    assert response.status_code == 200
    token = response.cookies.get("access_token")

    # Teste de criação de oficina com sucesso
    response = test_client.post(
        "/create-oficina",
        data={"titulo": "Nova Oficina", "descricao": "Descrição da oficina"},
        cookies={"access_token": token}
    )
    assert response.status_code == 302  # Redirecionamento esperado após sucesso
