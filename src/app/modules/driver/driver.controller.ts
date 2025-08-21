import  httpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverServices } from "./driver.services";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDriver = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{

    const driverInfo = await DriverServices.createDriver(req.body)

    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "The driver created successfully completed.",
        data: driverInfo
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllDrivers = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const allDrivers = await DriverServices.getAllDrivers()

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success:true,
        message: "All driver retrieve successfully.",
        data: allDrivers
    })
})

const driverApproval = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const updatedDriverInfo = await DriverServices.driverApproval(userId)
    
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "The Driver is approve for driving.",
        data: updatedDriverInfo
    })
  }
);

export const DriverControllers = {
  createDriver,
  driverApproval,
  getAllDrivers,
};