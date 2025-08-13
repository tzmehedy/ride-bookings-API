/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 500;
  const message = "Something went wrong....!!!";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    err,
    stack: envVars.NODE_DEV ==="development" ? err.stack : null
  });
};