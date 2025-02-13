describe("Professor Cadastrado Component", () => {
    it("Deve renderizar a mensagem de sucesso e redirecionar para o dashboard", () => {
        cy.mount(<ProfessorCadastrado />);
        cy.contains("Professor Cadastrado com Sucesso").should("be.visible");
        cy.contains("Redirecionando para o dashboard em 5 segundos...").should("be.visible");
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar os dados corretos do professor cadastrado", () => {
        cy.mount(<ProfessorCadastrado />);
        cy.contains("Professor Cadastrado com Sucesso").should("be.visible");
        cy.get("p").contains("Nome:").should("contain", "Professor Teste");
        cy.get("p").contains("Email:").should("contain", "professor@teste.com");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.mount(<ProfessorCadastrado />);
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar mensagem de erro se os dados do professor não estiverem disponíveis", () => {
        cy.mount(<ProfessorCadastrado error="Dados do professor não encontrados" />);
        cy.contains("Dados do professor não encontrados").should("be.visible");
    });
});