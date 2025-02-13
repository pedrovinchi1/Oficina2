import React from 'react';

const renderizarPagina = () => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cadastro de Aluno</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <header>
          <h1>Sistema de Emissão de Certificados</h1>
        </header>

        <main>
          <section id="cadastroaluno">
            <h2>Cadastro de Aluno</h2>
            <form action="/alunos/" method="post">
              <label htmlFor="registro_academico">Registro Acadêmico:</label>
              <input type="text" id="registro_academico" name="registro_academico" required />
              
              <label htmlFor="nome">Nome:</label>
              <input type="text" id="nome" name="nome" required />
              
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
              
              <label htmlFor="telefone">Telefone:</label>
              <input type="text" id="telefone" name="telefone" required />
              
              <button type="submit">Cadastrar</button>
            </form>
            <nav className="menu">
              <ul>
                <li><a href="/dashboard">Voltar</a></li>
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

describe('CadastroAluno Component', () => {
  it('Deve renderizar o formulário de cadastro de aluno corretamente', () => {
    cy.mount(renderizarPagina());
    cy.get('h2').should('contain', 'Cadastro de Aluno');
    cy.get('#registro_academico').should('be.visible');
    cy.get('#nome').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#telefone').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Deve ter link para voltar ao dashboard', () => {
    cy.mount(renderizarPagina());
    cy.get('nav.menu a').should('contain', 'Voltar').click();
  });
});