
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("reading 'addEventListener'")) {
    return false;
  }
});

describe("Cadastro de Professor", () => {

  it("Deve exibir o formulário de cadastro corretamente", () => {
    cy.visit("/cadastroprofessor");
    cy.contains("Cadastro de Professor").should("be.visible");
    cy.get('#nome').should("exist");
    cy.get('#email').should("exist");
    cy.get('#senha').should("exist");
    cy.get('button[type="submit"]').should("exist");
  });

  it("Deve cadastrar um novo professor com sucesso", () => {
    cy.visit("/cadastroprofessor");
    cy.get('#nome').type("Professor Teste");
    cy.get('#email').type("professor@teste.com");
    cy.get('#senha').type("senhaSegura");
    cy.get('button[type="submit"]').click();
    
  });

  it("Deve exibir mensagem de erro ao tentar cadastrar sem preencher os dados", () => {
    cy.visit("/cadastroprofessor");
    cy.get('button[type="submit"]').click();
    cy.get('#nome:invalid').should('exist');
    cy.get('#email:invalid').should('exist');
    cy.get('#senha:invalid').should('exist');
});

it("Deve exibir mensagem de erro caso o email seja inválido", () => {
  cy.visit("/cadastroprofessor");
  cy.get('#nome').type("Professor Inválido");
  cy.get('#email').type("emailinvalido");
  cy.get('#senha').type("senhaSegura");
  cy.get('button[type="submit"]').click();
  cy.get('#email:invalid').should('exist');
  cy.get('#email:invalid').then(($el) => {
      expect($el[0].validationMessage).to.eq('Email inválido');
  });
});

});