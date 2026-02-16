import mongoose, { Schema, Document } from "mongoose";

export interface TokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  accessTokenFamily: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new Schema<TokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenFamily: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

tokenSchema.index({ userId: 1, expiresAt: 1 });
// tokenSchema.index({ accessTokenFamily: 1 });

export const Token = mongoose.model<TokenDocument>("Token", tokenSchema);
