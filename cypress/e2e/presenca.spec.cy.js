Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes("reading 'addEventListener'")) {
      return false;
    }
  });
  

describe("Teste de Registro de Presença", () => {
    beforeEach(() => {
      cy.visit("/presenca");
    });
  
    it("Deve exibir o formulário de registro de presença corretamente", () => {
      cy.get("#presenca h2").should("contain.text", "Registro de Presença");
      cy.get("#registro-academico").should("be.visible");
      cy.get("#oficina-id").should("be.visible");
      cy.get("#presenca-form button[type='submit']").should("be.visible");
    });
  
    it("Deve registrar a presença de um aluno em uma oficina", () => {
      const registroAcademico = "123456";
      const oficinaId = "29";
  
      // Preenche o formulário
      cy.get("#registro-academico").type(registroAcademico);
      cy.get("#oficina-id").select(oficinaId);
      cy.get('button[type="submit"]').click();
  
      // Intercepta a requisição POST para '/presencas/'
      cy.intercept('POST', '/presencas/').as('registrarPresenca');
  
      // Submete o formulário
      cy.get("#presenca-form button[type='submit']").click();
  
      // Aguarda a requisição ser completada
      cy.wait('@registrarPresenca').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
  
      // Verifica se foi redirecionado para a página de sucesso (ou exibe um alerta, dependendo da sua aplicação)
      // Adapte a verificação de acordo com o comportamento da sua aplicação após o registro
      cy.url().should('include', '/dashboard'); // Exemplo: redirecionamento para o dashboard
    });
  
    it("Deve exibir uma mensagem de erro se o registro acadêmico for inválido", () => {
      const registroAcademico = "invalid-ra";
      const oficinaId = "1";
  
      cy.get("#registro-academico").type(registroAcademico);
      cy.get("#oficina-id").select(oficinaId);
  
      // Intercepta a requisição POST para '/presencas/'
      cy.intercept('POST', '/presencas/', (req) => {
        req.reply({
          statusCode: 400,
          body: { message: "Registro Acadêmico inválido" }
        });
      }).as('registrarPresenca');
  
      cy.get("#presenca-form button[type='submit']").click();
  
      cy.wait('@registrarPresenca');
  
      // Verifica se a mensagem de erro é exibida
      cy.contains("Registro Acadêmico inválido").should("be.visible");
    });
  });