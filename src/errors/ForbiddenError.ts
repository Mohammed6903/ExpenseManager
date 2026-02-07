import { AppError } from "./AppError";
import { ErrorCode } from "../types/ErrorCode";

export class ForbiddenError extends AppError {
    constructor(message: string = "Access forbidden", code: ErrorCode = ErrorCode.RESOURCE_FORBIDDEN) {
        super(message, 403, code);
    }
}
