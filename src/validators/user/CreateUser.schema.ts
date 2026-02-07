import z from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password cannot exceed 20 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain atleast one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Passowrd must contain atleast one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain atleast one number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain atleast one special character",
  });

export const CreateUserSchema = z.object({
  email: z.email("Invalid email"),
  userName: z.string().min(1, "User Name is required"),
  password: passwordSchema,
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
