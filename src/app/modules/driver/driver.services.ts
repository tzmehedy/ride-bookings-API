

/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCode from "http-status-codes";
import { Driver } from "./driver.model";
import { IApprovalStatus, IDriver, IIsActive } from "./driver.interface";
import AppError from "../../errorhelpers/appError";
import mongoose from "mongoose";
import { Ride } from "../ride/ride.model";
import { RideStatus } from "../ride/ride.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslcommerz/sslCommerz.interface";
import { sslCommerzServices } from "../sslcommerz/sslCommerz.services";

// import { IRole } from "../user/user.interface";


const generateTransitionId = () => {
  return `transId_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const createDriver = async (payload: Partial<IDriver>) => {
  const { userId } = payload;

  const isUserExist = await Driver.findOne({ userId });

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
  if (isUserExist && isUserExist.approval_status === IApprovalStatus.Reject) {
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      "Your request is rejected."
    );
  }



  // await User.findByIdAndUpdate(userId, { role: IRole.DRIVER }, { new: true });

  const driverInfo = await Driver.create(payload);
  return driverInfo;
};



const getRequestedDrivers = async () => {
  const requestedDrivers = await Driver.find({ approval_status: IApprovalStatus.Pending }).populate("userId", "name email phone");
  return requestedDrivers;
};

const driverApproval = async (userId: string, status: IApprovalStatus) => {

  const updatedDoc: Partial<IDriver> = {
    approval_status: status,
  };

  const updatedDriverInfo = await Driver.findByIdAndUpdate(userId, updatedDoc, {
    new: true,
  });

  return updatedDriverInfo;
};

const getSingleDriver = async (userId: string) => {
  const driverInfo = await Driver.findOne({ userId })
  .populate("userId", "name email phone")
  .populate({
    path: "rideId",
    populate: {
      path: "user payment",
      select: "name email phone paymentStatus",
    },
    options: {
      sort: { createdAt: -1 }
    }
  })

  return driverInfo
}

const setAvailability = async (driverId: string, status: string) => {
  
  const updatedDriverInfo = await Driver.findOneAndUpdate(
    { userId:driverId},
    {
      online_status: status,
    },
    { new: true }
  );

  

  return updatedDriverInfo
};


const viewMyEarning = async (driverId: string) => {
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

const acceptRide = async (rideId: string, driverId: string) => {
  
  const session = await Payment.startSession()
  session.startTransaction()

  try {
    const driverInfo = await Driver.findOne({userId:driverId})

    if (!driverInfo) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "Forbidden Access")
    }

    if (driverInfo?.availability === false) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "You already in a ride. Please complete your ride first, then try another ride.")
    }

    if(driverInfo?.online_status === IIsActive.InActive){
      throw new AppError(httpStatusCode.BAD_REQUEST, "You are in inactive mode please turn on your Active mode.")
    }


    await Driver.findByIdAndUpdate(
      driverInfo?._id,
      {
        rideId: [...driverInfo.rideId, rideId],
        availability: false,
      }, {new: true, runValidators: true, session},
    );



    const updateRiderInfo = await Ride.findByIdAndUpdate(rideId, {
      driver: driverInfo._id,
      ride_status: RideStatus.Accepted,
    }, { new: true, runValidators: true, session })

   
    

    const transitionId = generateTransitionId()



    const paymentInfo = await Payment.create(
      [{
        ride: updateRiderInfo?._id,
        transitionId,
        amount: updateRiderInfo?.price,
      }], {session},
    );


    


    const sslCommerzPayload: ISSLCommerz = {
      amount: paymentInfo[0].amount,
      transitionID: paymentInfo[0].transitionId,
      name: (updateRiderInfo?.user as any).name,
      email: (updateRiderInfo?.user as any).email,
      phone: (updateRiderInfo?.user as any).phone,
    };

    const sslPaymentInfo = await sslCommerzServices.initPayment(
      sslCommerzPayload
    );

    await Payment.findByIdAndUpdate(paymentInfo[0]._id, {
      paymentUrl: sslPaymentInfo.GatewayPageURL
    }, {new: true, runValidators: true, session})



    const afterPaymentCreateUpdateRideInfo = await Ride.findByIdAndUpdate(
      updateRiderInfo?._id,
      {
        payment: paymentInfo[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone")
      .populate("driver", "approval_status online_status vehicle_info")
      .populate("payment");

    await session.commitTransaction();
    session.endSession();

    return afterPaymentCreateUpdateRideInfo 
    

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error
  }

}



export const DriverServices = {
  createDriver,
  driverApproval,
  getRequestedDrivers,
  getSingleDriver,
  setAvailability,
  viewMyEarning,
  acceptRide

};
