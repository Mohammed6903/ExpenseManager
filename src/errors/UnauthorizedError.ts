import { AppError } from "./AppError";
import { ErrorCode } from "../types/ErrorCode";

export class UnauthorizedError extends AppError {
  constructor(message: string = "User not authorized!", code: ErrorCode = ErrorCode.AUTH_UNAUTHORIZED) {
    super(message, 401, code);
  }
}
