import  httpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from 'jsonwebtoken';

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


const getAllUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUser();

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "All user retrieve successfully..!!",
      data: users,
    });
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const blockedUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const id = req.params.id 

  const blockedUserInfo = await userServices.blockedUser(id)

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success:true,
    message: "The user is successfully blocked",
    data: blockedUserInfo
  })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const decodedToken = req.user as JwtPayload
  const userId = decodedToken.userId

  const result = await userServices.getMe(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Successfully user info retrieve.",
    data: result
  })

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const decodedToken = req.user as JwtPayload
  const userId = decodedToken.userId

  let updatedDoc = req.body

  const {password, ...rest} = updatedDoc

  if(password === ""){
    updatedDoc = rest
  }

  

  const result = await userServices.updateUser(userId, updatedDoc)

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Successfully user info retrieve.",
    data: result
  })

})

export const userControllers = {
  createUser,
  getAllUser,
  blockedUser,
  getMe,
  updateUser
};