describe("Professor Atualizado", () => {
    it("Deve exibir a mensagem de sucesso e os dados atualizados do professor", () => {
        cy.visit("/professoratualizado");
        cy.contains("Professor Atualizado com Sucesso!").should("be.visible");
        cy.get("p").should("contain", "Nome:");
        cy.get("p").should("contain", "Email:");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir os dados corretos do professor atualizado", () => {
        cy.visit("/professoratualizado");
        cy.contains("Professor Atualizado com Sucesso!").should("be.visible");
        cy.get("p").contains("Nome:").should("contain", "Professor Teste");
        cy.get("p").contains("Email:").should("contain", "professor@teste.com");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.visit("/professoratualizado");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir mensagem de erro se os dados do professor não estiverem disponíveis", () => {
        cy.visit("/professoratualizado");
        cy.intercept('GET', '/professor/123', {
            statusCode: 404,
            body: { message: "Dados do professor não encontrados" }
        }).as('getProfessor');
        cy.wait('@getProfessor');
        cy.contains("Dados do professor não encontrados").should("be.visible");
    });
});