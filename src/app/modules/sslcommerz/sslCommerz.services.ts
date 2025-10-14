import httpStatusCode from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorhelpers/appError";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from "axios";
import { Payment } from "../payment/payment.model";

const initPayment = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.SSL_COMMERZ_ID,
      store_passwd: envVars.SSL.SSL_COMMERZ_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transitionID,
      success_url: `${envVars.SSL.SSL_COMMERZ_BACKEND_SUCCESS_URL}?transitionId=${payload.transitionID}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_COMMERZ_BACKEND_FAILED_URL}?transitionId=${payload.transitionID}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVars.SSL.SSL_COMMERZ_BACKEND_CANCEL_URL}?transitionId=${payload.transitionID}&amount=${payload.amount}&status=cancel`,
      ipn_url:`${envVars.SSL.SSL_COMMERZ_VALIDATE_URL}`,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: "N/A",
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone: payload.phone,
      cus_fax: "01700000000",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: envVars.SSL.SSL_COMMERZ_PAYMENT_API,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(httpStatusCode.BAD_REQUEST, error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePayment = async (payload: any) => {
  const response = await axios({
    method: "GET",
    url: `${envVars.SSL.SSL_COMMERZ_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.SSL_COMMERZ_ID}&store_passwd=${envVars.SSL.SSL_COMMERZ_PASS}`,
  });

  await Payment.findOneAndUpdate(
    { transitionId: payload.tran_id},
    { paymentGateWayData: response.data},
    { runValidators: true}
  );
};

export const sslCommerzServices = {
  initPayment,
  validatePayment,
};
