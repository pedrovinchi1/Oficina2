describe("Teste de Atualização de Professor", () => {
    beforeEach(() => {
      cy.visit("/atuaizaprof");
    });
  
    it("Deve exibir o formulário e seus campos corretamente", () => {
      cy.get("h2").should("contain.text", "Alteração de Cadastro de Professor");
      cy.get("#professor_email").should("be.visible");
      cy.get("button").contains("Buscar").should("be.visible");
      cy.get("#update-nome").should("be.visible");
      cy.get("#update-email").should("be.visible");
      cy.get("#update-senha").should("be.visible");
      cy.get("button[type='submit']").should("be.visible");
    });
  
    it("Deve alertar ao tentar enviar sem buscar os dados do professor", () => {
      cy.get("#update-nome").type("Novo Professor");
      cy.get("#update-email").type("professor@teste.com");
      cy.get("#update-senha").type("123456");
      cy.get("button[type='submit']").click();
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Por favor, busque um professor primeiro");
      });
    });
  });