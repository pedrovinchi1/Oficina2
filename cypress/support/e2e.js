Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para evitar que o teste falhe por exceções não capturadas
    return false;
});
