const baseUrl = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("register-form").addEventListener("submit", async (event) => {
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

    document.getElementById("login-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "appliction/x-www-form-urlencoded",
            },
            credentials: "include",
            body: new URLSearchParams(data),
        });

    // Se o login for bem-sucedido, o backend redireciona para /dashboard
    if (response.ok) {
        // Redirecionamento manual, pois o fetch não lida com redirecionamento da mesma forma que o browser
        window.location.href = "/dashboard";
    } else {
        alert("Erro ao realizar login.");
    }
});

    document.getElementById("create-oficina-form").addEventListener("submit", async (event) => {
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

    document.getElementById('presenca-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        const token = localStorage.getItem("token");

        const response = await fetch(`${baseUrl}/presencas/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
        } else {
            const error = await response.json();
            alert(`Erro: ${error.detail}`);
        }
    });
});