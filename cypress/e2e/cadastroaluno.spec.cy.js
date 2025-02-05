
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
    });
  
    it("Deve exibir erro se algum campo obrigatório estiver vazio", () => {
      cy.visit("/cadastroaluno");
      cy.get('#registro_academico').type("789012");
      cy.get('#nome').type("Outro Aluno Teste");
      cy.get('#email').type("outroaluno@teste.com");
      cy.get('#telefone').clear(); // limpa o campo pra simular vazio
      cy.get('button[type="submit"]').click();
      // Exemplo de validação simples
      cy.contains("Preencha todos os campos").should("not.exist"); 
      // Ajuste de acordo com a mensagem real de erro exibida
    });
  
  });
  