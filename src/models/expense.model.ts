import mongoose, { Schema, Document } from "mongoose";

export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer" | "other";

export interface ExpenseDocument extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currencyType: string;
  category: string;
  subCategory?: string;
  description?: string;
  note?: string;
  paymentMethod: PaymentMethod;
  tags: string[];
  isRecurring: boolean;
  expenseDate: Date;
  entryDate: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<ExpenseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currencyType: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      length: 3,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank_transfer", "other"],
      required: true,
      default: "cash",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isRecurring: {
      type: Boolean,
      default: false,
      required: true,
    },
    expenseDate: {
      type: Date,
      required: true,
      index: true,
    },
    entryDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

expenseSchema.index({ userId: 1, expenseDate: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, deletedAt: 1 });

export const Expense = mongoose.model<ExpenseDocument>(
  "Expense",
  expenseSchema,
);
