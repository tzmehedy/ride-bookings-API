import httpStatusCode from "http-status-codes";
import AppError from "../../errorhelpers/appError";
import { Driver } from "../driver/driver.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { Payment } from "../payment/payment.model";

const generateTransitionId = () => {
  return `transId_${new Date()}_${Math.floor(Math.random() * 1000)}`;
};

const requestRide = async (payload: Partial<IRide>, userId: string) => {

  const session = await Ride.startSession()
  session.startTransaction()

  try {
    const allAvailableDriver = await Driver.find({
      approval_status: "Accept",
      online_status: "Active",
      availability: true,
    });
    const availableDriver = allAvailableDriver[0];

    if (!availableDriver) {
      throw new AppError(
        httpStatusCode.NOT_FOUND,
        "Our All driver is busy now. Please try again."
      );
    }

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

    const transitionId = generateTransitionId();

    const rideRequestInfo = await Ride.create([{
      ...payload,
      user: userId,
      driver: availableDriver._id,
      ride_status: RideStatus.Accepted,
    }], {session});

    await Driver.findByIdAndUpdate(availableDriver._id, {
      rideId: [...availableDriver.rideId, rideRequestInfo[0]._id],
      availability: false,
    });

    const paymentInfo = await Payment.create([{
      ride: rideRequestInfo[0]._id,
      transitionId,
      amount: rideRequestInfo[0].price,
    }], {session});

    const updatedRideInfo = await Ride.findByIdAndUpdate(
      rideRequestInfo[0]._id,
      {
        payment: paymentInfo[0]._id,
      },
      { new: true, runValidators: true}
    )
      .populate("user", "name email phone")
      .populate("driver", "approval_status online_status vehicle_info")
      .populate("payment");

    await session.commitTransaction()
    session.endSession()

    return updatedRideInfo;
    
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
    
  }
};

const updateRideStatus = async (id: string, status: string) => {
  if (status === RideStatus.Picked_Up) {
    const updatedInfo = await Ride.findByIdAndUpdate(
      id,
      { ride_status: RideStatus.Picked_Up },
      { new: true }
    );
    return updatedInfo;
  } else if (status === RideStatus.In_Transit) {
    const updatedInfo = await Ride.findByIdAndUpdate(
      id,
      {
        ride_status: RideStatus.In_Transit,
      },
      { new: true }
    );
    return updatedInfo;
  } else if (status === RideStatus.Completed) {
    const updatedInfo = await Ride.findByIdAndUpdate(
      id,
      {
        ride_status: RideStatus.Completed,
      },
      { new: true }
    );
    await Driver.findByIdAndUpdate(updatedInfo?.driver, {
      availability: true,
    });
    return updatedInfo;
  }
};

const rideMe = async (id: string) => {
  const allRides = await Ride.find({ userId: id })
    .populate({ path: "userId", select: "name email phone" })
    .populate({
      path: "driverId",
      select: "userId vehicle_Info",
      populate: {
        path: "userId",
        select: "name email phone",
      },
    });

  return allRides;
};

const cancelRide = async (id: string) => {
  const rideInfo = await Ride.findByIdAndUpdate(
    id,
    { ride_status: RideStatus.Canceled },
    { new: true }
  );
  await Driver.findByIdAndDelete(rideInfo?.driver, { availability: true });
  return rideInfo;
};

export const rideServices = {
  requestRide,
  updateRideStatus,
  rideMe,
  cancelRide,
};
