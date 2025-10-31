import z from "zod";

export const createZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(3, { message: "The name must be 5 character" })
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
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
      message:
        "Phone number must be Bangladeshi format..., for example:- +8801700000000",
    })
    .optional(),
  role: z.string({message: "role is required"}),
  picture: z.string().optional(),
  isBlocked: z.boolean().optional(),
});
