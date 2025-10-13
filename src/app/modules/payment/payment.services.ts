/* eslint-disable @typescript-eslint/no-explicit-any */
import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorhelpers/appError";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model"
import { Ride } from '../ride/ride.model';
import { ISSLCommerz } from '../sslcommerz/sslCommerz.interface';
import { sslCommerzServices } from '../sslcommerz/sslCommerz.services';


const initPayment = async(rideId: string) =>{

  const isPaymentExist = await Payment.findOne({ride:rideId})

  if(!isPaymentExist){
    throw new AppError(httpStatusCode.BAD_REQUEST, "Payment Does not exist.")
  }

  const rideInfo = await Ride.findById(rideId)
    .populate("user", "name email phone")
    .populate("driver", "approval_status online_status vehicle_info")
    .populate("payment");


  const sslCommerzPayload: ISSLCommerz = {
        amount: (rideInfo?.payment as any).amount,
        transitionID: (rideInfo?.payment as any).transitionId,
        name: (rideInfo?.user as any).name,
        email: (rideInfo?.user as any).email,
        phone: (rideInfo?.user as any).phone,
        
      };


  const sslPaymentInfo = await sslCommerzServices.initPayment(
        sslCommerzPayload
      ); 


  return sslPaymentInfo.GatewayPageURL
  

}



const successPayment = async(query: Record<string, string>) =>{
   await Payment.findOneAndUpdate(
      {
        transitionId: query.transitionId,
      },
      {
        paymentStatus: PaymentStatus.PAID 
      },
    );
    return {
        success: true,
        message: "Payment successfully completed."
    }
}


const failPayment = async (query: Record<string, string>) => {
  await Payment.findOneAndUpdate(
    {
      transitionId: query.transitionId,
    },
    {
      paymentStatus: PaymentStatus.FAILED,
    }
  );
  return {
    success: false,
    message: "Payment Failed.",
  };
};


const cancelPayment = async (query: Record<string, string>) => {
  await Payment.findOneAndUpdate(
    {
      transitionId: query.transitionId,
    },
    {
      paymentStatus: PaymentStatus.CANCEL,
    }
  );
  return {
    success: false,
    message: "Payment Cancel.",
  };
};




export const paymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};