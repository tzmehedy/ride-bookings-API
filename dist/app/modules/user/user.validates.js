"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(5, { message: "The name must " })
        .max(30, { message: "The name length must be less than 30" }),
    email: zod_1.default.string().email({ error: "Please provide a valid email" }),
    password: zod_1.default
        .string()
        .regex(/^(?=.*[A-Z])/, {
        message: "The password must have one upper case letter",
    })
        .regex(/^(?=.*\d)/, { message: "The password must have one number" })
        .regex(/^(?=.*[!@#$%^&*,.?":{}|<>_\-+=~`[\]\\;/'])/, {
        message: "The password must have a special character",
    }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
        message: "Phone number must be Bangladeshi format..., for example:- +8801700000000",
    })
        .optional(),
    picture: zod_1.default.string().optional(),
    isBlocked: zod_1.default.boolean().optional(),
});
