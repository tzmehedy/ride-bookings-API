import { model, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
  ride: { type: Schema.Types.ObjectId, required: true, ref: "Ride" },
  transitionId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentGateWayData: { type: Schema.Types.Mixed },
  paymentUrl: { type: String },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.UNPAID,
  },
}, {
    timestamps: true
})

export const Payment = model<IPayment>("Payment", paymentSchema)
