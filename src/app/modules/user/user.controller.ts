import  httpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    
    const user = await userServices.createUser(payload);

    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    })
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUser = async(req:Request,res:Response,next:NextFunction) =>{
  const users = await userServices.getAllUser()

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success:true,
    message: "All user retrieve successfully..!!",
    data: users
  })

}

export const userControllers = {
  createUser,
  getAllUser,
};