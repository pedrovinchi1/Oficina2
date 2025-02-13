describe('Atualização de Aluno', () => {
    beforeEach(() => {
        localStorage.setItem('token', 'dummy-token');
        cy.visit('/atualizaaluno');
    });

    it('Deve exibir o formulário de atualização de aluno', () => {
        cy.get('form').should('exist');
        cy.get('input#update-nome').should('exist');
        cy.get('input#update-email').should('exist');
        cy.get('input#update-telefone').should('exist');
        cy.get('button[type="submit"]').should('exist');
    });

    it('Deve buscar dados do aluno ao clicar no botão "Buscar" e Atualizá-los', () => {
        cy.intercept('GET', '/aluno/123456', { fixture: 'aluno.json' }).as('getAluno');
    
        cy.get('input#update-registro_academico').type('123456');
        cy.get('button[onclick="buscarDadosAluno()"]').click();
        cy.wait('@getAluno').its('response.statusCode').should('eq', 200);
 
        cy.get('input#update-nome').should('have.value', 'Aluno Teste2');
        cy.get('input#update-email').should('have.value', 'aluno@teste.com');
        cy.get('input#update-telefone').should('have.value', '1234567890');
        cy.get('button[type="submit"]').click();
    });

    it('Deve redirecionar para o dashboard ao clicar no botão "Voltar"', () => {
        cy.get('nav.menu ul li a').contains('Voltar').click();
        cy.url().should('include', '/dashboard');
    });

    it('Deve exibir mensagem de erro ao tentar buscar aluno inexistente', () => {
        cy.intercept('GET', '/aluno/999999', { statusCode: 404 }).as('getAlunoInexistente');
    
        cy.get('input#update-registro_academico').type('999999');
        cy.get('button[onclick="buscarDadosAluno()"]').click();
        cy.wait('@getAlunoInexistente').its('response.statusCode').should('eq', 404);
 
        cy.get('.error-message').should('contain', 'Aluno não encontrado');
    });

    it('Deve exibir mensagem de sucesso ao atualizar dados do aluno', () => {
        cy.intercept('GET', '/aluno/123456', { fixture: 'aluno.json' }).as('getAluno');
        cy.intercept('POST', '/aluno/123456', { statusCode: 200 }).as('updateAluno');
    
        cy.get('input#update-registro_academico').type('123456');
        cy.get('button[onclick="buscarDadosAluno()"]').click();
        cy.wait('@getAluno').its('response.statusCode').should('eq', 200);
 
        cy.get('input#update-nome').clear().type('Novo Nome');
        cy.get('input#update-email').clear().type('novoemail@teste.com');
        cy.get('input#update-telefone').clear().type('0987654321');
        cy.get('button[type="submit"]').click();
        cy.wait('@updateAluno').its('response.statusCode').should('eq', 200);
 
        cy.get('.success-message').should('contain', 'Dados atualizados com sucesso');
    });

    it('Deve exibir mensagem de erro ao tentar atualizar com dados inválidos', () => {
        cy.intercept('GET', '/aluno/123456', { fixture: 'aluno.json' }).as('getAluno');
        cy.intercept('POST', '/aluno/123456', { statusCode: 400 }).as('updateAlunoInvalido');
    
        cy.get('input#update-registro_academico').type('123456');
        cy.get('button[onclick="buscarDadosAluno()"]').click();
        cy.wait('@getAluno').its('response.statusCode').should('eq', 200);
 
        cy.get('input#update-email').clear().type('emailinvalido');
        cy.get('button[type="submit"]').click();
        cy.wait('@updateAlunoInvalido').its('response.statusCode').should('eq', 400);
 
        cy.get('.error-message').should('contain', 'Dados inválidos');
    });
});