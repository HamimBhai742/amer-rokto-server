import { z } from "zod";

const userRegisterValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/,
    "Password must include uppercase, lowercase, number, and special character"
  ),
    bloodGroup: z.string().optional(),
    location: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    contact: z.string().optional(),
    emergencyContact: z.string().optional(),
    gender: z.string().optional(),
    age: z.number().int().optional(),
    dateOfBirth: z.string().datetime().or(z.date()).optional(),
    lastDonation: z.string().datetime().or(z.date()).optional(),
    weight: z.number().optional(),
    hasDisease: z.boolean().optional(),
    diseaseDetails: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits"),
  }),
});

const resendOtpValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    bloodGroup: z.string().optional(),
    location: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    contact: z.string().optional(),
    emergencyContact: z.string().optional(),
    gender: z.string().optional(),
    age: z.number().int().optional(),
    dateOfBirth: z.string().datetime().or(z.date()).optional(),
    lastDonation: z.string().datetime().or(z.date()).optional(),
    weight: z.number().optional(),
    hasDisease: z.boolean().optional(),
    diseaseDetails: z.string().optional(),
    profileImage: z.string().optional(),
    isAvailable: z.boolean().optional(),
    isNotified: z.boolean().optional()
  }),
});

export const UserValidation = {
  userRegisterValidationSchema,
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
  changePasswordValidationSchema,
  updateProfileValidationSchema,
};
