describe("Teste de Geração de Certificados", () => {
    beforeEach(() => {
      cy.visit("/gerarcertificados");
    });
  
    it("Deve exibir o formulário de consulta de presenças", () => {
      cy.get("h2").should("contain", "Consultar Presenças");
      cy.get("#registro_academico").should("be.visible");
      cy.get("button[type='submit']").should("contain", "Consultar");
    });
  
    it("Deve exibir mensagem de erro se o registro acadêmico não for encontrado", () => {
      cy.intercept('POST', '/consultar-presencas', (req) => {
        req.reply({
          statusCode: 200,
          body: '<section><p>Aluno não encontrado.</p></section>'
        });
      }).as('consultarPresencas');
  
      cy.get("#registro_academico").type("0000");
      cy.get("button[type='submit']").click();
      cy.wait('@consultarPresencas');
      cy.contains("Aluno não encontrado.").should("be.visible");
    });
  
    it("Deve exibir as presenças do aluno e o formulário de geração de certificado se o registro acadêmico for encontrado", () => {

      cy.intercept('POST', '/consultar-presencas', (req) => {
        req.reply({
          statusCode: 200,
          body: `
            <section>
              <h2>Presenças de Teste</h2>
              <form action="/gerar-certificado" method="post">
                <input type="hidden" name="registro_academico" value="12345">
                <label for="oficina_id">Selecione a Oficina:</label>
                <select id="oficina_id" name="oficina_id" required>
                  <option value="1">Oficina Teste 1</option>
                  <option value="2">Oficina Teste 2</option>
                </select>
                <button type="submit">Gerar Certificado</button>
              </form>
            </section>
          ` 
        });
      }).as('consultarPresencas');
  
      cy.get("#registro_academico").type("12345");
      cy.get("button[type='submit']").click();
  

      cy.wait('@consultarPresencas');
  
      cy.contains("Presenças de Teste").should("be.visible");
      cy.get("#oficina_id").should("be.visible");
      cy.get("button[type='submit']").should("contain", "Gerar Certificado");
    });

    it("Deve exibir mensagem de erro ao tentar gerar certificado sem selecionar uma oficina", () => {
      cy.intercept('POST', '/consultar-presencas', (req) => {
        req.reply({
          statusCode: 200,
          body: `
            <section>
              <h2>Presenças de Teste</h2>
              <form action="/gerar-certificado" method="post">
                <input type="hidden" name="registro_academico" value="12345">
                <label for="oficina_id">Selecione a Oficina:</label>
                <select id="oficina_id" name="oficina_id" required>
                  <option value="">Selecione uma oficina</option>
                  <option value="1">Oficina Teste 1</option>
                  <option value="2">Oficina Teste 2</option>
                </select>
                <button type="submit">Gerar Certificado</button>
              </form>
            </section>
          ` 
        });
      }).as('consultarPresencas');
  
      cy.get("#registro_academico").type("12345");
      cy.get("button[type='submit']").click();
      cy.wait('@consultarPresencas');
  
      cy.get("button[type='submit']").click();
      cy.contains("Selecione uma oficina").should("be.visible");
    });

    it("Deve gerar certificado com sucesso ao selecionar uma oficina", () => {
      cy.intercept('POST', '/consultar-presencas', (req) => {
        req.reply({
          statusCode: 200,
          body: `
            <section>
              <h2>Presenças de Teste</h2>
              <form action="/gerar-certificado" method="post">
                <input type="hidden" name="registro_academico" value="12345">
                <label for="oficina_id">Selecione a Oficina:</label>
                <select id="oficina_id" name="oficina_id" required>
                  <option value="1">Oficina Teste 1</option>
                  <option value="2">Oficina Teste 2</option>
                </select>
                <button type="submit">Gerar Certificado</button>
              </form>
            </section>
          ` 
        });
      }).as('consultarPresencas');
  
      cy.get("#registro_academico").type("12345");
      cy.get("button[type='submit']").click();
  
      
      cy.wait('@consultarPresencas');
  
      cy.get("#oficina_id").select("1");
      cy.intercept('POST', '/gerar-certificado').as('gerarCertificado');
      cy.get("button[type='submit']").click();
      cy.wait('@gerarCertificado').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
      cy.contains("Certificado gerado com sucesso").should("be.visible");
    });

    it("Deve exibir mensagem de erro ao tentar gerar certificado com dados inválidos", () => {
      cy.intercept('POST', '/consultar-presencas', (req) => {
        req.reply({
          statusCode: 200,
          body: `
            <section>
              <h2>Presenças de Teste</h2>
              <form action="/gerar-certificado" method="post">
                <input type="hidden" name="registro_academico" value="12345">
                <label for="oficina_id">Selecione a Oficina:</label>
                <select id="oficina_id" name="oficina_id" required>
                  <option value="1">Oficina Teste 1</option>
                  <option value="2">Oficina Teste 2</option>
                </select>
                <button type="submit">Gerar Certificado</button>
              </form>
            </section>
          ` 
        });
      }).as('consultarPresencas');
  
      cy.get("#registro_academico").type("12345");
      cy.get("button[type='submit']").click();
      cy.wait('@consultarPresencas');
      cy.get("#oficina_id").select("1");
      cy.intercept('POST', '/gerar-certificado', { statusCode: 400 }).as('gerarCertificadoInvalido');
      cy.get("button[type='submit']").click();
      cy.wait('@gerarCertificadoInvalido').then((interception) => {
        expect(interception.response.statusCode).to.eq(400);
      });
      cy.contains("Erro ao gerar certificado").should("be.visible");
    });
});