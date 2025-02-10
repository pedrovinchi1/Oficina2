import React from 'react';

const renderizarPagina = (aluno = null, presencas = [], error = null) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Gerar Certificados</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        <header>
          <h1>Gerar Certificados</h1>
        </header>
        <main>
          <section>
            <h2>Consultar Presenças</h2>
            <form action="/consultar-presencas" method="post">
              <label htmlFor="registro_academico">Registro Acadêmico:</label>
              <input type="number" id="registro_academico" name="registro_academico" required />
              <button type="submit">Consultar</button>
            </form>
          </section>
          {aluno && (
            <section>
              <h2>Presenças de {aluno.nome}</h2>
              <form action="/gerar-certificado" method="post">
                <input type="hidden" name="registro_academico" value={aluno.registro_academico} />
                <label htmlFor="oficina_id">Selecione a Oficina:</label>
                <select id="oficina_id" name="oficina_id" required>
                  {presencas.map((presenca) => (
                    <option key={presenca.oficina.id} value={presenca.oficina.id}>
                      {presenca.oficina.titulo}
                    </option>
                  ))}
                </select>
                <button type="submit">Gerar Certificado</button>
              </form>
            </section>
          )}
          {error && (
            <section>
              <p>{error}</p>
            </section>
          )}
        </main>
        <nav className="menu">
          <ul>
            <li>
              <a href="/dashboard">Voltar ao Dashboard</a>
            </li>
          </ul>
        </nav>
        <footer>
          <p>&copy; 2025 Sistema de Emissão de Certificados. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
};

describe('GerarCertificados Component', () => {
  it('Deve renderizar o formulário de consulta de presenças corretamente', () => {
    cy.mount(renderizarPagina());
    cy.get('h2').should('contain', 'Consultar Presenças');
    cy.get('#registro_academico').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Consultar');
  });

  it('Deve renderizar as presenças do aluno se o aluno for fornecido', () => {
    const aluno = {registro_academico: '123456' };
    const presencas = { oficina: { id: 29 } };
    cy.mount(renderizarPagina(aluno, presencas));
    cy.get('h2').should('contain', `Presenças de ${aluno.nome}`);
    cy.get('#oficina_id').should('be.visible');
    cy.get('#oficina_id option').should('have.length', presencas.length);
    cy.get('button[type="submit"]').should('contain', 'Gerar Certificado');
  });

  it('Deve renderizar uma mensagem de erro se um erro for fornecido', () => {
    const error = 'Aluno não encontrado';
    cy.mount(renderizarPagina(null, [], error));
    cy.get('p').should('contain', error);
  });
});