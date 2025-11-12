import  httpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverServices } from "./driver.services";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from '../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errorhelpers/appError';
import { IApprovalStatus, IDriver } from './driver.interface';
import { Types } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDriver = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{

  const decodedToken = req.user as JwtPayload

  const userId = decodedToken.userId
  
  const {vehicle_info} = req.body 

  const accessToken = req.cookies.accessToken;

  const verifiedToken = (await verifyToken(accessToken)) as JwtPayload;

  if (verifiedToken.userId !== userId) {
    throw new AppError(403, "Forbidden Access.");
  }

  const driverInfoPayload: Partial<IDriver>= {
    userId: new Types.ObjectId(userId),
    vehicle_info,
  };


    const driverInfo = await DriverServices.createDriver(driverInfoPayload);

    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "The driver created successfully completed.",
        data: driverInfo
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRequestedDrivers = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
  const requestedDrivers = await DriverServices.getRequestedDrivers()

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success:true,
        message: "All requested driver retrieve successfully.",
        data: requestedDrivers
    })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleDriver = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
  const decodedToken = req.user as JwtPayload
  const userId = decodedToken.userId

  const driverInfo = await DriverServices.getSingleDriver(userId)

    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success:true,
        message: "Single driver info get successfully",
        data: driverInfo
    })
})

const driverApproval = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const status = req.query.status as IApprovalStatus
    

    const updatedDriverInfo = await DriverServices.driverApproval(userId, status)
    
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "The Driver is approve for driving.",
        data: updatedDriverInfo
    })
  }
);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setAvailability = catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
  const driverId = req.params.driverId
  const availability = req.query.availability

  const updatedDriverInfo = await DriverServices.setAvailability(driverId, availability as string)

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Your availability updated successfully.",
    data: updatedDriverInfo
  })
})

const viewMyEarning = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.driverId
    const driverInfo = await DriverServices.viewMyEarning(driverId as string)
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "Your earning history get successfully.",
      data: driverInfo,
    });
  }
);


const acceptRide = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const driverId = decodedToken.userId 

    const rideId = req.params.id 

    const acceptedRideInfo = await DriverServices.acceptRide(rideId, driverId)

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "The ride is successfully accepted.",
      data: acceptedRideInfo,
    });
  }
);







export const DriverControllers = {
  createDriver,
  driverApproval,
  getRequestedDrivers,
  setAvailability,
  viewMyEarning,
  getSingleDriver,
  acceptRide
};