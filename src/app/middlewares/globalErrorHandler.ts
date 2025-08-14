/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorhelpers/appError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong....!!!";

  if(err instanceof AppError){
    statusCode = err.statusCode
    message = err.message
  }

  else if(err instanceof Error){
    statusCode = 500
    message = err.message
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    err,
    stack: envVars.NODE_DEV ==="development" ? err.stack : null
  });
};