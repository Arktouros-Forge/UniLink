import { z } from "zod";

const email = z.email().max(200);

const newPassword = z
  .string()
  .min(8)
  .max(100)
  .regex(/[A-Za-z]/, "Must contain a letter")
  .regex(/\d/, "Must contain a number");

export const registerBody = z.object({
  name: z.string().trim().min(2).max(100),
  email,
  password: newPassword,
});

export const loginBody = z.object({
  email,
  password: z.string().min(1).max(100),
  remember: z.boolean().optional().default(false),
});

export const tokenBody = z.object({ token: z.string().min(20).max(100) });

export const forgotBody = z.object({ email });

export const resetBody = z.object({
  token: z.string().min(20).max(100),
  password: newPassword,
});

export const firebaseBody = z.object({
  idToken: z.string().min(100).max(4000),
  name: z.string().trim().min(2).max(100).optional(),
  remember: z.boolean().optional().default(true),
});
