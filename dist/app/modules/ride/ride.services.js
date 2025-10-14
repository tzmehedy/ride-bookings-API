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
exports.rideServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const driver_model_1 = require("../driver/driver.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_services_1 = require("../sslcommerz/sslCommerz.services");
const payment_interface_1 = require("../payment/payment.interface");
const generateTransitionId = () => {
    return `transId_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};
const requestRide = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const allAvailableDriver = yield driver_model_1.Driver.find({
            approval_status: "Accept",
            online_status: "Active",
            availability: true,
        });
        const availableDriver = allAvailableDriver[0];
        if (!availableDriver) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Our All driver is busy now. Please try again.");
        }
        const isUserExist = yield ride_model_1.Ride.find({ user: userId });
        if (isUserExist) {
            isUserExist.forEach((r) => {
                if (r.ride_status !== ride_interface_1.RideStatus.Completed &&
                    r.ride_status !== ride_interface_1.RideStatus.Canceled) {
                    throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already in a ride.");
                }
            });
        }
        const transitionId = generateTransitionId();
        const rideRequestInfo = yield ride_model_1.Ride.create([Object.assign(Object.assign({}, payload), { user: userId, driver: availableDriver._id, ride_status: ride_interface_1.RideStatus.Accepted })], { session });
        yield driver_model_1.Driver.findByIdAndUpdate(availableDriver._id, {
            rideId: [...availableDriver.rideId, rideRequestInfo[0]._id],
            availability: false,
        }, { session });
        const paymentInfo = yield payment_model_1.Payment.create([{
                ride: rideRequestInfo[0]._id,
                transitionId,
                amount: rideRequestInfo[0].price,
            }], { session });
        const updatedRideInfo = yield ride_model_1.Ride.findByIdAndUpdate(rideRequestInfo[0]._id, {
            payment: paymentInfo[0]._id,
        }, { new: true, runValidators: true, session })
            .populate("user", "name email phone")
            .populate("driver", "approval_status online_status vehicle_info")
            .populate("payment");
        const sslCommerzPayload = {
            amount: (updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo.payment).amount,
            transitionID: (updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo.payment).transitionId,
            name: (updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo.user).name,
            email: (updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo.user).email,
            phone: (updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo.user).phone,
        };
        const sslPaymentInfo = yield sslCommerz_services_1.sslCommerzServices.initPayment(sslCommerzPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPaymentInfo.GatewayPageURL,
            rideInfo: updatedRideInfo,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateRideStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedInfo = yield ride_model_1.Ride.findByIdAndUpdate(id, { ride_status: status }, { new: true });
    return updatedInfo;
});
const rideMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const allRides = yield ride_model_1.Ride.find({ userId: id })
        .populate({ path: "userId", select: "name email phone" })
        .populate({
        path: "driverId",
        select: "userId vehicle_Info",
        populate: {
            path: "userId",
            select: "name email phone",
        },
    });
    return allRides;
});
const cancelRide = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const isRideExist = yield ride_model_1.Ride.findById(id);
        if (!isRideExist) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The ride does not exist.");
        }
        if (isRideExist.ride_status === ride_interface_1.RideStatus.In_Transit ||
            isRideExist.ride_status === ride_interface_1.RideStatus.Picked_Up) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already in a ride. You can't cancel the ride.");
        }
        if (isRideExist.ride_status === ride_interface_1.RideStatus.Completed) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already complete the ride.");
        }
        if (isRideExist.ride_status === ride_interface_1.RideStatus.Canceled) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already cancel the ride.");
        }
        const updatedRideInfo = yield ride_model_1.Ride.findByIdAndUpdate(id, { ride_status: ride_interface_1.RideStatus.Canceled }, { new: true, session });
        yield driver_model_1.Driver.findByIdAndUpdate(updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo.driver, {
            availability: true,
        }, { session });
        yield payment_model_1.Payment.findOneAndUpdate({ ride: updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo._id }, {
            paymentStatus: payment_interface_1.PaymentStatus.CANCEL
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return updatedRideInfo;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.rideServices = {
    requestRide,
    updateRideStatus,
    rideMe,
    cancelRide,
};
