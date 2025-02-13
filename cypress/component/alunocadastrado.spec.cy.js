import React from 'react';

const renderizarPagina = (aluno = null) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Aluno Cadastrado</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <h1>Aluno Cadastrado com Sucesso</h1>
        <p>Registro Acadêmico: {aluno ? aluno.registro_academico : ''}</p>
        <p>Nome: {aluno ? aluno.nome : ''}</p>
        <p>Email: {aluno ? aluno.email : ''}</p>
        <p>Telefone: {aluno ? aluno.telefone : ''}</p>
        <nav className="menu">
          <ul>
            <li><a href="/dashboard">Voltar ao Dashboard</a></li>
          </ul>
        </nav>
        <footer>
          <p>&copy; 2025 Sistema de Emissão de Certificados. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
};

describe('AlunoCadastrado Component', () => {
  it('Deve renderizar a mensagem de sucesso e os dados do aluno', () => {
    const aluno = {
      registro_academico: '123456',
      nome: 'Aluno Teste',
      email: 'aluno@teste.com',
      telefone: '999999999'
    };
    cy.mount(renderizarPagina(aluno));
    cy.contains('Aluno Cadastrado com Sucesso').should('be.visible');
    cy.contains('Registro Acadêmico: 123456').should('be.visible');
    cy.contains('Nome: Aluno Teste').should('be.visible');
    cy.contains('Email: aluno@teste.com').should('be.visible');
    cy.contains('Telefone: 999999999').should('be.visible');
  });

  it('Deve ter link para voltar ao dashboard', () => {
    cy.mount(renderizarPagina());
    cy.get('nav.menu a').should('contain', 'Voltar ao Dashboard').click();
  });
});