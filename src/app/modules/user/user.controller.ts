import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";
import httpStatusCode from "http-status-codes"

const createUser = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const payload = req.body;
        const user = await userServices.createUser(payload);

        res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "The user is created successfully",
          data: user,
        });
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        next(error)
    }
}

export const userControllers = {
    createUser
}