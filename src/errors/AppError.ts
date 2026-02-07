import { ErrorCode } from "../types/ErrorCode";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code: ErrorCode;

  constructor(message: string, statusCode: number, code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

