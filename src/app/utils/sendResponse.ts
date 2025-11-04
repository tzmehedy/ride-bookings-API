import { Response } from "express";

interface IMeta{
    total: number
}

interface ISendResponse<T>{
    statusCode: number,
    success: boolean,
    message: string,
    data: T,
    meta?: IMeta
}

export const sendResponse = async <T>(res: Response, data: ISendResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    statusCode: data.statusCode
  });
};