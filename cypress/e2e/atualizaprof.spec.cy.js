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

    it("Deve buscar dados do professor ao clicar no botão 'Buscar'", () => {
      cy.intercept('GET', '/professor/123456', { fixture: 'professor.json' }).as('getProfessor');
      
      cy.get("#professor_email").type("professor@teste.com");
      cy.get("button").contains("Buscar").click();
      cy.wait('@getProfessor').its('response.statusCode').should('eq', 200);
      
      cy.get("#update-nome").should('have.value', 'Professor Teste');
      cy.get("#update-email").should('have.value', 'professor@teste.com');
    });

    it("Deve exibir mensagem de erro ao tentar buscar professor inexistente", () => {
      cy.intercept('GET', '/professor/999999', { statusCode: 404 }).as('getProfessorInexistente');
      
      cy.get("#professor_email").type("inexistente@teste.com");
      cy.get("button").contains("Buscar").click();
      cy.wait('@getProfessorInexistente').its('response.statusCode').should('eq', 404);
      
      cy.get('.error-message').should('contain', 'Professor não encontrado');
    });

    it("Deve exibir mensagem de sucesso ao atualizar dados do professor", () => {
      cy.intercept('GET', '/professor/123456', { fixture: 'professor.json' }).as('getProfessor');
      cy.intercept('POST', '/professor/123456', { statusCode: 200 }).as('updateProfessor');
      
      cy.get("#professor_email").type("professor@teste.com");
      cy.get("button").contains("Buscar").click();
      cy.wait('@getProfessor').its('response.statusCode').should('eq', 200);
      
      cy.get("#update-nome").clear().type("Novo Nome");
      cy.get("#update-email").clear().type("novoemail@teste.com");
      cy.get("#update-senha").clear().type("654321");
      cy.get("button[type='submit']").click();
      cy.wait('@updateProfessor').its('response.statusCode').should('eq', 200);
      
      cy.get('.success-message').should('contain', 'Dados atualizados com sucesso');
    });

    it("Deve exibir mensagem de erro ao tentar atualizar com dados inválidos", () => {
      cy.intercept('GET', '/professor/123456', { fixture: 'professor.json' }).as('getProfessor');
      cy.intercept('POST', '/professor/123456', { statusCode: 400 }).as('updateProfessorInvalido');
      
      cy.get("#professor_email").type("professor@teste.com");
      cy.get("button").contains("Buscar").click();
      cy.wait('@getProfessor').its('response.statusCode').should('eq', 200);
      
      cy.get("#update-email").clear().type("emailinvalido");
      cy.get("button[type='submit']").click();
      cy.wait('@updateProfessorInvalido').its('response.statusCode').should('eq', 400);
      
      cy.get('.error-message').should('contain', 'Dados inválidos');
    });
});