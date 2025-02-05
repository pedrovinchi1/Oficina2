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
        cy.visit('/atualizaaluno');
        cy.intercept('GET', '/aluno/123456', { fixture: 'aluno.json' }).as('getAluno');
    
        cy.get('input#update-registro_academico').type('123456');
        cy.get('button[onclick="buscarDadosAluno()"]').click();
        cy.wait('@getAluno').its('response.statusCode').should('eq', 200);
 
        cy.get('input#update-nome').should('have.value', 'Aluno Teste2');
        cy.get('input#update-email').should('have.value', 'alun2o@teste.com');
        cy.get('input#update-telefone').should('have.value', '1234567890s');
        cy.get('button[type="submit"]').click();
    });



    it('Deve redirecionar para o dashboard ao clicar no link "Voltar"', () => {
        cy.get('nav.menu ul li a').click();
        cy.url().should('include', '/dashboard');
    });
});