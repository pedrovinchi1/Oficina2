describe("Página Inicial", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("Deve exibir a página de login corretamente", () => {
        cy.contains("Login de Professor").should("be.visible");
        cy.get('#login-email').should("exist");
        cy.get('#login-password').should("exist");
        cy.get('button[type="submit"]').should("exist");
        cy.get('a[href="/cadastroprofessor"]').should("exist");
    });

    it("Deve redirecionar para a página de cadastro de professor ao clicar no link", () => {
        cy.get('a[href="/cadastroprofessor"]').click();
        cy.url().should('include', '/cadastroprofessor');
    });

    it("Deve exibir mensagem de erro ao tentar logar com campos vazios", () => {
        cy.get('button[type="submit"]').click();
        cy.get('#login-email:invalid').should('exist');
        cy.get('#login-password:invalid').should('exist');
    });

    it("Deve exibir mensagem de erro ao tentar logar com email inválido", () => {
        cy.get('#login-email').type("emailinvalido");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.get('#login-email:invalid').should('exist');
    });

    it("Deve exibir mensagem de erro ao tentar logar com senha curta", () => {
        cy.get('#login-email').type("pedrovinchi9982@gmail.com");
        cy.get('#login-password').type("123");
        cy.get('button[type="submit"]').click();
        cy.get('#login-password:invalid').should('exist');
    });

    it("Deve exibir mensagem de erro ao tentar logar com credenciais inválidas", () => {
        cy.get('#login-email').type("usuario@errado.com");
        cy.get('#login-password').type("senhaErrada");
        cy.get('button[type="submit"]').click();
        cy.get('#error-message').should('be.visible').contains("Invalid email or password").should("be.visible");
    });

    it("Deve logar com credenciais válidas e redirecionar para o dashboard", () => {
        cy.get('#login-email').type("pedrovinchi9982@gmail.com");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
    });

    it("Deve manter o usuário logado após recarregar a página", () => {
        cy.get('#login-email').type("pedrovinchi9982@gmail.com");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
        cy.reload();
        cy.url().should('include', '/dashboard');
    });

    it("Deve exibir mensagem de erro ao tentar logar com conta desativada", () => {
        cy.get('#login-email').type("conta@desativada.com");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.get('#error-message').should('be.visible').contains("Conta desativada").should("be.visible");
    });
});