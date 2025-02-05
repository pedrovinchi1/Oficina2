const baseUrl = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            const response = await fetch(`${baseUrl}/professores/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Professor cadastrado com sucesso!");
            } else {
                alert("Erro ao cadastrar professor.");
            }
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = '';
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            const { email, password } = data;

            // Validação client-side
            if (!email || !password) {
                errorMessage.textContent = 'Por favor, preencha todos os campos.';
                return;
            }

            try {
                const response = await fetch(`${baseUrl}/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({ username: email, password }),
                });

                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem("token", result.access_token);
                    window.location.href = '/dashboard';
                } else {
                    const errorData = await response.json();
                    errorMessage.textContent = errorData.detail || 'Credenciais inválidas';
                }
            } catch (error) {
                errorMessage.textContent = 'Erro na conexão com o servidor';
            }
        });
    }

    const createOficinaForm = document.getElementById("create-oficina-form");
    if (createOficinaForm) {
        createOficinaForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}/oficinas/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Oficina cadastrada com sucesso!");
            } else {
                alert("Erro ao cadastrar oficina.");
            }
        });
    }

    const presencaForm = document.getElementById("presenca-form");
    if (presencaForm) {
        presencaForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}/presencas/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                const error = await response.json();
                alert(`Erro: ${error.detail}`);
            }
        });
    }
});