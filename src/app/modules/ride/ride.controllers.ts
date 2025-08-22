import  httpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rideServices } from "./ride.services";
import { sendResponse } from "../../utils/sendResponse";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestRide = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const rideRequestInfo = await rideServices.requestRide(req.body)
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "The ride request successfully requested.",
        data: rideRequestInfo

    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateRideStatus = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id
    const status = req.query.status
    const updatedInfo = await rideServices.updateRideStatus(id, status as string)
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success:true,
        message: "The ride status update successfully",
        data: updatedInfo
    })

})

export const rideControllers = {
  requestRide,
  updateRideStatus,
};