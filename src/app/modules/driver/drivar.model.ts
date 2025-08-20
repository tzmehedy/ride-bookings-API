import { model, Schema } from "mongoose";
import { IApprovalStatus, IDriver, IIsActive, vehicleInfo } from "./driver.interface";


const vehicleInfoSchema = new Schema<vehicleInfo>({
    brand_name: {type:String, required:true},
    model: {type:String, required:true},
    vehicle_number: {type:String, required:true}
})

const driverSchema = new Schema<IDriver>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  rideId: { type: Schema.Types.ObjectId, ref: "Ride" },
  approval_status: {
    type: String,
    enum: Object.values(IApprovalStatus),
    default: IApprovalStatus.Pending,
  },
  online_status: {
    type: String,
    enum: Object.values(IIsActive),
    default: IIsActive.InActive,
  },
  vehicle_info: {type: vehicleInfoSchema, required:true},
});

export const Driver = model<IDriver>("Driver", driverSchema)