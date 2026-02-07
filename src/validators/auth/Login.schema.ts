import z from "zod";
import { passwordSchema } from "../user/CreateUser.schema";

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: passwordSchema,
});

export type LoginDTO = z.infer<typeof LoginSchema>;
