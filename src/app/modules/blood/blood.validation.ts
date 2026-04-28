import { z } from "zod";

const createBloodRequestSchema = z.object({
  body: z.object({
    bloodGroup: z.string().min(1, "Blood group is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    hospitalName: z.string().min(1, "Hospital name is required"),
    location: z.string().min(1, "Location is required"),
    district: z.string().optional(),
    upazila: z.string().optional(),
    needDate: z.string().datetime().or(z.date()),
    urgency: z.string().optional(),
  }),
});

const updateBloodRequestSchema = z.object({
  body: z.object({
    bloodGroup: z.string().optional(),
    phoneNumber: z.string().optional(),
    hospitalName: z.string().optional(),
    location: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    needDate: z.string().datetime().or(z.date()).optional(),
    urgency: z.string().optional(),
  }),
});

const changeRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"]),
  }),
});

export const BloodValidation = {
  createBloodRequestSchema,
  updateBloodRequestSchema,
  changeRequestStatusSchema,
};
