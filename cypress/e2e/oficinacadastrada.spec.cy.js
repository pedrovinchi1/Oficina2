describe("Oficina Cadastrada", () => {
    it("Deve exibir a mensagem de sucesso e redirecionar para o dashboard", () => {
        cy.visit("/oficinacadastrada");
        cy.contains("Oficina Cadastrada com Sucesso").should("be.visible");
        cy.contains("Redirecionando para o dashboard em 5 segundos...").should("be.visible");
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir os dados corretos da oficina cadastrada", () => {
        cy.visit("/oficinacadastrada");
        cy.contains("Oficina Cadastrada com Sucesso").should("be.visible");
        cy.get("p").contains("Título:").should("contain", "Oficina Teste");
        cy.get("p").contains("Descrição:").should("contain", "Descrição da Oficina Teste");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.visit("/oficinacadastrada");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir mensagem de erro se os dados da oficina não estiverem disponíveis", () => {
        cy.visit("/oficinacadastrada");
        cy.intercept('GET', '/oficina/123', {
            statusCode: 404,
            body: { message: "Dados da oficina não encontrados" }
        }).as('getOficina');
        cy.wait('@getOficina');
        cy.contains("Dados da oficina não encontrados").should("be.visible");
    });
});