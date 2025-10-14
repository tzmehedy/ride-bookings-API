"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslCommerzServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const axios_1 = __importDefault(require("axios"));
const payment_model_1 = require("../payment/payment.model");
const initPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: env_1.envVars.SSL.SSL_COMMERZ_ID,
            store_passwd: env_1.envVars.SSL.SSL_COMMERZ_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transitionID,
            success_url: `${env_1.envVars.SSL.SSL_COMMERZ_BACKEND_SUCCESS_URL}?transitionId=${payload.transitionID}&amount=${payload.amount}&status=success`,
            fail_url: `${env_1.envVars.SSL.SSL_COMMERZ_BACKEND_FAILED_URL}?transitionId=${payload.transitionID}&amount=${payload.amount}&status=fail`,
            cancel_url: `${env_1.envVars.SSL.SSL_COMMERZ_BACKEND_CANCEL_URL}?transitionId=${payload.transitionID}&amount=${payload.amount}&status=cancel`,
            ipn_url: `${env_1.envVars.SSL.SSL_COMMERZ_VALIDATE_URL}`,
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
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: env_1.envVars.SSL.SSL_COMMERZ_PAYMENT_API,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, axios_1.default)({
        method: "GET",
        url: `${env_1.envVars.SSL.SSL_COMMERZ_VALIDATION_API}?val_id=${payload.val_id}&store_id=${env_1.envVars.SSL.SSL_COMMERZ_ID}&store_passwd=${env_1.envVars.SSL.SSL_COMMERZ_PASS}`,
    });
    yield payment_model_1.Payment.findOneAndUpdate({ transitionId: payload.tran_id }, { paymentGateWayData: response.data }, { runValidators: true });
});
exports.sslCommerzServices = {
    initPayment,
    validatePayment,
};
