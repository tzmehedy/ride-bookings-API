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
const requestRide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const allAvailableDriver = yield driver_model_1.Driver.find({
        approval_status: "Accept",
        online_status: "Active",
        availability: true,
    });
    const availableDriver = allAvailableDriver[0];
    if (!availableDriver) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Our All driver is busy now. Please try again.");
    }
    const isUserExist = yield ride_model_1.Ride.find({ userId: payload.userId });
    if (isUserExist) {
        isUserExist.forEach((r) => {
            if (r.ride_status !== ride_interface_1.RideStatus.Completed && r.ride_status !== ride_interface_1.RideStatus.Canceled) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already in a ride.");
            }
        });
    }
    const updatedRideInfo = Object.assign(Object.assign({}, payload), { driverId: availableDriver._id, ride_status: ride_interface_1.RideStatus.Accepted });
    const rideRequestInfo = yield ride_model_1.Ride.create(updatedRideInfo);
    yield driver_model_1.Driver.findByIdAndUpdate(availableDriver._id, {
        rideId: [...availableDriver.rideId, rideRequestInfo._id],
        availability: false,
    });
    return rideRequestInfo;
});
const updateRideStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (status === ride_interface_1.RideStatus.Picked_Up) {
        const updatedInfo = yield ride_model_1.Ride.findByIdAndUpdate(id, { ride_status: ride_interface_1.RideStatus.Picked_Up }, { new: true });
        return updatedInfo;
    }
    else if (status === ride_interface_1.RideStatus.In_Transit) {
        const updatedInfo = yield ride_model_1.Ride.findByIdAndUpdate(id, {
            ride_status: ride_interface_1.RideStatus.In_Transit,
        }, { new: true });
        return updatedInfo;
    }
    else if (status === ride_interface_1.RideStatus.Completed) {
        const updatedInfo = yield ride_model_1.Ride.findByIdAndUpdate(id, {
            ride_status: ride_interface_1.RideStatus.Completed,
        }, { new: true });
        yield driver_model_1.Driver.findByIdAndUpdate(updatedInfo === null || updatedInfo === void 0 ? void 0 : updatedInfo.driverId, {
            availability: true,
        });
        return updatedInfo;
    }
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
    const rideInfo = yield ride_model_1.Ride.findByIdAndUpdate(id, { ride_status: ride_interface_1.RideStatus.Canceled }, { new: true });
    yield driver_model_1.Driver.findByIdAndDelete(rideInfo === null || rideInfo === void 0 ? void 0 : rideInfo.driverId, { availability: true });
    return rideInfo;
});
exports.rideServices = {
    requestRide,
    updateRideStatus,
    rideMe,
    cancelRide,
};
