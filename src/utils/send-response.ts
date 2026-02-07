import { Response } from "express";
import { ApiResponse } from "../types/ApiResponse";

export const sendResponse = <T>(
    res: Response<ApiResponse<T>>,
    statusCode: number,
    data: T,
    message?: string
): void => {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message,
    };

    res.status(statusCode).json(response);
};