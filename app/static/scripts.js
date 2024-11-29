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

        const response = await fetch(`${baseUrl}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data),
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem("token", result.access_token);
            alert("Login realizado com sucesso!");
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

    document.getElementById("presenca-form").addEventListener("submit", async (event) => {
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
            alert("Presença registrada com sucesso!");
        } else {
            alert("Erro ao registrar presença.");
        }
    });
});