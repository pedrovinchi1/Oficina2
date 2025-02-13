describe("Cadastro de Aluno", () => {
  
    it("Deve exibir o formulário de cadastro de aluno", () => {
      cy.visit("/cadastroaluno");
      cy.contains("Cadastro de Aluno").should("be.visible");
      cy.get('#registro_academico').should("exist");
      cy.get('#nome').should("exist");
      cy.get('#email').should("exist");
      cy.get('#telefone').should("exist");
      cy.get('button[type="submit"]').should("exist");
    });
  
    it("Deve cadastrar um novo aluno com sucesso", () => {
      cy.visit("/cadastroaluno");
      cy.get('#registro_academico').clear().type("123456");
      cy.get('#nome').clear().type("Aluno de Teste");
      cy.get('#email').clear().type("aluno@teste.com");
      cy.get('#telefone').clear().type("999999999");
      cy.get('button[type="submit"]').click();
      cy.contains("Aluno cadastrado com sucesso").should("be.visible");
    });
  
    it("Deve exibir erro se algum campo obrigatório estiver vazio", () => {
      cy.visit("/cadastroaluno");
      cy.get('#registro_academico').type("789012");
      cy.get('#nome').type("Outro Aluno Teste");
      cy.get('#email').type("outroaluno@teste.com");
      cy.get('#telefone').clear(); 
      cy.get('button[type="submit"]').click();
      cy.contains("Preencha todos os campos").should("be.visible"); 
    });

    it("Deve exibir erro ao tentar cadastrar com email inválido", () => {
      cy.visit("/cadastroaluno");
      cy.get('#registro_academico').clear().type("123456");
      cy.get('#nome').clear().type("Aluno de Teste");
      cy.get('#email').clear().type("emailinvalido");
      cy.get('#telefone').clear().type("999999999");
      cy.get('button[type="submit"]').click();
      cy.contains("Email inválido").should("be.visible");
    });

    it("Deve exibir erro ao tentar cadastrar com registro acadêmico duplicado", () => {
      cy.visit("/cadastroaluno");
      cy.get('#registro_academico').clear().type("123456"); 
      cy.get('#nome').clear().type("Aluno de Teste");
      cy.get('#email').clear().type("aluno@teste.com");
      cy.get('#telefone').clear().type("999999999");
      cy.get('button[type="submit"]').click();
      cy.contains("Registro acadêmico já cadastrado").should("be.visible");
    });

    it("Deve limpar o formulário ao clicar no botão 'Limpar'", () => {
      cy.visit("/cadastroaluno");
      cy.get('#registro_academico').type("123456");
      cy.get('#nome').type("Aluno de Teste");
      cy.get('#email').type("aluno@teste.com");
      cy.get('#telefone').type("999999999");
      cy.get('button[type="reset"]').click();
      cy.get('#registro_academico').should("have.value", "");
      cy.get('#nome').should("have.value", "");
      cy.get('#email').should("have.value", "");
      cy.get('#telefone').should("have.value", "");
    });
});
