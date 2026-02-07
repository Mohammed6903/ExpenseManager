import mongoose, { Schema, Document } from "mongoose";

export type AccountStatus = "active" | "suspended" | "deleted";
export type MonthStartType = "calendar" | "salary";

export interface UserPreferences {
  currency: string;
  timezone: string;
  weekStartDay: number;
  monthStartDay: number;
  monthStartType: MonthStartType;
}

export interface UserDocument extends Document {
  userName: string;
  email: string;
  password: string;
  accountStatus: AccountStatus;
  preferences: UserPreferences;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userPreferencesSchema = new Schema<UserPreferences>(
  {
    currency: {
      type: String,
      default: "INR",
      required: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
      required: true,
    },
    weekStartDay: {
      type: Number,
      min: 0,
      max: 6,
      default: 0,
      required: true,
    },
    monthStartDay: {
      type: Number,
      min: 1,
      max: 31,
      default: 1,
      required: true,
    },
    monthStartType: {
      type: String,
      enum: ["calendar", "salary"],
      default: "calendar",
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      required: true,
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({}),
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ accountStatus: 1 });

export const User = mongoose.model<UserDocument>("User", userSchema);
