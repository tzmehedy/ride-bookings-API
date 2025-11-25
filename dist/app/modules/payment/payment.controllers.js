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
exports.paymentControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const payment_services_1 = require("./payment.services");
const env_1 = require("../../config/env");
const sendResponse_1 = require("../../utils/sendResponse");
const sslCommerz_services_1 = require("../sslcommerz/sslCommerz.services");
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.rideId;
    const paymentURL = yield payment_services_1.paymentServices.initPayment(rideId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Payment Url get successfully.",
        data: {
            paymentURL
        }
    });
}));
const validatePayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sslCommerz_services_1.sslCommerzServices.validatePayment(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "The payment successfully validated.",
        data: null
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.paymentServices.successPayment(query);
    if (result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_COMMERZ_FRONTEND_SUCCESS_URL}?transitionId=${result.data.transitionId}&paymentStatus=${result.data.paymentStatus}&price=${result.data.amount}`);
    }
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.paymentServices.failPayment(query);
    if (!result.success) {
        res.redirect(env_1.envVars.SSL.SSL_COMMERZ_FRONTEND_FAILED_URL);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.paymentServices.cancelPayment(query);
    if (!result.success) {
        res.redirect(env_1.envVars.SSL.SSL_COMMERZ_FRONTEND_CANCEL_URL);
    }
}));
exports.paymentControllers = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    validatePayment,
};
