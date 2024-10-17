import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConstants } from "../constants";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, envConstants.JwtSecret) as {
      userId: string;
    };

    req.user = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
    return;
  }
};
