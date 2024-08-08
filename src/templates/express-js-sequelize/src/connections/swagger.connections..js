const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userSwagger = require("../swagger/user.swagger.json");

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js CRUD API with Swagger",
      version: "1.0.0",
      description:
        "Documentation for a simple CRUD API using Node.js, Express, and PostgreSQL",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          in: "header",
          name: "Authorization",
          description: "Bearer token to access these API endpoints",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "User",
        description: "User management",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

swaggerSpec.paths = { ...swaggerSpec.paths, ...userSwagger };

module.exports = { swaggerSpec, swaggerUi };
