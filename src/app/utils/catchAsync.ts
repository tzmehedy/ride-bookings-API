import { NextFunction, Request, Response } from "express"

type catchAsyncHandler = (req:Request, res:Response, next:NextFunction)=> Promise<void>

export const catchAsync = (fn:catchAsyncHandler) => (req:Request, res:Response, next:NextFunction)=>{
    Promise.resolve(fn(req, res, next)).catch((err)=>next(err))
}