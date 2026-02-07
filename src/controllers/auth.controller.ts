import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { LoginDTO } from "../validators/auth/Login.schema";
import { sendResponse } from "../utils/send-response";
import { CreateUserDTO } from "../validators/user/CreateUser.schema";
import { AuthRequest } from "../types/AuthRequest";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto: LoginDTO = req.body;
    const tokens = await authService.loginService(dto.email, dto.password);
    sendResponse(res, 200, tokens, "User logged in successfully");
  } catch (error) {
    next(error);
  }
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto: CreateUserDTO = req.body;
    const tokens = await authService.registerService(dto);
    sendResponse(res, 201, tokens, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokenService(refreshToken);
    sendResponse(res, 200, tokens, "Tokens refreshed successfully");
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.userId!;
    await authService.logoutService(userId, refreshToken);
    sendResponse(res, 200, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

