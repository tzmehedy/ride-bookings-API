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
exports.DriverServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("./driver.model");
const driver_interface_1 = require("./driver.interface");
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const mongoose_1 = __importDefault(require("mongoose"));
const ride_model_1 = require("../ride/ride.model");
const ride_interface_1 = require("../ride/ride.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_services_1 = require("../sslcommerz/sslCommerz.services");
const env_1 = require("../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../user/user.model");
// import { IRole } from "../user/user.interface";
const generateTransitionId = () => {
    return `transId_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};
const createDriver = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = payload;
    const isUserExist = yield driver_model_1.Driver.findOne({ userId });
    if (isUserExist && isUserExist.approval_status === driver_interface_1.IApprovalStatus.Pending) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "You already requested for drive. Please wait until admin will approve you.");
    }
    if (isUserExist && isUserExist.approval_status === driver_interface_1.IApprovalStatus.Accept) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Your request for drive already accepted.");
    }
    if (isUserExist && isUserExist.approval_status === driver_interface_1.IApprovalStatus.Reject) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Your request is rejected.");
    }
    // await User.findByIdAndUpdate(userId, { role: IRole.DRIVER }, { new: true });
    const driverInfo = yield driver_model_1.Driver.create(payload);
    return driverInfo;
});
const getRequestedDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    const requestedDrivers = yield driver_model_1.Driver.find({ approval_status: driver_interface_1.IApprovalStatus.Pending }).populate("userId", "name email phone");
    return requestedDrivers;
});
const driverApproval = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDoc = {
        approval_status: status,
    };
    const updatedDriverInfo = yield driver_model_1.Driver.findByIdAndUpdate(userId, updatedDoc, {
        new: true,
    });
    return updatedDriverInfo;
});
const getSingleDriver = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driverInfo = yield driver_model_1.Driver.findOne({ userId })
        .populate("userId", "name email phone")
        .populate({
        path: "rideId",
        populate: {
            path: "user payment",
            select: "name email phone paymentStatus",
        },
        options: {
            sort: { createdAt: -1 }
        }
    });
    return driverInfo;
});
const setAvailability = (driverId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDriverInfo = yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, {
        online_status: status,
    }, { new: true });
    return updatedDriverInfo;
});
const viewMyEarning = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driverInfo = yield driver_model_1.Driver.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(driverId) } },
        {
            $lookup: {
                from: "rides",
                localField: "rideId",
                foreignField: "_id",
                as: "ridesData",
            },
        },
        {
            $unwind: "$ridesData",
        },
        {
            $match: {
                "ridesData.ride_status": "Completed",
            },
        },
        {
            $group: {
                _id: "$_id",
                totalEarnings: { $sum: "$ridesData.price" },
                totalCompletedRides: { $sum: 1 },
            },
        },
    ]);
    return driverInfo[0];
});
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const driverInfo = yield driver_model_1.Driver.findOne({ userId: driverId });
        if (!driverInfo) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Forbidden Access");
        }
        if ((driverInfo === null || driverInfo === void 0 ? void 0 : driverInfo.availability) === false) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already in a ride. Please complete your ride first, then try another ride.");
        }
        if ((driverInfo === null || driverInfo === void 0 ? void 0 : driverInfo.online_status) === driver_interface_1.IIsActive.InActive) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are in inactive mode please turn on your Active mode.");
        }
        yield driver_model_1.Driver.findByIdAndUpdate(driverInfo === null || driverInfo === void 0 ? void 0 : driverInfo._id, {
            rideId: [...driverInfo.rideId, rideId],
            availability: false,
        }, { new: true, runValidators: true, session });
        const updateRiderInfo = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
            driver: driverInfo._id,
            ride_status: ride_interface_1.RideStatus.Accepted,
        }, { new: true, runValidators: true, session });
        const transitionId = generateTransitionId();
        const paymentInfo = yield payment_model_1.Payment.create([{
                ride: updateRiderInfo === null || updateRiderInfo === void 0 ? void 0 : updateRiderInfo._id,
                transitionId,
                amount: updateRiderInfo === null || updateRiderInfo === void 0 ? void 0 : updateRiderInfo.price,
            }], { session });
        const sslCommerzPayload = {
            amount: paymentInfo[0].amount,
            transitionID: paymentInfo[0].transitionId,
            name: (updateRiderInfo === null || updateRiderInfo === void 0 ? void 0 : updateRiderInfo.user).name,
            email: (updateRiderInfo === null || updateRiderInfo === void 0 ? void 0 : updateRiderInfo.user).email,
            phone: (updateRiderInfo === null || updateRiderInfo === void 0 ? void 0 : updateRiderInfo.user).phone,
        };
        const sslPaymentInfo = yield sslCommerz_services_1.sslCommerzServices.initPayment(sslCommerzPayload);
        yield payment_model_1.Payment.findByIdAndUpdate(paymentInfo[0]._id, {
            paymentUrl: sslPaymentInfo.GatewayPageURL
        }, { new: true, runValidators: true, session });
        const afterPaymentCreateUpdateRideInfo = yield ride_model_1.Ride.findByIdAndUpdate(updateRiderInfo === null || updateRiderInfo === void 0 ? void 0 : updateRiderInfo._id, {
            payment: paymentInfo[0]._id,
        }, { new: true, runValidators: true, session })
            .populate("user", "name email phone")
            .populate("driver", "approval_status online_status vehicle_info")
            .populate("payment");
        yield session.commitTransaction();
        session.endSession();
        return afterPaymentCreateUpdateRideInfo;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateDriverInfo = (userId, updatedDocForUserModel, updatedDocForDriverModel) => __awaiter(void 0, void 0, void 0, function* () {
    if (updatedDocForUserModel.password) {
        const hashedPassword = yield bcryptjs_1.default.hash(updatedDocForUserModel.password, env_1.envVars.SALT_COUNT);
        updatedDocForUserModel.password = hashedPassword;
    }
    yield user_model_1.User.findByIdAndUpdate(userId, updatedDocForUserModel, { new: true, runValidators: true });
    const updatedInfo = yield driver_model_1.Driver.findOneAndUpdate({ userId }, updatedDocForDriverModel, { new: true, runValidators: true });
    return updatedInfo;
});
exports.DriverServices = {
    createDriver,
    driverApproval,
    getRequestedDrivers,
    getSingleDriver,
    setAvailability,
    viewMyEarning,
    acceptRide,
    updateDriverInfo
};
