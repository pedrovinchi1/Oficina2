module.exports = {
    testEnvironment: "jsdom", // Simula o ambiente de um navegador
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Arquivo opcional para configurações globais
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Ignorar arquivos de estilo
    },
  };
  