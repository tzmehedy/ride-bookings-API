import { Types } from "mongoose";

export enum RideStatus {
  Requested = "Requested",
  Accepted = "Accepted",
  Picked_Up = "Picked_Up",
  In_Transit = "In_Transit",
  Completed = "Completed",
}


export interface IRide {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickup_address: string;
  destination_address: string;
  distance: number;
  price: number;
  ride_status?: RideStatus;
}