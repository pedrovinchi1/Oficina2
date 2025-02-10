import React from "react";
import { mount } from "cypress/react";

describe('Index Component', () => {
  it('Deve renderizar o componente corretamente', () => {
    cy.mount(
      <html>
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Sistema de Emissão de Certificados</title>
            <link rel="stylesheet" href="/static/style.css"/>
        </head>
        <body>
            <header>
                <h1>Sistema de Emissão de Certificados</h1>
            </header>

            <main>

                <section id="login-section">
                    <h2>Login de Professor</h2>
                    <form id="login-form" action="/login" method="post">
                        <label htmlFor="login-email">Email:</label>
                        <input type="email" id="login-email" name="email" required/>
                        
                        <label htmlFor="login-password">Senha:</label>
                        <input type="password" id="login-password" name="password" required/>
                        
                        <button type="submit">Entrar</button>
                        <div id="error-message" style={{color:'red'}}></div>
                        <nav className="menu">
                            <ul>
                                <li><a href="/cadastroprofessor">Cadastro Professor</a></li>
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
    )

    // Verificações
    cy.get('h1').should('contain', 'Sistema de Emissão de Certificados')
    cy.get('h2').should('contain', 'Login de Professor')
    cy.get('#login-email').should('be.visible')
    cy.get('#login-password').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Entrar')
    cy.get('a[href="/cadastroprofessor"]').should('contain', 'Cadastro Professor')
  })

  it('Deve exibir mensagem de erro se houver', () => {
    const errorMessage = 'Email ou senha incorretos'

    cy.mount(
      <html>
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Sistema de Emissão de Certificados</title>
            <link rel="stylesheet" href="/static/style.css"/>
        </head>
        <body>
            <header>
                <h1>Sistema de Emissão de Certificados</h1>
            </header>

            <main>

                <section id="login-section">
                    <h2>Login de Professor</h2>
                    <form id="login-form" action="/login" method="post">
                        <label htmlFor="login-email">Email:</label>
                        <input type="email" id="login-email" name="email" required/>
                        
                        <label htmlFor="login-password">Senha:</label>
                        <input type="password" id="login-password" name="password" required/>
                        
                        <button type="submit">Entrar</button>
                        <div id="error-message" style={{color:'red'}}>{errorMessage}</div>
                        <nav className="menu">
                            <ul>
                                <li><a href="/cadastroprofessor">Cadastro Professor</a></li>
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
    )
    cy.get('#error-message').should.contain('Invalid email or password')
  })
})