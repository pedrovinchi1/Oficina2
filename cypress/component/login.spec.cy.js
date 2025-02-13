describe("Login Component", () => {
    it("Deve renderizar o formulário de login corretamente", () => {
        cy.mount(<Login />);
        cy.get('h2').should('contain', 'Login de Professor');
        cy.get('#login-email').should('be.visible');
        cy.get('#login-password').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Entrar');
    });

    it("Deve exibir mensagem de erro ao tentar logar com campos vazios", () => {
        cy.mount(<Login />);
        cy.get('button[type="submit"]').click();
        cy.get('#login-email:invalid').should('exist');
        cy.get('#login-password:invalid').should('exist');
    });

    it("Deve exibir mensagem de erro ao tentar logar com email inválido", () => {
        cy.mount(<Login />);
        cy.get('#login-email').type("emailinvalido");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.get('#login-email:invalid').should('exist');
    });

    it("Deve exibir mensagem de erro ao tentar logar com senha curta", () => {
        cy.mount(<Login />);
        cy.get('#login-email').type("pedrovinchi9982@gmail.com");
        cy.get('#login-password').type("123");
        cy.get('button[type="submit"]').click();
        cy.get('#login-password:invalid').should('exist');
    });

    it("Deve exibir mensagem de erro ao tentar logar com credenciais inválidas", () => {
        cy.mount(<Login />);
        cy.get('#login-email').type("usuario@errado.com");
        cy.get('#login-password').type("senhaErrada");
        cy.get('button[type="submit"]').click();
        cy.get('#error-message').should('be.visible').contains("Invalid email or password");
    });

    it("Deve logar com credenciais válidas e redirecionar para o dashboard", () => {
        cy.mount(<Login />);
        cy.get('#login-email').type("pedrovinchi9982@gmail.com");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
    });

    it("Deve manter o usuário logado após recarregar a página", () => {
        cy.mount(<Login />);
        cy.get('#login-email').type("pedrovinchi9982@gmail.com");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
        cy.reload();
        cy.url().should('include', '/dashboard');
    });

    it("Deve exibir mensagem de erro ao tentar logar com conta desativada", () => {
        cy.mount(<Login />);
        cy.get('#login-email').type("conta@desativada.com");
        cy.get('#login-password').type("123456");
        cy.get('button[type="submit"]').click();
        cy.get('#error-message').should('be.visible').contains("Conta desativada");
    });
});