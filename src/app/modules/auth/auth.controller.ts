import httpStatusCode from 'http-status-codes';

import { NextFunction, Request, Response } from "express";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import { setCookies } from '../../utils/setCookies';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errorhelpers/appError';
import { createUserTokens } from '../../utils/userTokens';
import { envVars } from '../../config/env';


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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleCallback = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{

  let redirectTo = req.query.state? req.query.state as string: ""

  if(redirectTo.startsWith("/")){
    redirectTo = redirectTo.slice(1)
  }
  const user = req.user

  if(!user){
    throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found")
  }

  const tokens = await createUserTokens(user)

  setCookies(res, tokens)

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);

})

export const AuthControllers = {
  credentialsLogin,
  logOut,
  googleCallback,
};