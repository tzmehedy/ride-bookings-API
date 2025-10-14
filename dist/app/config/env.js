"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVars = () => {
    const requiredEnvVar = [
        "DATABASE_URL",
        "PORT",
        "NODE_DEV",
        "SALT_COUNT",
        "JWT_ACCESS_SECRET_KEY",
        "JWT_ACCESS_EXPIRES_IN",
        "JWT_REFRESH_SECRET_KEY",
        "JWT_REFRESH_EXPIRES_IN",
        "ADMIN_Email",
        "ADMIN_PASS",
        "ADMIN_PHONE",
        "ADMIN_NAME",
        "SSL_COMMERZ_ID",
        "SSL_COMMERZ_PASS",
        "SSL_COMMERZ_PAYMENT_API",
        "SSL_COMMERZ_VALIDATION_API",
        "SSL_COMMERZ_VALIDATE_URL",
        "SSL_COMMERZ_FRONTEND_SUCCESS_URL",
        "SSL_COMMERZ_FRONTEND_CANCEL_URL",
        "SSL_COMMERZ_FRONTEND_FAILED_URL",
        "SSL_COMMERZ_BACKEND_SUCCESS_URL",
        "SSL_COMMERZ_BACKEND_CANCEL_URL",
        "SSL_COMMERZ_BACKEND_FAILED_URL"
    ];
    requiredEnvVar.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing Env Variable of ${key}`);
        }
    });
    return {
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: process.env.PORT,
        NODE_DEV: process.env.NODE_DEV,
        SALT_COUNT: Number(process.env.SALT_COUNT),
        JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
        JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
        JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
        ADMIN_Email: process.env.ADMIN_Email,
        ADMIN_PASS: process.env.ADMIN_PASS,
        ADMIN_PHONE: process.env.ADMIN_PHONE,
        ADMIN_NAME: process.env.ADMIN_NAME,
        SSL: {
            SSL_COMMERZ_ID: process.env.SSL_COMMERZ_ID,
            SSL_COMMERZ_PASS: process.env.SSL_COMMERZ_PASS,
            SSL_COMMERZ_PAYMENT_API: process.env.SSL_COMMERZ_PAYMENT_API,
            SSL_COMMERZ_VALIDATION_API: process.env
                .SSL_COMMERZ_VALIDATION_API,
            SSL_COMMERZ_VALIDATE_URL: process.env.SSL_COMMERZ_VALIDATE_URL,
            SSL_COMMERZ_FRONTEND_SUCCESS_URL: process.env.SSL_COMMERZ_FRONTEND_SUCCESS_URL,
            SSL_COMMERZ_FRONTEND_CANCEL_URL: process.env.SSL_COMMERZ_FRONTEND_CANCEL_URL,
            SSL_COMMERZ_FRONTEND_FAILED_URL: process.env.SSL_COMMERZ_FRONTEND_FAILED_URL,
            SSL_COMMERZ_BACKEND_SUCCESS_URL: process.env.SSL_COMMERZ_BACKEND_SUCCESS_URL,
            SSL_COMMERZ_BACKEND_CANCEL_URL: process.env.SSL_COMMERZ_BACKEND_CANCEL_URL,
            SSL_COMMERZ_BACKEND_FAILED_URL: process.env.SSL_COMMERZ_BACKEND_FAILED_URL
        },
    };
};
exports.envVars = loadEnvVars();
