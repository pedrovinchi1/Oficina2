import React from 'react';

const renderizarPagina = () => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cadastro de Professor</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <header>
          <h1>Sistema de Emissão de Certificados</h1>
        </header>

        <main>
          <section id="register">
            <h2>Cadastro de Professor</h2>
            <form action="/professores/" method="post">
              <label htmlFor="nome">Nome:</label>
              <input type="text" id="nome" name="nome" required />
      
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
      
              <label htmlFor="senha">Senha:</label>
              <input type="password" id="senha" name="password" required />
      
              <button type="submit">Cadastrar</button>
              <nav className="menu">
                <ul>
                  <li><a href="/index">Voltar</a></li>
                </ul>
              </nav>
            </form>
          </section>
        </main>

        <footer>
          <p>&copy; 2025 Sistema de Emissão de Certificados. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
};

describe('CadastroProfessor Component', () => {
  it('Deve renderizar o formulário de cadastro de professor corretamente', () => {
    cy.mount(renderizarPagina());
    cy.get('h2').should('contain', 'Cadastro de Professor');
    cy.get('#nome').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#senha').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Deve ter link para voltar ao index', () => {
    cy.mount(renderizarPagina());
    cy.get('nav.menu a').should('contain', 'Voltar').click();
  });
});