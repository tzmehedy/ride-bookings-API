
import httpStatusCode from "http-status-codes";
import AppError from "../../errorhelpers/appError";
import { Driver } from "../driver/driver.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { Payment } from "../payment/payment.model";
import { PaymentStatus } from "../payment/payment.interface";
import { IApprovalStatus } from "../driver/driver.interface";




const requestRide = async (payload: Partial<IRide>, userId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {

    const isUserExist = await Ride.find({ user: userId });

    if (isUserExist) {
      isUserExist.forEach((r) => {
        if (
          r.ride_status !== RideStatus.Completed &&
          r.ride_status !== RideStatus.Canceled
        ) {
          throw new AppError(
            httpStatusCode.BAD_REQUEST,
            "You already in a ride."
          );
        }
      });
    }



    const rideRequestInfo = await Ride.create(
      [
        {
          ...payload,
          user: userId,
          ride_status: RideStatus.Requested,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return rideRequestInfo

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateRideStatus = async (rideId: string, status: string, driverId: string) => {


  if (status === RideStatus.Completed) {
    await Driver.findOneAndUpdate({ userId: driverId }, {
      availability: true
    })
    const rideInfo = await Ride.findById(rideId)

    if (rideInfo?.paymentMethod === "Cash") {
      await Payment.findOneAndUpdate({ ride: rideId }, {
        paymentStatus: PaymentStatus.PAID
      })
    }
  }

  const updatedInfo = await Ride.findByIdAndUpdate(
    rideId,
    { ride_status: status },
    { new: true }
  );
  return updatedInfo
};

const rideMe = async (id: string, query: Record<string, string>) => {
  const size = Number(query.size) 
  const page = Number(query.page)
  

  const searchTerm = query.searchTerm || ""
  const sortByDate = query.sortByDate || ""
  const rideStatus = query.rideStatus || ""

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseQuery:  Record<string, any> = {user: id}

  if(rideStatus){
    baseQuery.ride_status = rideStatus
  }

  if(searchTerm){
    baseQuery.$or = [
      { destination_address: { $regex: searchTerm, $options: "i" } },
      { pickup_address: { $regex: searchTerm, $options: "i" } }
    ]
  }

  

  const allRides = await Ride.find(baseQuery)
    .skip(size * (page - 1))
    .limit(size)
    .sort({ createdAt: sortByDate === "asc"? 1 : -1})
    .populate({ path: "user", select: "name email phone" })
    .populate({
      path: "driver",
      select: "vehicle_info",
      populate: {
        path: "userId",
        select: "name email phone",
      },
    })
    .populate("payment")
    

 

  const totalDocument = await Ride.find({user:id}).countDocuments()


  return {
    allRides: allRides, 
    meta: {
      numberOfTotalRides: totalDocument
    }
  };
};

const cancelRide = async (id: string) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    const isRideExist = await Ride.findById(id);
    const paymentInfo = await Payment.findOne({ ride: id });

    if (!isRideExist) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "The ride does not exist."
      );
    }

    if (
      isRideExist.ride_status === RideStatus.In_Transit ||
      isRideExist.ride_status === RideStatus.Picked_Up
    ) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "You already in a ride. You can't cancel the ride."
      );
    }

    if (isRideExist.ride_status === RideStatus.Completed) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "You already complete the ride."
      );
    }

    if (isRideExist.ride_status === RideStatus.Canceled) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "You already cancel the ride."
      );
    }

    if (
      paymentInfo?.paymentStatus === PaymentStatus.PAID ||
      paymentInfo?.paymentStatus === PaymentStatus.CANCEL
    ) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "You already pay for the ride, so you can not cancel this ride.To cancel this ride please contact with customer care service 16120"
      );
    }

    const updatedRideInfo = await Ride.findByIdAndUpdate(
      id,
      { ride_status: RideStatus.Canceled },
      { runValidators: true, new: true, session }
    );

    await Driver.findByIdAndUpdate(
      updatedRideInfo?.driver,
      {
        availability: true,
      },
      { session }
    );

    await Payment.findOneAndUpdate(
      { ride: updatedRideInfo?._id },
      {
        paymentStatus: PaymentStatus.CANCEL,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return updatedRideInfo;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getRequestedRides = async (userId: string) => {
  const isDriverApproved = await Driver.findOne({ userId })

  if (isDriverApproved?.approval_status !== IApprovalStatus.Accept) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "You are not approved for driver.")
  }

  const requestedRides = await Ride.find({ ride_status: "Requested" }).populate("user", "name email phone")

  return requestedRides

}


const getAllRides = async() =>{
  const allRides = await Ride.find().populate("driver")

  return allRides
}



export const rideServices = {
  requestRide,
  updateRideStatus,
  rideMe,
  cancelRide,
  getRequestedRides,
  getAllRides
};
