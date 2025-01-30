describe('Sistema de Emissão de Certificados', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8000'); // URL da sua aplicação
    });

    it('Deve cadastrar um professor com sucesso', () => {
        cy.get('a[href="/cadastroprofessor"]').click();
        cy.get('input[name="nome"]').type('Professor Teste');
        cy.get('input[name="email"]').type('professor@teste.com');
        cy.get('input[name="password"]').type('senha123');
        cy.get('button[type="submit"]').click();
        cy.contains('Professor Cadastrado com Sucesso').should('be.visible');
    });

    it('Deve fazer login com sucesso', () => {
        cy.get('a[href="/login"]').click();
        cy.get('input[name="email"]').type('professor@teste.com');
        cy.get('input[name="password"]').type('senha123');
        cy.get('button[type="submit"]').click();
        cy.contains('Bem Vindo ao Seu Dashboard').should('be.visible');
    });

    it('Deve cadastrar um aluno com sucesso', () => {
        cy.get('a[href="/cadastroaluno"]').click();
        cy.get('input[name="registro_academico"]').type('123456');
        cy.get('input[name="nome"]').type('Aluno Teste');
        cy.get('input[name="email"]').type('aluno@teste.com');
        cy.get('input[name="telefone"]').type('123456789');
        cy.get('button[type="submit"]').click();
        cy.contains('Aluno Cadastrado com Sucesso').should('be.visible');
    });

    it('Deve criar uma oficina com sucesso', () => {
        // Primeiro, logar
        cy.get('a[href="/login"]').click();
        cy.get('input[name="email"]').type('professor@teste.com');
        cy.get('input[name="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        // Criar oficina
        cy.get('a[href="/cadastrooficina"]').click();
        cy.get('input[name="titulo"]').type('Oficina de Teste');
        cy.get('textarea[name="descricao"]').type('Descrição da Oficina de Teste');
        cy.get('button[type="submit"]').click();
        cy.contains('Oficina Cadastrada com Sucesso').should('be.visible');
    });

    it('Deve registrar presença com sucesso', () => {
        // Primeiro, logar
        cy.get('a[href="/login"]').click();
        cy.get('input[name="email"]').type('professor@teste.com');
        cy.get('input[name="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        // Registrar presença
        cy.get('a[href="/presenca"]').click();
        cy.get('input[name="registro_academico"]').type('123456');
        cy.get('select[name="oficina_id"]').select('Oficina de Teste');
        cy.get('button[type="submit"]').click();
        cy.contains('Presença registrada com sucesso!').should('be.visible');
    });

    it('Deve gerar certificado com sucesso', () => {
        // Primeiro, logar
        cy.get('a[href="/login"]').click();
        cy.get('input[name="email"]').type('professor@teste.com');
        cy.get('input[name="password"]').type('senha123');
        cy.get('button[type="submit"]').click();
 // Gerar certificado
        cy.get('a[href="/gerarcertificados"]').click();
        cy.get('input[name="registro_academico"]').type('123456');
        cy.get('button[type="submit"]').click();
        
        // Selecionar a oficina e gerar o certificado
        cy.get('select[name="oficina_id"]').select('Oficina de Teste');
        cy.get('button[type="submit"]').click();
        
        // Verificar se o certificado foi gerado
        cy.contains('Certificado de Participação').should('be.visible');
    });

    it('Deve exibir mensagem de erro ao tentar cadastrar professor com email duplicado', () => {
        cy.get('a[href="/cadastroprofessor"]').click();
        cy.get('input[name="nome"]').type('Professor Duplicado');
        cy.get('input[name="email"]').type('professor@teste.com'); // Email já existente
        cy.get('input[name="password"]').type('senha123');
        cy.get('button[type="submit"]').click();
        cy.contains('Email already registered').should('be.visible');
    });

    it('Deve exibir mensagem de erro ao tentar fazer login com credenciais inválidas', () => {
        cy.get('a[href="/login"]').click();
        cy.get('input[name="email"]').type('wrong@teste.com');
        cy.get('input[name="password"]').type('senhaerrada');
        cy.get('button[type="submit"]').click();
        cy.contains('Incorrect email or password').should('be.visible');
    });

    it('Deve exibir mensagem de erro ao tentar registrar presença com aluno não encontrado', () => {
        // Primeiro, logar
        cy.get('a[href="/login"]').click();
        cy.get('input[name="email"]').type('professor@teste.com');
        cy.get('input[name="password"]').type('senha123');
        cy.get('button[type="submit"]').click();

        // Registrar presença com registro acadêmico inexistente
        cy.get('a[href="/presenca"]').click();
        cy.get('input[name="registro_academico"]').type('999999'); // Registro acadêmico que não existe
        cy.get('select[name="oficina_id"]').select('Oficina de Teste');
        cy.get('button[type="submit"]').click();
        cy.contains('Aluno não encontrado').should('be.visible');
    });
});