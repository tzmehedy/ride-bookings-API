import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model"

const successPayment = async(query: Record<string, string>) =>{
   await Payment.findOneAndUpdate(
      {
        transitionId: query.transitionId,
      },
      {
        paymentStatus: PaymentStatus.PAID 
      }
    );
    return {
        success: true,
        message: "Payment successfully completed."
    }
}


export const paymentServices = {
    successPayment
}