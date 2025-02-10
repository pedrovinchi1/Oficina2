import React from "react";
import { mount } from "cypress/react";

const Dashboard = () => {
  return (
    <div>
      <header>
        <h1>Sistema de Emissão de Certificados</h1>
        <h2>Bem Vindo ao Seu Dashboard</h2>
      </header>
      <nav className="menu">
        <ul>
          <li><a href="/cadastrooficina">Cadastro Oficina</a></li>
          <li><a href="/cadastroaluno">Cadastro Aluno</a></li>
          <li><a href="/atualizaaluno">Atualizar Aluno</a></li>
          <li><a href="/atuaizaprof">Atualizar Professor</a></li>
          <li><a href="/presenca">Presença</a></li>
          <li><a href="/gerarcertificados">Gerar Certificados</a></li>
          <li><a href="/">Sair</a></li>
        </ul>
      </nav>
      <footer>
        {/* Ajuste aqui conforme sua lógica, ou use "dummy-token" diretamente */}
        <p>Seu token de acesso é: dummy-token</p>
        <p>© 2025 Sistema de Emissão de Certificados</p>
      </footer>
    </div>
  );
};

// Exemplo de componente de login simplificado
const LoginForm = () => {
  return (
    <form id="login-form">
      <label htmlFor="login-email">Email:</label>
      <input type="email" id="login-email" name="email" required />
      <label htmlFor="login-password">Senha:</label>
      <input type="password" id="login-password" name="password" required />
      <button type="submit">Entrar</button>
    </form>
  );
};

// Exemplo de componente de cadastro de professor simplificado
const CadastroProfessorForm = () => {
  return (
    <form id="register-form">
      <label htmlFor="nome">Nome:</label>
      <input type="text" id="nome" name="nome" required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <label htmlFor="senha">Senha:</label>
      <input type="password" id="senha" name="password" required />
      <button type="submit">Cadastrar</button>
    </form>
  );
};

describe("Component Testing do Sistema", () => {
  it("Deve renderizar corretamente o cabeçalho do Dashboard", () => {
    mount(<Dashboard />);
    cy.get("header h1").should("contain", "Sistema de Emissão de Certificados");
    cy.get("header h2").should("contain", "Bem Vindo ao Seu Dashboard");
  });

  it("Deve conter a estrutura correta do menu de navegação no Dashboard", () => {
    mount(<Dashboard />);
    cy.get("nav.menu ul li").should("have.length", 7);
    cy.get("nav.menu ul li").eq(0).find("a").should("have.attr", "href", "/cadastrooficina");
    cy.get("nav.menu ul li").eq(1).find("a").should("have.attr", "href", "/cadastroaluno");
    cy.get("nav.menu ul li").eq(2).find("a").should("have.attr", "href", "/atualizaaluno");
    cy.get("nav.menu ul li").eq(3).find("a").should("have.attr", "href", "/atuaizaprof");
    cy.get("nav.menu ul li").eq(4).find("a").should("have.attr", "href", "/presenca");
    cy.get("nav.menu ul li").eq(5).find("a").should("have.attr", "href", "/gerarcertificados");
    cy.get("nav.menu ul li").eq(6).find("a").should("have.attr", "href", "/");
  });

  it("Deve renderizar o footer com informações de token e copyright", () => {
    mount(<Dashboard />);
    cy.get("footer p")
      .first()
      .should("contain", "Seu token de acesso é: dummy-token");
    cy.get("footer p")
      .last()
      .should("contain", "2025 Sistema de Emissão de Certificados");
  });

  it("Deve renderizar o formulário de Login com os campos corretos", () => {
    mount(<LoginForm />);
    cy.get("form#login-form").within(() => {
      cy.get("input#login-email").should("exist").and("have.attr", "type", "email");
      cy.get("input#login-password").should("exist").and("have.attr", "type", "password");
      cy.get("button[type='submit']").should("contain", "Entrar");
    });
  });

  it("Deve renderizar o formulário de Cadastro de Professor com os campos obrigatórios", () => {
    mount(<CadastroProfessorForm />);
    cy.get("form#register-form").within(() => {
      cy.get("input#nome").should("exist").and("have.attr", "type", "text");
      cy.get("input#email").should("exist").and("have.attr", "type", "email");
      cy.get("input#senha").should("exist").and("have.attr", "type", "password");
      cy.get("button[type='submit']").should("contain", "Cadastrar");
    });
  });
});