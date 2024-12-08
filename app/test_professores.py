def test_create_professor(test_client):
    # Teste de sucesso
    response = test_client.post(
        "/professores/",
        data={"nome": "Professor Teste", "email": "professor@test.com", "password": "12345"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "professor@test.com"

    # Teste de email duplicado
    response = test_client.post(
        "/professores/",
        data={"nome": "Outro Professor", "email": "professor@test.com", "password": "12345"}
    )
    assert response.status_code == 400
    assert "Email already registered" in response.text
