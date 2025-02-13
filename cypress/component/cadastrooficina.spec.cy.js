import React from 'react';

const renderizarPagina = () => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cadastro de Oficina</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <header>
          <h1>Sistema de Emissão de Certificados</h1>
        </header>

        <main>
          <section id="create-oficina">
            <h2>Cadastro de Oficina</h2>
            <form action="/create-oficina" method="post">
              <label htmlFor="titulo">Título:</label>
              <input type="text" id="titulo" name="titulo" required />
              
              <label htmlFor="descricao">Descrição:</label>
              <textarea id="descricao" name="descricao" required></textarea>
              <button type="submit">Cadastrar Oficina</button>
            </form>
          </section>
          <section id="update-oficina">
            <h1>Alteração de Oficinas</h1>
            <select id="oficinaSelect" onChange={() => {}}>
              <option value="">Selecione uma oficina</option>
            </select>

            <input type="text" id="update-titulo" placeholder="Título" />
            <textarea id="update-descricao" placeholder="Descrição"></textarea>
            <button onClick={() => {}}>Salvar</button>

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

describe('CadastroOficina Component', () => {
  it('Deve renderizar o formulário de cadastro de oficina corretamente', () => {
    cy.mount(renderizarPagina());
    cy.get('h2').should('contain', 'Cadastro de Oficina');
    cy.get('#titulo').should('be.visible');
    cy.get('#descricao').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Deve renderizar o formulário de alteração de oficina corretamente', () => {
    cy.mount(renderizarPagina());
    cy.get('h1').should('contain', 'Alteração de Oficinas');
    cy.get('#oficinaSelect').should('be.visible');
    cy.get('#update-titulo').should('be.visible');
    cy.get('#update-descricao').should('be.visible');
    cy.get('button').should('contain', 'Salvar');
  });

  it('Deve ter link para voltar ao dashboard', () => {
    cy.mount(renderizarPagina());
    cy.get('nav.menu a').should('contain', 'Voltar').click();
  });
});