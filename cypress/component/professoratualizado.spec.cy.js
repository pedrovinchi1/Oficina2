describe("Professor Atualizado Component", () => {
    it("Deve renderizar a mensagem de sucesso e os dados atualizados do professor", () => {
        cy.mount(<ProfessorAtualizado />);
        cy.contains("Professor Atualizado com Sucesso!").should("be.visible");
        cy.get("p").should("contain", "Nome:");
        cy.get("p").should("contain", "Email:");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar os dados corretos do professor atualizado", () => {
        cy.mount(<ProfessorAtualizado />);
        cy.contains("Professor Atualizado com Sucesso!").should("be.visible");
        cy.get("p").contains("Nome:").should("contain", "Professor Teste");
        cy.get("p").contains("Email:").should("contain", "professor@teste.com");
    });

    it("Deve redirecionar para o dashboard imediatamente ao clicar no link", () => {
        cy.mount(<ProfessorAtualizado />);
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve renderizar mensagem de erro se os dados do professor não estiverem disponíveis", () => {
        cy.mount(<ProfessorAtualizado error="Dados do professor não encontrados" />);
        cy.contains("Dados do professor não encontrados").should("be.visible");
    });
});