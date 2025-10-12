
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const successPayment = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const query = req.query
    const result = await paymentServices.successPayment(query as Record<string, string>)

    if(result.success){
        res.redirect(envVars.SSL.SSL_COMMERZ_FRONTEND_SUCCESS_URL)
    }
})

export const paymentControllers = {
    successPayment
}