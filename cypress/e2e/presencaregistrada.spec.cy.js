describe("Presença Registrada", () => {
    it("Deve exibir a mensagem de sucesso e redirecionar para o dashboard", () => {
        cy.visit("/presencaregistrada");
        cy.contains("Presença Registrada").should("be.visible");
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir os dados corretos da presença registrada", () => {
        cy.visit("/presencaregistrada");
        cy.contains("Presença Registrada").should("be.visible");
        cy.get("p").contains("Nome do Aluno:").should("contain", "Aluno Teste");
        cy.get("p").contains("Oficina:").should("contain", "Oficina Teste");
        cy.get("p").contains("Data:").should("contain", "01/01/2025");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.visit("/presencaregistrada");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir mensagem de erro se os dados da presença não estiverem disponíveis", () => {
        cy.visit("/presencaregistrada");
        cy.intercept('GET', '/presenca/123', {
            statusCode: 404,
            body: { message: "Dados da presença não encontrados" }
        }).as('getPresenca');
        cy.wait('@getPresenca');
        cy.contains("Dados da presença não encontrados").should("be.visible");
    });
});