
import httpStatusCode from "http-status-codes";
import AppError from "../../errorhelpers/appError";
import { Driver } from "../driver/driver.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { Payment } from "../payment/payment.model";
import { PaymentStatus } from "../payment/payment.interface";

// const generateTransitionId = () => {
//   return `transId_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
// };

const requestRide = async (payload: Partial<IRide>, userId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    // const allAvailableDriver = await Driver.find({
    //   online_status: "Active",
    //   availability: true,
    // });
    // const availableDriver = allAvailableDriver[0];

    // if (!availableDriver) {
    //   throw new AppError(
    //     httpStatusCode.NOT_FOUND,
    //     "Our All driver is busy now. Please try again."
    //   );
    // }

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

    // const transitionId = generateTransitionId();

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

    // await Driver.findByIdAndUpdate(
    //   availableDriver._id,
    //   {
    //     rideId: [...availableDriver.rideId, rideRequestInfo[0]._id],
    //     availability: false,
    //   },
    //   { session }
    // );

    // const paymentInfo = await Payment.create(
    //   [
    //     {
    //       ride: rideRequestInfo[0]._id,
    //       transitionId,
    //       amount: rideRequestInfo[0].price,
    //     },
    //   ],
    //   { session }
    // );

    // const updatedRideInfo = await Ride.findByIdAndUpdate(
    //   rideRequestInfo[0]._id,
    //   {
    //     payment: paymentInfo[0]._id,
    //   },
    //   { new: true, runValidators: true, session }
    // )
    //   .populate("user", "name email phone")
    //   .populate("driver", "approval_status online_status vehicle_info")
    //   .populate("payment");

    // const sslCommerzPayload: ISSLCommerz = {
    //   amount: (updatedRideInfo?.payment as any).amount,
    //   transitionID: (updatedRideInfo?.payment as any).transitionId,
    //   name: (updatedRideInfo?.user as any).name,
    //   email: (updatedRideInfo?.user as any).email,
    //   phone: (updatedRideInfo?.user as any).phone,
    // };

    // const sslPaymentInfo = await sslCommerzServices.initPayment(
    //   sslCommerzPayload
    // );

    await session.commitTransaction();
    session.endSession();

    return rideRequestInfo
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateRideStatus = async (id: string, status: string) => {
  const updatedInfo = await Ride.findByIdAndUpdate(
    id,
    { ride_status: status },
    { new: true }
  );
  return updatedInfo;
};

const rideMe = async (id: string) => {
  
  const allRides = await Ride.find({ user: id })
    .populate({ path: "user", select: "name email phone" })
    .populate({
      path: "driver",
      select: "userId vehicle_Info",
      populate: {
        path: "userId",
        select: "name email phone",
      },
    }).sort({ createdAt : -1})

   

  return allRides;
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



export const rideServices = {
  requestRide,
  updateRideStatus,
  rideMe,
  cancelRide,
};
