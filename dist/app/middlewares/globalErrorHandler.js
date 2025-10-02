"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../errorhelpers/appError"));
const duplicateKeyError_1 = require("../helpers/duplicateKeyError");
const castError_1 = require("../helpers/castError");
const validationError_1 = require("../helpers/validationError");
const zodValidationError_1 = require("../helpers/zodValidationError");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong....!!!";
    let errorSources = [];
    // Duplicate key error
    if (err.code === 11000) {
        const simplifiedError = (0, duplicateKeyError_1.handelDuplicateKeyError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, zodValidationError_1.handelZodValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // cast error
    else if (err.name === "CastError") {
        const simplifiedError = (0, castError_1.handelCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, validationError_1.handelValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        err,
        errorSources,
        stack: env_1.envVars.NODE_DEV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
