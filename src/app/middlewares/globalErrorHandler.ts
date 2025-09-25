/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorhelpers/appError";
import mongoose from "mongoose";
import { handelDuplicateKeyError } from "../helpers/duplicateKeyError";
import { IErrorSources } from "../interfaces/error.types";
import { handelCastError } from "../helpers/castError";
import { handelValidationError } from "../helpers/validationError";
import { handelZodValidationError } from "../helpers/zodValidationError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong....!!!";

  let errorSources: IErrorSources[] = [];

  // Duplicate key error
  if (err.code === 11000) {
    const simplifiedError = handelDuplicateKeyError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // Zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handelZodValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSources[];
  }

  // cast error
  else if (err.name === "CastError") {
    const simplifiedError = handelCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handelValidationError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as IErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    err,
    errorSources,
    stack: envVars.NODE_DEV === "development" ? err.stack : null,
  });
};
