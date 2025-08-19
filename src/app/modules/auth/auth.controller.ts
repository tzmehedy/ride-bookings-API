import httpStatusCode from 'http-status-codes';

import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = async(req:Request, res:Response, next:NextFunction) =>{
    const loginInfo = await AuthServices.credentialsLogin(req.body)

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "The user login successfully...",
        data:loginInfo
    })
}

export const AuthControllers = {
    credentialsLogin
}