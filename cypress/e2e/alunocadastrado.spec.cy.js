describe("Aluno Cadastrado", () => {
    it("Deve exibir a mensagem de sucesso e os dados do aluno cadastrado", () => {
        cy.visit("/alunocadastrado");
        cy.contains("Aluno Cadastrado com Sucesso").should("be.visible");
        cy.get("p").should("contain", "Registro Acadêmico:");
        cy.get("p").should("contain", "Nome:");
        cy.get("p").should("contain", "Email:");
        cy.get("p").should("contain", "Telefone:");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir os dados corretos do aluno cadastrado", () => {
        cy.visit("/alunocadastrado");
        cy.contains("Aluno Cadastrado com Sucesso").should("be.visible");
        cy.get("p").contains("Registro Acadêmico:").should("contain", "123456");
        cy.get("p").contains("Nome:").should("contain", "Aluno Teste");
        cy.get("p").contains("Email:").should("contain", "aluno@teste.com");
        cy.get("p").contains("Telefone:").should("contain", "999999999");
    });

    it("Deve redirecionar para o dashboard ao clicar no link", () => {
        cy.visit("/alunocadastrado");
        cy.get('a[href="/dashboard"]').click();
        cy.url().should("include", "/dashboard");
    });

    it("Deve exibir mensagem de erro se os dados do aluno não estiverem disponíveis", () => {
        cy.visit("/alunocadastrado");
        cy.intercept('GET', '/aluno/123456', {
            statusCode: 404,
            body: { message: "Dados do aluno não encontrados" }
        }).as('getAluno');
        cy.wait('@getAluno');
        cy.contains("Dados do aluno não encontrados").should("be.visible");
    });
});