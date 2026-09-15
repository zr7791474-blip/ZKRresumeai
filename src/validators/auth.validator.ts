import { z } from "zod";

export const registerValidator = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export const loginValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const refreshTokenValidator = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const forgotPasswordValidator = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordValidator = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export const changePasswordValidator = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export const deleteAccountValidator = z.object({
  password: z.string().min(1, "Password is required to delete account"),
});

export const verifyEmailValidator = z.object({
  token: z.string().min(1, "Token is required"),
});

export const updateProfileValidator = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export type RegisterDto = z.infer<typeof registerValidator>;
export type LoginDto = z.infer<typeof loginValidator>;
export type RefreshTokenDto = z.infer<typeof refreshTokenValidator>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordValidator>;
export type ResetPasswordDto = z.infer<typeof resetPasswordValidator>;
export type ChangePasswordDto = z.infer<typeof changePasswordValidator>;
export type DeleteAccountDto = z.infer<typeof deleteAccountValidator>;
export type VerifyEmailDto = z.infer<typeof verifyEmailValidator>;
export type UpdateProfileDto = z.infer<typeof updateProfileValidator>;