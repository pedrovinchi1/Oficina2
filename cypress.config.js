// filepath: cypress.config.js
const { defineConfig } = require("cypress");
module.exports = defineConfig({
  projectId: 'r26r1p',
  e2e: {
    baseUrl: "http://localhost:8000",
    supportFile: false,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
