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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const driver_model_1 = require("../driver/driver.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interface_1 = require("../payment/payment.interface");
const driver_interface_1 = require("../driver/driver.interface");
const user_model_1 = require("../user/user.model");
const requestRide = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const isUserExist = yield ride_model_1.Ride.find({ user: userId });
        if (isUserExist) {
            isUserExist.forEach((r) => {
                if (r.ride_status !== ride_interface_1.RideStatus.Completed &&
                    r.ride_status !== ride_interface_1.RideStatus.Canceled) {
                    throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already in a ride.");
                }
            });
        }
        const rideRequestInfo = yield ride_model_1.Ride.create([
            Object.assign(Object.assign({}, payload), { user: userId, ride_status: ride_interface_1.RideStatus.Requested }),
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return rideRequestInfo;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateRideStatus = (rideId, status, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (status === ride_interface_1.RideStatus.Completed) {
        yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, {
            availability: true
        });
        const rideInfo = yield ride_model_1.Ride.findById(rideId);
        if ((rideInfo === null || rideInfo === void 0 ? void 0 : rideInfo.paymentMethod) === "Cash") {
            yield payment_model_1.Payment.findOneAndUpdate({ ride: rideId }, {
                paymentStatus: payment_interface_1.PaymentStatus.PAID
            });
        }
    }
    const updatedInfo = yield ride_model_1.Ride.findByIdAndUpdate(rideId, { ride_status: status }, { new: true });
    return updatedInfo;
});
const rideMe = (id, query) => __awaiter(void 0, void 0, void 0, function* () {
    const size = Number(query.size);
    const page = Number(query.page);
    const searchTerm = query.searchTerm || "";
    const sortByDate = query.sortByDate || "";
    const rideStatus = query.rideStatus || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseQuery = { user: id };
    if (rideStatus) {
        baseQuery.ride_status = rideStatus;
    }
    if (searchTerm) {
        baseQuery.$or = [
            { destination_address: { $regex: searchTerm, $options: "i" } },
            { pickup_address: { $regex: searchTerm, $options: "i" } }
        ];
    }
    const allRides = yield ride_model_1.Ride.find(baseQuery)
        .skip(size * (page - 1))
        .limit(size)
        .sort({ createdAt: sortByDate === "asc" ? 1 : -1 })
        .populate({ path: "user", select: "name email phone" })
        .populate({
        path: "driver",
        select: "vehicle_info",
        populate: {
            path: "userId",
            select: "name email phone",
        },
    })
        .populate("payment");
    const totalDocument = yield ride_model_1.Ride.find({ user: id }).countDocuments();
    return {
        allRides: allRides,
        meta: {
            numberOfTotalRides: totalDocument
        }
    };
});
const cancelRide = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const isRideExist = yield ride_model_1.Ride.findById(id);
        const paymentInfo = yield payment_model_1.Payment.findOne({ ride: id });
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
        if ((paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.paymentStatus) === payment_interface_1.PaymentStatus.PAID ||
            (paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.paymentStatus) === payment_interface_1.PaymentStatus.CANCEL) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already pay for the ride, so you can not cancel this ride.To cancel this ride please contact with customer care service 16120");
        }
        const updatedRideInfo = yield ride_model_1.Ride.findByIdAndUpdate(id, { ride_status: ride_interface_1.RideStatus.Canceled }, { runValidators: true, new: true, session });
        yield driver_model_1.Driver.findByIdAndUpdate(updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo.driver, {
            availability: true,
        }, { session });
        yield payment_model_1.Payment.findOneAndUpdate({ ride: updatedRideInfo === null || updatedRideInfo === void 0 ? void 0 : updatedRideInfo._id }, {
            paymentStatus: payment_interface_1.PaymentStatus.CANCEL,
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
const getRequestedRides = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isDriverApproved = yield driver_model_1.Driver.findOne({ userId });
    if ((isDriverApproved === null || isDriverApproved === void 0 ? void 0 : isDriverApproved.approval_status) !== driver_interface_1.IApprovalStatus.Accept) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not approved for driver.");
    }
    const requestedRides = yield ride_model_1.Ride.find({ ride_status: "Requested" }).populate("user", "name email phone");
    return requestedRides;
});
// "driver", "approval_status online_status availability"
const getAllRides = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = query.searchTerm || "";
    const ride_status = query.ride_status || "";
    const date = query.date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseQuery = {};
    if (ride_status) {
        baseQuery.ride_status = ride_status;
    }
    if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        baseQuery.createdAt = {
            $gte: start,
            $lte: end,
        };
    }
    if (searchTerm) {
        const userIds = yield user_model_1.User.find({
            $or: [
                {
                    name: { $regex: searchTerm, $options: "i" }
                },
                {
                    email: { $regex: searchTerm, $options: "i" }
                }
            ]
        }).select("_id");
        const driverIds = yield driver_model_1.Driver.find({
            userId: { $in: userIds }
        }).select("_id");
        baseQuery.$or = [
            { user: { $in: userIds } },
            {
                driver: { $in: driverIds }
            }
        ];
    }
    const allRides = yield ride_model_1.Ride.find(baseQuery)
        .populate("user", "name email phone")
        .populate({
        path: "driver",
        select: "userId approval_status online_status availability",
        populate: {
            path: "userId",
            select: "name email phone"
        }
    })
        .populate("payment", "paymentStatus transitionId");
    return allRides;
});
exports.rideServices = {
    requestRide,
    updateRideStatus,
    rideMe,
    cancelRide,
    getRequestedRides,
    getAllRides
};
