import { z } from "zod";

const isValidDateInput = (value: string) => {
  const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const slashDateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  if (slashDateMatch) {
    const [, month, day, year] = slashDateMatch.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  return !Number.isNaN(Date.parse(value));
};

const dateInputSchema = z.union([
  z.date(),
  z.string().refine(isValidDateInput, "Invalid date"),
]);

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
    dateOfBirth: dateInputSchema.optional(),
    lastDonation: dateInputSchema.optional(),
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
    dateOfBirth: dateInputSchema.optional(),
    lastDonation: dateInputSchema.optional(),
    weight: z.number().optional(),
    hasDisease: z.boolean().optional(),
    diseaseDetails: z.string().optional(),
    profileImage: z.string().optional(),
    isAvailable: z.boolean().optional(),
    isNotified: z.boolean().optional()
  }).strict(),
});

export const UserValidation = {
  userRegisterValidationSchema,
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
  changePasswordValidationSchema,
  updateProfileValidationSchema,
};
