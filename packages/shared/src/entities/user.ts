import { z } from "zod";

const userRoleSchema = z.enum(["user", "admin"]);

export const userAuthDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  token: z.string(),
  role: userRoleSchema.optional(),
});

export type UserAuthData = z.infer<typeof userAuthDataSchema>;

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signupBodySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
