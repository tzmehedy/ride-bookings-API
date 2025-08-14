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
        success: true,
        message: "User created successfully",
        data: user
    })
  }
);

export const userControllers = {
    createUser
}