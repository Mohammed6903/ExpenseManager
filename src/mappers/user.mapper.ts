import { UserDocument } from "../models/user.model";
import { UserResponseDTO } from "../validators/user/UserResponse.dto";

export const toUserResponseDTO = (user: UserDocument): UserResponseDTO => {
  return {
    id: user._id.toString(),
    userName: user.userName,
    email: user.email,
    accountStatus: user.accountStatus,
    preferences: user.preferences,
    deletedAt: user.deletedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

