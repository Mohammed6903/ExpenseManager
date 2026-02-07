import bcrypt from "bcrypt";
import { CreateUserDTO } from "../validators/user/CreateUser.schema";
import { createUserService, getUserByEmailService, getUserByIdService } from "./user.service";
import { AppError } from "../errors/AppError";
import { ErrorCode } from "../types/ErrorCode";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenFamily,
  hashRefreshToken,
  verifyRefreshToken,
} from "../utils/token.utils";
import { Token } from "../models/token.model";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const createUserWithHashedPassword = async (request: CreateUserDTO) => {
  const hashedPassword = await bcrypt.hash(request.password, 10);
  const data: CreateUserDTO = {
    ...request,
    password: hashedPassword,
  };

  return await createUserService(data);
};

const saveRefreshToken = async (
  userId: string,
  refreshToken: string,
  family: string,
): Promise<void> => {
  const hashedToken = await hashRefreshToken(refreshToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await Token.create({
    userId,
    refreshToken: hashedToken,
    accessTokenFamily: family,
    expiresAt,
  });
};

const generateAuthTokens = async (userId: string): Promise<AuthTokens> => {
  const family = generateTokenFamily();
  const accessToken = generateAccessToken(userId, family);
  const refreshToken = generateRefreshToken();

  await saveRefreshToken(userId, refreshToken, family);

  return { accessToken, refreshToken };
};

export const registerService = async (request: CreateUserDTO): Promise<AuthTokens> => {
  const user = await createUserWithHashedPassword(request);
  return await generateAuthTokens(user.id);
};

export const loginService = async (email: string, password: string): Promise<AuthTokens> => {
  const user = await getUserByEmailService(email);

  if (user.accountStatus === "suspended") {
    throw new AppError("Account suspended", 403, ErrorCode.USER_ACCOUNT_SUSPENDED);
  }

  if (user.accountStatus === "deleted") {
    throw new AppError("Account deleted", 403, ErrorCode.USER_ACCOUNT_DELETED);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Incorrect password", 401, ErrorCode.AUTH_INVALID_CREDENTIALS);
  }

  return await generateAuthTokens(user.id);
};

export const refreshTokenService = async (token: string): Promise<AuthTokens> => {
  const tokenDoc = await Token.findOne({
    expiresAt: { $gte: new Date() },
    revokedAt: null,
  });

  if (!tokenDoc) {
    throw new AppError("Invalid refresh token", 401, ErrorCode.AUTH_REFRESH_TOKEN_INVALID);
  }

  const isValid = await verifyRefreshToken(token, tokenDoc.refreshToken);

  if (!isValid) {
    await Token.updateMany(
      { accessTokenFamily: tokenDoc.accessTokenFamily },
      { revokedAt: new Date() },
    );
    throw new AppError("Invalid refresh token", 401, ErrorCode.AUTH_REFRESH_TOKEN_INVALID);
  }

  const user = await getUserByIdService(tokenDoc.userId.toString());

  if (user.accountStatus !== "active") {
    throw new AppError("Account not active", 403, ErrorCode.USER_ACCOUNT_SUSPENDED);
  }

  await Token.findByIdAndUpdate(tokenDoc._id, { revokedAt: new Date() });

  return await generateAuthTokens(tokenDoc.userId.toString());
};

export const logoutService = async (userId: string, refreshToken: string): Promise<void> => {
  const tokenDoc = await Token.findOne({
    userId,
    expiresAt: { $gte: new Date() },
    revokedAt: null,
  });

  if (!tokenDoc) {
    throw new AppError("Invalid refresh token", 401, ErrorCode.AUTH_REFRESH_TOKEN_INVALID);
  }

  const isValid = await verifyRefreshToken(refreshToken, tokenDoc.refreshToken);

  if (!isValid) {
    throw new AppError("Invalid refresh token", 401, ErrorCode.AUTH_REFRESH_TOKEN_INVALID);
  }

  await Token.updateMany(
    { accessTokenFamily: tokenDoc.accessTokenFamily },
    { revokedAt: new Date() },
  );
};

