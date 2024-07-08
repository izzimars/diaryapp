// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Diary Dove API",
      version: "1.0.0",
      description: "API documentation for the Diary Dove application",
    },
  },
  apis: ["./docs/**/*.yaml"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerDocs };
