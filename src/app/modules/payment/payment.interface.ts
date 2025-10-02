/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";


export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCEL = "CANCEL",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
 
}

export interface IPayment {
  ride: Types.ObjectId;
  transitionId: string;
  amount: number;
  paymentGateWayData?: any;
  paymentUrl: string;
  paymentStatus: PaymentStatus;
}