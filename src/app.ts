import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index";
import { setupSwagger } from "./docs/swagger";
import errorLogger from "./logger";
import { apiLimiter } from "./middlewares/rateLimiter";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { errorResponse, successResponse } from "./utils/response.util";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());
app.set("trust proxy", 1);
app.use(errorLogger);
app.use(apiLimiter);
app.use(globalErrorHandler);

setupSwagger(app);

app.get("/", (_req: Request, res: Response) => {
  successResponse(res, {}, "Api Running");
});

app.use("/api", routes);

app.get("*", (_req: Request, res: Response) => {
  errorResponse(res, "Route Not Found");
});

export default app;
