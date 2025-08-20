import httpStatusCode from 'http-status-codes';

import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import { setCookies } from '../../utils/setCookies';
import { catchAsync } from '../../utils/catchAsync';


const credentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setCookies(res, loginInfo.userTokens);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "The user login successfully...",
      data: loginInfo,
    });
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logOut = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure:false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Logged Out Successfully",
      data: null,
    });
})

export const AuthControllers = {
  credentialsLogin,
  logOut,
};