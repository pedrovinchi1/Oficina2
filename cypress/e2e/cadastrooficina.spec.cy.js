Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes("reading 'addEventListener'")) {
      return false;
    }
});
  
describe("Teste de Cadastro e Alteração de Oficina", () => {
    beforeEach(() => {
      localStorage.setItem('token', 'dummy-token');
      cy.visit("/cadastrooficina");
    });
  
    it("Deve exibir o formulário de cadastro de oficina corretamente", () => {
      cy.get("#create-oficina h2").should("contain.text", "Cadastro de Oficina");
      cy.get("#titulo").should("be.visible");
      cy.get("#descricao").should("be.visible");
      cy.get("#create-oficina button[type='submit']").should("be.visible");
    });
  
    it("Deve exibir o formulário de alteração de oficina corretamente", () => {
      cy.get("#update-oficina h1").should("contain.text", "Alteração de Oficinas");
      cy.get("#oficinaSelect").should("be.visible");
      cy.get("#update-titulo").should("be.visible");
      cy.get("#update-descricao").should("be.visible");
      cy.get("#update-oficina button").should("be.visible");
    });

    it("Deve cadastrar uma nova oficina", () => {
        const tituloOficina = "Oficina de Teste Cypress";
        const descricaoOficina = "Descrição da oficina de teste criada via Cypress";
 
        cy.get("#titulo").type(tituloOficina);
        cy.get("#descricao").type(descricaoOficina);
        cy.intercept('POST', '/create-oficina').as('createOficina');
        cy.get("#create-oficina button[type='submit']").click();
        cy.wait('@createOficina').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
        });
       cy.url().should('include', '/oficinacadastrada');
        });

    it("Deve carregar as oficinas no select", () => {
        cy.wait(1000); 
        cy.get("#oficinaSelect option").should("have.length.greaterThan", 1); 
    });
    
    it("Deve preencher e salvar as alterações de uma oficina", () => {
        cy.wait(1000);

        cy.get("#oficinaSelect").select("Oficina de Teste Cypress");
        cy.wait(500);
        cy.get("#update-titulo").clear().type("Novo Título da Oficina");
        cy.get("#update-descricao").clear().type("Nova Descrição da Oficina");
        cy.intercept('POST', '/update-oficina').as('updateOficina');
        cy.get("#update-oficina button").click();
        cy.wait('@updateOficina').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
        });
        cy.on('window:alert', (str) => {
          expect(str).to.equal('Oficina atualizada com sucesso!');
        });
    });

    it("Deve exibir erro ao tentar cadastrar oficina com título vazio", () => {
        cy.get("#descricao").type("Descrição da oficina sem título");
        cy.get("#create-oficina button[type='submit']").click();
        cy.contains("Preencha todos os campos").should("be.visible");
    });

    it("Deve exibir erro ao tentar cadastrar oficina com descrição vazia", () => {
        cy.get("#titulo").type("Oficina sem descrição");
        cy.get("#create-oficina button[type='submit']").click();
        cy.contains("Preencha todos os campos").should("be.visible");
    });

    it("Deve exibir erro ao tentar alterar oficina sem selecionar uma oficina", () => {
        cy.get("#update-titulo").clear().type("Novo Título");
        cy.get("#update-descricao").clear().type("Nova Descrição");
        cy.get("#update-oficina button").click();
        cy.contains("Selecione uma oficina para alterar").should("be.visible");
    });

    it("Deve exibir erro ao tentar alterar oficina com título vazio", () => {
        cy.get("#oficinaSelect").select("Oficina de Teste Cypress");
        cy.wait(500);
        cy.get("#update-titulo").clear();
        cy.get("#update-descricao").clear().type("Nova Descrição");
        cy.get("#update-oficina button").click();
        cy.contains("Preencha todos os campos").should("be.visible");
    });

    it("Deve exibir erro ao tentar alterar oficina com descrição vazia", () => {
        cy.get("#oficinaSelect").select("Oficina de Teste Cypress");
        cy.wait(500);
        cy.get("#update-titulo").clear().type("Novo Título");
        cy.get("#update-descricao").clear();
        cy.get("#update-oficina button").click();
        cy.contains("Preencha todos os campos").should("be.visible");
    });
});