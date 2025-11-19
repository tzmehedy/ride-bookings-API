import  httpStatusCode  from 'http-status-codes';

import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { sslCommerzServices } from '../sslcommerz/sslCommerz.services';


const initPayment = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.rideId
  
  const paymentURL = await paymentServices.initPayment(rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "New Payment Url get successfully.",
    data:{
        paymentURL
    }
  })
});


const validatePayment = catchAsync(async (req: Request, res: Response) => {
  
  await sslCommerzServices.validatePayment(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "The payment successfully validated.",
    data: null
  });
});






const successPayment = catchAsync(async(req: Request, res: Response)=>{
    const query = req.query
     
    const result = await paymentServices.successPayment(query as Record<string, string>)

    if(result.success){
      res.redirect(`${envVars.SSL.SSL_COMMERZ_FRONTEND_SUCCESS_URL}?transitionId=${result.data.transitionId}&paymentStatus=${result.data.paymentStatus}&price=${result.data.amount}`)
    }
})


const failPayment = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const result = await paymentServices.failPayment(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(envVars.SSL.SSL_COMMERZ_FRONTEND_FAILED_URL);
    }
  }
);


const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentServices.cancelPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(envVars.SSL.SSL_COMMERZ_FRONTEND_CANCEL_URL);
  }
});




export const paymentControllers = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  validatePayment,
};