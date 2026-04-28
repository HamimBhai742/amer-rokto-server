import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    resetToken: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: z.email(),
    otp: z.string().length(6, "OTP must be 6 characters"),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  verifyOtpValidationSchema,
};
