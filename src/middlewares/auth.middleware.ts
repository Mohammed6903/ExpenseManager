import { NextFunction, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { AuthRequest } from "../types/AuthRequest";
import { verifyAccessToken } from "../utils/token.utils";
import { ErrorCode } from "../types/ErrorCode";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided", ErrorCode.AUTH_UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

