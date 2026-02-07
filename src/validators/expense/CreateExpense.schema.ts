import z from "zod";

export const CreateExpenseSchema = z.object({
  userId: z.string().length(24, { message: "Invalid User ID" }).optional(),
  amount: z.number().positive({ message: "Amount must be positive" }),
  currencyType: z.string().length(3, { message: "Invalid currency type" }).default("INR"),
  category: z.string().min(1, { message: "Category is required" }),
  subCategory: z.string().optional(),
  description: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(["cash", "card", "upi", "bank_transfer", "other"]).default("cash"),
  tags: z.array(z.string()).default([]),
  isRecurring: z.boolean().default(false),
  expenseDate: z.coerce.date(),
});

export type CreateExpenseDTO = z.infer<typeof CreateExpenseSchema>;

