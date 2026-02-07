import { AccountStatus, UserPreferences } from "../../models/user.model";

export interface UserResponseDTO {
  id: string;
  email: string;
  userName: string;
  accountStatus: AccountStatus;
  preferences: UserPreferences;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

