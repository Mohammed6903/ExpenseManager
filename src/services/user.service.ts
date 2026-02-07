import { CreateUserDTO } from "../validators/user/CreateUser.schema";
import { UpdateProfileDTO } from "../validators/user/UpdateProfile.schema";
import { UpdatePreferencesDTO } from "../validators/user/UpdatePreferences.schema";
import { UserResponseDTO } from "../validators/user/UserResponse.dto";
import { User, AccountStatus, UserPreferences } from "../models/user.model";
import { toUserResponseDTO } from "../mappers/user.mapper";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";
import { ErrorCode } from "../types/ErrorCode";

export const getAllUsersService = async (): Promise<UserResponseDTO[]> => {
  const users = await User.find({ accountStatus: "active", deletedAt: null });
  return users.map(toUserResponseDTO);
};

export const createUserService = async (
  data: CreateUserDTO,
): Promise<UserResponseDTO> => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new BadRequestError("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }

  const userDoc = await User.create({
    userName: data.userName,
    email: data.email,
    password: data.password,
  });

  return toUserResponseDTO(userDoc);
};

export const getUserByIdService = async (
  id: string,
): Promise<UserResponseDTO> => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (user.accountStatus === "deleted") {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  return toUserResponseDTO(user);
};

export const getUserByEmailService = async (
  email: string,
): Promise<UserResponseDTO & { password: string }> => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  return { ...toUserResponseDTO(user), password: user.password };
};

export const updateUserProfileService = async (
  userId: string,
  data: UpdateProfileDTO,
): Promise<UserResponseDTO> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (user.accountStatus === "deleted") {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new BadRequestError("Email already in use", ErrorCode.USER_ALREADY_EXISTS);
    }
  }

  if (data.userName) user.userName = data.userName;
  if (data.email) user.email = data.email;

  await user.save();

  return toUserResponseDTO(user);
};

export const updateUserPreferencesService = async (
  userId: string,
  preferences: UpdatePreferencesDTO,
): Promise<UserResponseDTO> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (user.accountStatus === "deleted") {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  user.preferences = { ...user.preferences, ...preferences } as UserPreferences;
  await user.save();

  return toUserResponseDTO(user);
};

export const getUserPreferencesService = async (
  userId: string,
): Promise<UserPreferences> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  return user.preferences;
};

export const setAccountStatusService = async (
  userId: string,
  status: AccountStatus,
): Promise<UserResponseDTO> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  user.accountStatus = status;
  await user.save();

  return toUserResponseDTO(user);
};

export const softDeleteUserService = async (
  userId: string,
): Promise<void> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  user.accountStatus = "deleted";
  user.deletedAt = new Date();
  await user.save();
};

