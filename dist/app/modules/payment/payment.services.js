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
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const ride_model_1 = require("../ride/ride.model");
const sslCommerz_services_1 = require("../sslcommerz/sslCommerz.services");
const initPayment = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const isPaymentExist = yield payment_model_1.Payment.findOne({ ride: rideId });
    if (!isPaymentExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment Does not exist.");
    }
    const rideInfo = yield ride_model_1.Ride.findById(rideId)
        .populate("user", "name email phone")
        .populate("driver", "approval_status online_status vehicle_info")
        .populate("payment");
    const sslCommerzPayload = {
        amount: (rideInfo === null || rideInfo === void 0 ? void 0 : rideInfo.payment).amount,
        transitionID: (rideInfo === null || rideInfo === void 0 ? void 0 : rideInfo.payment).transitionId,
        name: (rideInfo === null || rideInfo === void 0 ? void 0 : rideInfo.user).name,
        email: (rideInfo === null || rideInfo === void 0 ? void 0 : rideInfo.user).email,
        phone: (rideInfo === null || rideInfo === void 0 ? void 0 : rideInfo.user).phone,
    };
    const sslPaymentInfo = yield sslCommerz_services_1.sslCommerzServices.initPayment(sslCommerzPayload);
    return sslPaymentInfo.GatewayPageURL;
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_model_1.Payment.findOneAndUpdate({
        transitionId: query.transitionId,
    }, {
        paymentStatus: payment_interface_1.PaymentStatus.PAID
    });
    return {
        success: true,
        message: "Payment successfully completed."
    };
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_model_1.Payment.findOneAndUpdate({
        transitionId: query.transitionId,
    }, {
        paymentStatus: payment_interface_1.PaymentStatus.FAILED,
    });
    return {
        success: false,
        message: "Payment Failed.",
    };
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_model_1.Payment.findOneAndUpdate({
        transitionId: query.transitionId,
    }, {
        paymentStatus: payment_interface_1.PaymentStatus.CANCEL,
    });
    return {
        success: false,
        message: "Payment Cancel.",
    };
});
exports.paymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
};
