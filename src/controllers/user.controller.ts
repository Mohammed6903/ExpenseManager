import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendResponse } from "../utils/send-response";
import * as userService from "../services/user.service";
import { UpdateProfileDTO } from "../validators/user/UpdateProfile.schema";
import { UpdatePreferencesDTO } from "../validators/user/UpdatePreferences.schema";

type UserParams = {
  id: string;
};

export const getUserController = async (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserByIdService(id);
    sendResponse(res, 200, user, "User fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getProfileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const user = await userService.getUserByIdService(userId);
    sendResponse(res, 200, user, "Profile fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const data: UpdateProfileDTO = req.body;
    const user = await userService.updateUserProfileService(userId, data);
    sendResponse(res, 200, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

export const getPreferencesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const preferences = await userService.getUserPreferencesService(userId);
    sendResponse(res, 200, preferences, "Preferences fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updatePreferencesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const data: UpdatePreferencesDTO = req.body;
    const user = await userService.updateUserPreferencesService(userId, data);
    sendResponse(res, 200, user, "Preferences updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteAccountController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    await userService.softDeleteUserService(userId);
    sendResponse(res, 200, null, "Account deleted successfully");
  } catch (error) {
    next(error);
  }
};

