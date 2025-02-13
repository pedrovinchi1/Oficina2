describe("Presença Registrada Component", () => {
    it("Deve renderizar a mensagem de sucesso e redirecionar para o dashboard", () => {
        cy.mount(<PresencaRegistrada />);
        cy.contains("Presença Registrada").should("be.visible");
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar os dados corretos da presença registrada", () => {
        cy.mount(<PresencaRegistrada />);
        cy.contains("Presença Registrada").should("be.visible");
        cy.get("p").contains("Nome do Aluno:").should("contain", "Aluno Teste");
        cy.get("p").contains("Oficina:").should("contain", "Oficina Teste");
        cy.get("p").contains("Data:").should("contain", "01/01/2025");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.mount(<PresencaRegistrada />);
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar mensagem de erro se os dados da presença não estiverem disponíveis", () => {
        cy.mount(<PresencaRegistrada error="Dados da presença não encontrados" />);
        cy.contains("Dados da presença não encontrados").should("be.visible");
    });
});