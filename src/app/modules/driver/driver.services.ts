import httpStatusCode from "http-status-codes";
import { Driver } from "./driver.model";
import { IApprovalStatus, IDriver } from "./driver.interface";
import AppError from "../../errorhelpers/appError";
// import { IRole } from "../user/user.interface";
import mongoose from "mongoose";

const createDriver = async (payload: Partial<IDriver>) => {
  const { userId } = payload;

  const isUserExist = await Driver.findOne({userId});

  if (isUserExist && isUserExist.approval_status === IApprovalStatus.Pending) {
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      "You already requested for drive. Please wait until admin will approve you."
    );
  }
  if (isUserExist && isUserExist.approval_status === IApprovalStatus.Accept) {
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      "Your request for drive already accepted."
    );
  }



  // await User.findByIdAndUpdate(userId, { role: IRole.DRIVER }, { new: true });

  const driverInfo = await Driver.create(payload);
  return driverInfo;
};

const getAllDrivers = async () => {
  const allDrivers = await Driver.find().populate("userId");
  return allDrivers;
};

const driverApproval = async (userId: string) => {
  const updatedDoc: Partial<IDriver> = {
    approval_status: IApprovalStatus.Accept,
  };

  const updatedDriverInfo = await Driver.findByIdAndUpdate(userId, updatedDoc, {
    new: true,
  });

  return updatedDriverInfo;
};

const setAvailability = async (driverId: string, availability: string) => {
  const updatedDriverInfo = await Driver.findByIdAndUpdate(
    driverId,
    {
      availability: availability,
    },
    { new: true }
  );

  return updatedDriverInfo
};


const viewMyEarning = async(driverId : string) =>{
  const driverInfo = await Driver.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(driverId) } },
    {
      $lookup: {
        from: "rides",
        localField: "rideId",
        foreignField: "_id",
        as: "ridesData",
      },
    },
    {
      $unwind: "$ridesData",
    },

    {
      $match: {
        "ridesData.ride_status": "Completed",
      },
    },
    {
      $group: {
        _id: "$_id",
        totalEarnings: { $sum: "$ridesData.price" },
        totalCompletedRides: { $sum: 1 },
      },
    },
  ]);

  return driverInfo[0]
}

export const DriverServices = {
  createDriver,
  driverApproval,
  getAllDrivers,
  setAvailability,
  viewMyEarning,
};
