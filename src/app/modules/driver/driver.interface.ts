import { Types } from "mongoose";

export interface vehicleInfo{
    brand_name: string,
    model: string,
    vehicle_number:string
}

export enum IIsActive {
  Active = "Active",
  InActive = "InActive",
  Blocked = "Blocked",
}

export enum IApprovalStatus {
  Accept = "Accept",
  Reject = "Reject",
  Pending = "Pending",
}

export interface IDriver {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  rideId?: Types.ObjectId[];
  approval_status?: IApprovalStatus;
  online_status?: IIsActive;
  vehicle_info: vehicleInfo;
}