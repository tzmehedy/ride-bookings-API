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

export const DriverControllers = {
    createDriver
}