describe("Oficina Cadastrada Component", () => {
    it("Deve renderizar a mensagem de sucesso e redirecionar para o dashboard", () => {
        cy.mount(<OficinaCadastrada />);
        cy.contains("Oficina Cadastrada com Sucesso").should("be.visible");
        cy.contains("Redirecionando para o dashboard em 5 segundos...").should("be.visible");
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar os dados corretos da oficina cadastrada", () => {
        cy.mount(<OficinaCadastrada />);
        cy.contains("Oficina Cadastrada com Sucesso").should("be.visible");
        cy.get("p").contains("Título:").should("contain", "Oficina Teste");
        cy.get("p").contains("Descrição:").should("contain", "Descrição da Oficina Teste");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.mount(<OficinaCadastrada />);
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar mensagem de erro se os dados da oficina não estiverem disponíveis", () => {
        cy.mount(<OficinaCadastrada error="Dados da oficina não encontrados" />);
        cy.contains("Dados da oficina não encontrados").should("be.visible");
    });
});