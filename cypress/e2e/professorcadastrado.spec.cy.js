describe("Professor Cadastrado", () => {
    it("Deve exibir a mensagem de sucesso e redirecionar para o dashboard", () => {
        cy.visit("/professorcadastrado");
        cy.contains("Professor Cadastrado com Sucesso").should("be.visible");
        cy.contains("Redirecionando para o dashboard em 5 segundos...").should("be.visible");
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir os dados corretos do professor cadastrado", () => {
        cy.visit("/professorcadastrado");
        cy.contains("Professor Cadastrado com Sucesso").should("be.visible");
        cy.get("p").contains("Nome:").should("contain", "Professor Teste");
        cy.get("p").contains("Email:").should("contain", "professor@teste.com");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.visit("/professorcadastrado");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir mensagem de erro se os dados do professor não estiverem disponíveis", () => {
        cy.visit("/professorcadastrado");
        cy.intercept('GET', '/professor/123', {
            statusCode: 404,
            body: { message: "Dados do professor não encontrados" }
        }).as('getProfessor');
        cy.wait('@getProfessor');
        cy.contains("Dados do professor não encontrados").should("be.visible");
    });
});