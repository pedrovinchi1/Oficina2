
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("reading 'addEventListener'")) {
    return false;
  }
});

describe('Dashboard Page', () => {
    beforeEach(() => {
        localStorage.setItem('token', 'dummy-token');
        cy.visit('/dashboard');
    });

    it('Deve exibir o título correto', () => {
        cy.get('header h1').should('contain', 'Sistema de Emissão de Certificados');
        cy.get('header h2').should('contain', 'Bem Vindo ao Seu Dashboard');
    });

    it('Deve conter todos os links de navegação', () => {
        cy.get('nav.menu ul li a').should('have.length', 7);
        cy.get('nav.menu ul li a').eq(0).should('have.attr', 'href', '/cadastrooficina');
        cy.get('nav.menu ul li a').eq(1).should('have.attr', 'href', '/cadastroaluno');
        cy.get('nav.menu ul li a').eq(2).should('have.attr', 'href', '/atualizaaluno');
        cy.get('nav.menu ul li a').eq(3).should('have.attr', 'href', '/atuaizaprof');
        cy.get('nav.menu ul li a').eq(4).should('have.attr', 'href', '/presenca');
        cy.get('nav.menu ul li a').eq(5).should('have.attr', 'href', '/gerarcertificados');
        cy.get('nav.menu ul li a').eq(6).should('have.attr', 'href', '/');
    });


    it('Deve redirecionar para a página correta ao clicar nos links de navegação', () => {
        cy.get('nav.menu ul li a').eq(0).click();
        cy.url().should('include', '/cadastrooficina');

        cy.visit('/dashboard');
        cy.get('nav.menu ul li a').eq(1).click();
        cy.url().should('include', '/cadastroaluno');

        cy.visit('/dashboard');
        cy.get('nav.menu ul li a').eq(2).click();
        cy.url().should('include', '/atualizaaluno');

        cy.visit('/dashboard');
        cy.get('nav.menu ul li a').eq(3).click();
        cy.url().should('include', '/atuaizaprof');

        cy.visit('/dashboard');
        cy.get('nav.menu ul li a').eq(4).click();
        cy.url().should('include', '/presenca');

        cy.visit('/dashboard');
        cy.get('nav.menu ul li a').eq(5).click();
        cy.url().should('include', '/gerarcertificados');

        cy.visit('/dashboard');
        cy.get('nav.menu ul li a').eq(6).click();
        cy.url().should('include', '/');
    });
});