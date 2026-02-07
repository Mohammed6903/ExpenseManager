import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { ErrorCode } from "../types/ErrorCode";
import { AppError } from "../errors/AppError";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const getJWTSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError("JWT_SECRET environment variable is not defined", 500, ErrorCode.INTERNAL_SERVER_ERROR);
    }
    return secret;
};

export interface TokenPayload {
    userId: string;
    family: string;
}

export const generateAccessToken = (userId: string, family: string): string => {
    return jwt.sign({ userId, family } as TokenPayload, getJWTSecret(), {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

export const generateRefreshToken = (): string => {
    return randomBytes(64).toString("hex");
};

export const hashRefreshToken = async (token: string): Promise<string> => {
    return await bcrypt.hash(token, 10);
};

export const verifyRefreshToken = async (
    token: string,
    hashedToken: string,
): Promise<boolean> => {
    return await bcrypt.compare(token, hashedToken);
};

export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, getJWTSecret()) as TokenPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Access token expired", 401, ErrorCode.AUTH_TOKEN_EXPIRED);
        }
        throw new AppError("Invalid access token", 401, ErrorCode.AUTH_TOKEN_INVALID);
    }
};

export const generateTokenFamily = (): string => {
    return randomBytes(16).toString("hex");
};

export const getRefreshTokenExpiry = (): string => {
    return REFRESH_TOKEN_EXPIRY;
};
