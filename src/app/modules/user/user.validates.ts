import z from "zod";

export const createZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(5, { message: "The name must " })
    .max(30, { message: "The name length must be less than 30" }),
  email: z.string().email({ error: "Please provide a valid email" }),
  password: z
    .string()
    .regex(/^(?=.*[A-Z])/, {
      message: "The password must have one upper case letter",
    })
    .regex(/^(?=.*\d)/, { message: "The password must have one number" })
    .regex(/^(?=.*[!@#$%^&*,.?":{}|<>_\-+=~`[\]\\;/'])/, {
      message: "The password must have a special character",
    }),
  picture: z.string().optional(),
  isBlocked: z.boolean().optional(),
});
