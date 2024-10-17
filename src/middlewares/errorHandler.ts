import express, { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.util";

// Global error-handling middleware
export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred";

  errorResponse(res, message, statusCode);
};
