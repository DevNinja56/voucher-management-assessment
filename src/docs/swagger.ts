import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { envConstants } from "../constants";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Voucher Management API",
    version: "1.0.0",
    description: "API documentation for Voucher Management system.",
  },
  servers: [
    {
      url:
        process.env.NODE_ENV === "production"
          ? `https://voucher-management-72c4821a0bb0.herokuapp.com/api`
          : `http://localhost/${envConstants.Port}/api`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
