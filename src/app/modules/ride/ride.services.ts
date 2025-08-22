import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorhelpers/appError";
import { Driver } from "../driver/driver.model";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

const requestRide = async(payload: Partial<IRide>) =>{
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

  const isUserExist = await Ride.find({userId: payload.userId})

  if(isUserExist){
    isUserExist.forEach(r=>{
    if(r.ride_status !== RideStatus.Completed){
        throw new AppError(httpStatusCode.BAD_REQUEST, "You already in a ride.")
    }
  })
  }

  const updatedRideInfo = {
    ...payload,
    driverId: availableDriver._id,
    ride_status: RideStatus.Accepted,
  };
  const rideRequestInfo = await Ride.create(updatedRideInfo);

  await Driver.findByIdAndUpdate(availableDriver._id, {
    rideId: [...availableDriver.rideId, rideRequestInfo._id],
    availability: false,
  });

  return rideRequestInfo;
}

const updateRideStatus = async(id: string, status:string) =>{

    if(status=== RideStatus.Picked_Up){
        const updatedInfo = await Ride.findByIdAndUpdate(id, {ride_status: RideStatus.Picked_Up}, {new:true})
        return updatedInfo
    }

    else if (status === RideStatus.In_Transit) {
        const updatedInfo = await Ride.findByIdAndUpdate(
          id,
          {
            ride_status: RideStatus.In_Transit,
          },
          { new: true }
        );
        return updatedInfo;
    }

    else if (status === RideStatus.Completed) {
        const updatedInfo = await Ride.findByIdAndUpdate(
          id,
          {
            ride_status: RideStatus.Completed,
          },
          { new: true }
        );
        await Driver.findByIdAndUpdate(updatedInfo?.driverId, {availability: true} );
        return updatedInfo;
    }
}

export const rideServices = {
  requestRide,
  updateRideStatus,
};