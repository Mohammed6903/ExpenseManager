import z from "zod";

export const UpdateProfileSchema = z.object({
    userName: z.string().min(1).optional(),
    email: z.string().email().optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
