import { Types } from "mongoose";

export enum RideStatus {
  Requested = "Requested",
  Accepted = "Accepted",
  Picked_Up = "Picked_Up",
  In_Transit = "In_Transit",
  Completed = "Completed",
  Canceled = "Canceled"
}

export enum PaymentMethod {
  Cash = "Cash",
  Online = "Online"
}


export interface IRide {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  driver?: Types.ObjectId;
  payment?: Types.ObjectId,
  paymentMethod: PaymentMethod,
  pickup_address: string;
  destination_address: string;
  distance: number;
  price: number;
  ride_status?: RideStatus;
  createAt?: Date
}