import express from "express";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(morgan("dev"));

app.use(express.json());

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Personal Finance API Docs",
}));

// API routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

export default app;
