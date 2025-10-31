import { model, Schema } from "mongoose";
import { IRide, PaymentMethod, RideStatus } from "./ride.interface";

const rideSchema = new Schema<IRide>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driver: { type: Schema.Types.ObjectId, ref: "Driver"},
  payment: { type: Schema.Types.ObjectId, ref: "Payment"},
  paymentMethod: {type: String, enum: Object.values(PaymentMethod)},
  destination_address: { type: String, required: true },
  pickup_address: { type: String, required: true },
  distance: { type: Number, required: true },
  price: { type: Number, required: true },
  ride_status: {
    type: String,
    enum: Object.values(RideStatus),
    default: RideStatus.Requested,
  },
}, {
  timestamps: true
});


export const Ride = model<IRide>("Ride", rideSchema);