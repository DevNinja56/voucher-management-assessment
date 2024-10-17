import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: "Too many requests from this IP, please try again after a minute",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response, _next: NextFunction) => {
    res.status(429).json({
      message:
        "Too many requests from this IP, please try again after a minute",
    });
  },
});
