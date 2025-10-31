/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatusCode from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rideServices } from "./ride.services";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorhelpers/appError";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import axios from "axios";


const requestRide = catchAsync(
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
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const status = req.query.status;
    const updatedInfo = await rideServices.updateRideStatus(
      id,
      status as string
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
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const decodedToken = req.user as JwtPayload;
    if (decodedToken.userId !== id) {
      throw new AppError(httpStatusCode.FORBIDDEN, "Forbidden Access.");
    }

    const allRideMe = await rideServices.rideMe(id);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "All ride retrieve successfully.",
      data: allRideMe,
    });
  }
);


const cancelRide = catchAsync(
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


export const rideControllers = {
  requestRide,
  updateRideStatus,
  rideMe,
  cancelRide,
};
