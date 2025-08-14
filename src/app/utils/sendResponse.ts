import  httpStatusCode from 'http-status-codes';
import { Response } from "express";

interface IMeta{
    total: number
}

interface ISendResponse<T>{
    success: boolean,
    message: string,
    data: T,
    meta?: IMeta
}

export const sendResponse = async <T>(res: Response, data: ISendResponse<T>) => {
  res.status(httpStatusCode.CREATED).json({
    success: true,
    message: "The user is created successfully",
    data: data,
  });
};