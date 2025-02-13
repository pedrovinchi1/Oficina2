describe("Registro de Presença Component", () => {
    it("Deve renderizar o formulário de registro de presença corretamente", () => {
        cy.mount(<Presenca />);
        cy.contains("Registro de Presença").should("be.visible");
        cy.get('#aluno-nome').should("be.visible");
        cy.get('#aluno-seletor').should("be.visible");
        cy.get('#oficina-id').should("be.visible");
        cy.get('button[type="submit"]').should("be.visible");
    });

    it("Deve registrar a presença de um aluno em uma oficina", () => {
        const alunoNome = "Aluno Teste";
        const registroAcademico = "123456";
        const oficinaId = "29";

        cy.mount(<Presenca />);
        cy.get("#aluno-nome").type(alunoNome);
        cy.intercept('GET', `/alunos/nome/${alunoNome}`, {
            statusCode: 200,
            body: [{ nome: alunoNome, registro_academico: registroAcademico }]
        }).as('buscarAlunos');
        cy.wait('@buscarAlunos');
        cy.get("#aluno-seletor").select(registroAcademico);
        cy.get("#oficina-id").select(oficinaId);
        cy.get('button[type="submit"]').click();

        cy.intercept('POST', '/presencas/').as('registrarPresenca');
        cy.get("#presenca-form button[type='submit']").click();
        cy.wait('@registrarPresenca').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.url().should('include', '/dashboard');
    });

    it("Deve renderizar uma mensagem de erro se o registro acadêmico for inválido", () => {
        const alunoNome = "Aluno Inválido";
        const registroAcademico = "invalid-ra";
        const oficinaId = "1";

        cy.mount(<Presenca />);
        cy.get("#aluno-nome").type(alunoNome);
        cy.intercept('GET', `/alunos/nome/${alunoNome}`, {
            statusCode: 200,
            body: [{ nome: alunoNome, registro_academico: registroAcademico }]
        }).as('buscarAlunos');
        cy.wait('@buscarAlunos');
        cy.get("#aluno-seletor").select(registroAcademico);
        cy.get("#oficina-id").select(oficinaId);
        cy.intercept('POST', '/presencas/', (req) => {
            req.reply({
                statusCode: 400,
                body: { message: "Registro Acadêmico inválido" }
            });
        }).as('registrarPresenca');
        cy.get("#presenca-form button[type='submit']").click();
        cy.wait('@registrarPresenca');
        cy.contains("Registro Acadêmico inválido").should("be.visible");
    });

    it("Deve renderizar uma mensagem de erro se o nome do aluno não for encontrado", () => {
        const alunoNome = "Aluno Não Encontrado";

        cy.mount(<Presenca />);
        cy.get("#aluno-nome").type(alunoNome);
        cy.intercept('GET', `/alunos/nome/${alunoNome}`, {
            statusCode: 200,
            body: []
        }).as('buscarAlunos');
        cy.wait('@buscarAlunos');

        cy.get("#aluno-seletor").should("have.value", "");
        cy.contains("Selecione um aluno").should("be.visible");
    });

    it("Deve renderizar uma mensagem de erro se a oficina não for selecionada", () => {
        const alunoNome = "Aluno Teste";
        const registroAcademico = "123456";

        cy.mount(<Presenca />);
        cy.get("#aluno-nome").type(alunoNome);
        cy.intercept('GET', `/alunos/nome/${alunoNome}`, {
            statusCode: 200,
            body: [{ nome: alunoNome, registro_academico: registroAcademico }]
        }).as('buscarAlunos');
        cy.wait('@buscarAlunos');
        cy.get("#aluno-seletor").select(registroAcademico);
        cy.get('button[type="submit"]').click();

        cy.contains("Selecione uma oficina").should("be.visible");
    });

    it("Deve limpar o formulário ao clicar no botão 'Limpar'", () => {
        const alunoNome = "Aluno Teste";
        const registroAcademico = "123456";
        const oficinaId = "29";

        cy.mount(<Presenca />);
        cy.get("#aluno-nome").type(alunoNome);
        cy.intercept('GET', `/alunos/nome/${alunoNome}`, {
            statusCode: 200,
            body: [{ nome: alunoNome, registro_academico: registroAcademico }]
        }).as('buscarAlunos');
        cy.wait('@buscarAlunos');
        cy.get("#aluno-seletor").select(registroAcademico);
        cy.get("#oficina-id").select(oficinaId);
        cy.get('button[type="reset"]').click();

        cy.get("#aluno-nome").should("have.value", "");
        cy.get("#aluno-seletor").should("have.value", "");
        cy.get("#oficina-id").should("have.value", "");
    });
});