import { AppError } from "./AppError";
import { ErrorCode } from "../types/ErrorCode";

export class NotFoundError extends AppError {
  constructor(message: string = "Object not found!", code: ErrorCode = ErrorCode.RESOURCE_NOT_FOUND) {
    super(message, 404, code);
  }
}
