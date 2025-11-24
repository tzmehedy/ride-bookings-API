
import httpStatusCode from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rideServices } from "./ride.services";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const requestRide = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const rideRequestInfo = await rideServices.requestRide(
      req.body,
      decodedToken.userId
    );
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "The ride request successfully requested.",
      data: rideRequestInfo,
    });
  }
);


const updateRideStatus = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const status = req.body.status;
    const decodedToken = req.user  as JwtPayload

    const driverId = decodedToken.userId 
    
    const updatedInfo = await rideServices.updateRideStatus(
      rideId,
      status as string,
      driverId
    );
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "The ride status update successfully",
      data: updatedInfo,
    });
  }
);


const rideMe = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const id = decodedToken.userId;
 
    const query = req.query 
    
    const allRideMe = await rideServices.rideMe(id, query as Record<string, string>);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "All ride retrieve successfully.",
      data: allRideMe,
    });
  }
);


const cancelRide = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const updatedRideInfo = await rideServices.cancelRide(rideId);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "The ride successfully canceled.",
      data: updatedRideInfo,
    });
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRequestedRides = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
  const decodedToken = req.user as JwtPayload

  const userId = decodedToken.userId
  const requestedRides = await rideServices.getRequestedRides(userId)
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "The ride requested retrieve successfully.",
    data: requestedRides
  })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllRides = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{

  const allRides = await rideServices.getAllRides()
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "All Rides Retrieve Successfully",
    data: allRides
  })
})


export const rideControllers = {
  requestRide,
  updateRideStatus,
  rideMe,
  cancelRide,
  getRequestedRides,
  getAllRides
};
