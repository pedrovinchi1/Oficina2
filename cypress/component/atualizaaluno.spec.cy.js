import React from 'react';

const renderizarPagina = (error = null, aluno = null) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Atualização de Aluno</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <header>
          <h1>Sistema de Emissão de Certificados</h1>
        </header>

        <main>
          <section id="atualizaçãoaluno">
            <h2>Alteração de Cadastro</h2>
            {error && <div className="error-message">{error}</div>}
            <form id="update-aluno-form" action="/aluno/update" method="post">
              <label htmlFor="update-registro_academico">Registro Acadêmico:</label>
              <input type="text" id="update-registro_academico" name="registro_academico" required defaultValue={aluno ? aluno.registro_academico : ''} />
              <button type="button" onClick={() => {}}>Buscar</button>
              
              <label htmlFor="update-nome">Nome:</label>
              <input type="text" id="update-nome" name="nome" required defaultValue={aluno ? aluno.nome : ''} />
              
              <label htmlFor="update-email">Email:</label>
              <input type="email" id="update-email" name="email" required defaultValue={aluno ? aluno.email : ''} />
              
              <label htmlFor="update-telefone">Telefone:</label>
              <input type="text" id="update-telefone" name="telefone" required defaultValue={aluno ? aluno.telefone : ''} />
              
              <button type="submit">Atualizar</button>
            </form>
            <nav className="menu">
              <ul>
                <li>
                  <a href="/dashboard">Voltar</a>
                </li>
              </ul>
            </nav>
          </section>
        </main>

        <footer>
          <p>&copy; 2025 Sistema de Emissão de Certificados. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
};

describe('AtualizaAluno Component', () => {
  it('Deve renderizar o formulário corretamente', () => {
    cy.mount(renderizarPagina());
    cy.get('h2').should('contain', 'Alteração de Cadastro');
    cy.get('#update-registro_academico').should('be.visible');
    cy.get('button[type="button"]').should('contain', 'Buscar');
    cy.get('#update-nome').should('be.visible');
    cy.get('#update-email').should('be.visible');
    cy.get('#update-telefone').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Atualizar');
  });

  it('Deve exibir a mensagem de erro se fornecida', () => {
    const errorMessage = 'Registro Acadêmico não encontrado.';
    cy.mount(renderizarPagina(errorMessage));
    cy.get('.error-message').should('contain', errorMessage);
  });

  it('Deve preencher os campos com os dados do aluno se fornecidos', () => {
    const aluno = {
      registro_academico: '12345',
      nome: 'Aluno Teste',
      email: 'aluno@teste.com',
      telefone: '123456789'
    };
    cy.mount(renderizarPagina(null, aluno));
    cy.get('#update-registro_academico').should('have.value', aluno.registro_academico);
    cy.get('#update-nome').should('have.value', aluno.nome);
    cy.get('#update-email').should('have.value', aluno.email);
    cy.get('#update-telefone').should('have.value', aluno.telefone);
  });
});