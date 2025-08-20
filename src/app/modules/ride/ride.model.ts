import { model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const rideSchema = new Schema<IRide>({
  driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
  destination_address: { type: String, required: true },
  pickup_address: { type: String, required: true },
  ride_status: {type:String, enum: Object.values(RideStatus), default: RideStatus.Requested}
});

export const Ride = model<IRide>("Ride", rideSchema);