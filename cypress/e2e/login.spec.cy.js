
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("reading 'addEventListener'")) {
    return false;
  }
});


describe("Teste de Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Deve exibir a página de login e logar com credenciais válidas", () => {
    cy.contains("Login de Professor").should("be.visible");
    cy.get('#login-email').type("pedrovinchi9982@gmail.com");
    cy.get('#login-password').type("123456");
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it("Deve exibir erro ao tentar logar com credenciais inválidas", () => {
    cy.get('#login-email').type("usuario@errado.com");
    cy.get('#login-password').type("senhaErrada");
    cy.get('button[type="submit"]').click();
    cy.get('#error-message').should('be.visible').contains("Invalid email or password").should("be.visible")
  });


  it("Deve exibir erro se os campos estiverem vazios", () => {
    cy.get('button[type="submit"]').click();
    cy.get('#login-email:invalid').should('exist');
    cy.get('#login-password:invalid').should('exist');
});

  // Novo teste para verificar redirecionamento do link de cadastro
  it("Deve redirecionar para a página de cadastro de professor", () => {
    cy.get('a[href="/cadastroprofessor"]').click();
    cy.url().should('include', '/cadastroprofessor');
  });
});