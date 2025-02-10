import React from 'react';

const renderizarPagina = (professor = null, error = null) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Atualização de Professor</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <header>
          <h1>Sistema de Emissão de Certificados</h1>
        </header>

        <main>
          <section id="alteracao-cadastro">
            <h2>Alteração de Cadastro de Professor</h2>
            {error && <div className="error-message">{error}</div>}
            <form id="update-professor-form" action="/professor/update" method="post">
              <label htmlFor="professor_email">Email do Professor:</label>
              <input 
                type="email" 
                id="professor_email" 
                name="professor_email" 
                required 
                defaultValue={professor ? professor.email : ''} 
              />
              <button type="button">Buscar</button>
              
              <input 
                type="hidden" 
                id="professor_id" 
                name="professor_id" 
                defaultValue={professor ? professor.id : ''} 
              />
              
              <label htmlFor="update-nome">Nome:</label>
              <input 
                type="text" 
                id="update-nome" 
                name="nome" 
                required 
                defaultValue={professor ? professor.nome : ''} 
              />
              
              <label htmlFor="update-email">Email:</label>
              <input 
                type="email" 
                id="update-email" 
                name="email" 
                required 
                defaultValue={professor ? professor.email : ''} 
              />
              
              <label htmlFor="update-senha">Senha:</label>
              <input 
                type="password" 
                id="update-senha" 
                name="senha" 
                required 
              />
              
              <button type="submit">Atualizar</button>
            </form>
            <nav className="menu">
              <ul>
                <li><a href="/dashboard">Voltar ao Dashboard</a></li>
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

describe('AtualizaProf Component', () => {
  it('Deve renderizar o formulário corretamente', () => {
    cy.mount(renderizarPagina());
    cy.get('h2').should('contain', 'Alteração de Cadastro de Professor');
    cy.get('#professor_email').should('be.visible');
    cy.get('button[type="button"]').should('contain', 'Buscar');
    cy.get('#update-nome').should('be.visible');
    cy.get('#update-email').should('be.visible');
    cy.get('#update-senha').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Atualizar');
  });

  it('Deve preencher os campos com os dados do professor quando fornecidos', () => {
    const professor = {
      email: 'pedrovinchi9982@gmail.com'
    };
    
    cy.mount(renderizarPagina(professor));
    cy.get('#professor_email').should('have.value', professor.email);
    cy.get('#update-nome').should('have.value', professor.nome);
    cy.get('#update-email').should('have.value', professor.email);
  });

  it('Deve exibir mensagem de erro quando fornecida', () => {
    const error = 'Professor não encontrado';
    cy.mount(renderizarPagina(null, error));
    cy.get('.error-message').should('contain', error);
  });

  it('Deve ter link para voltar ao dashboard', () => {
    cy.mount(renderizarPagina());
    cy.get('nav.menu a').should('contain', 'Voltar').click();
  });
});