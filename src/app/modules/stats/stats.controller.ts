import  httpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { StatsServices } from "./stats.services";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDriverStats = catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
    const decodedToken = req.user as JwtPayload
    const driverId = decodedToken.userId 

    const driverStats = await StatsServices.getDriverStats(driverId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "The Driver Stats Get Successfully.",
        data: driverStats
    })



})


export const StatsControllers = {
    getDriverStats
}