import { AppError } from "./AppError";
import { ErrorCode } from "../types/ErrorCode";

export class BadRequestError extends AppError {
    constructor(message = "Bad Request", code: ErrorCode = ErrorCode.BAD_REQUEST) {
        super(message, 400, code);
    }
}