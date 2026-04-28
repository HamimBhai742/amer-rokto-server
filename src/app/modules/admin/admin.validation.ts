import { z } from "zod";

const changeRoleSchema = z.object({
  body: z.object({
    role: z.enum(["USER", "ADMIN"]),
  }),
});

export const AdminValidation = {
  changeRoleSchema,
};
