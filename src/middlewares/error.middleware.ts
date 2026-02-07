import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ErrorCode } from "../types/ErrorCode";
import { ZodError } from "zod";

interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: unknown;
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  const isProduction = process.env.NODE_ENV === "production";

  console.error("Error occurred:", {
    name: err.name,
    message: err.message,
    stack: !isProduction ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      message: "Validation failed",
      code: ErrorCode.VALIDATION_FAILED,
      errors: err.issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
      })),
    };

    if (!isProduction) {
      response.stack = err.stack;
    }

    res.status(400).json(response);
    return;
  }

  if (err instanceof AppError && err.isOperational) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
      code: err.code,
    };

    if (!isProduction) {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  const response: ErrorResponse = {
    success: false,
    message: isProduction ? "Internal server error" : err.message,
    code: ErrorCode.INTERNAL_SERVER_ERROR,
  };

  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(500).json(response);
};

