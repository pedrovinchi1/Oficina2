
describe("Teste de Login", () => {
    it("Deve exibir a página de login e logar com credenciais válidas", () => {
      cy.visit("/");
      cy.get('#login-email').type("login@example.com");
      cy.get('#login-password').type("loginpassword");
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  
    it("Deve exibir erro ao tentar logar com credenciais inválidas", () => {
      cy.visit("/");
      cy.get('#login-email').type("usuario@errado.com");
      cy.get('#login-password').type("senhaErrada");
      cy.get('button[type="submit"]').click();
      cy.contains("Credenciais inválidas").should("be.visible");
    });
  
    it("Deve exibir erro se os campos estiverem vazios", () => {
      cy.visit("/");
      cy.get('button[type="submit"]').click();
      cy.contains("Preencha todos os campos").should("be.visible");
    });
  });