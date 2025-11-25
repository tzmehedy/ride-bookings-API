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
exports.rideControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const ride_services_1 = require("./ride.services");
const sendResponse_1 = require("../../utils/sendResponse");
const requestRide = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const rideRequestInfo = yield ride_services_1.rideServices.requestRide(req.body, decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The ride request successfully requested.",
        data: rideRequestInfo,
    });
}));
const updateRideStatus = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const status = req.body.status;
    const decodedToken = req.user;
    const driverId = decodedToken.userId;
    const updatedInfo = yield ride_services_1.rideServices.updateRideStatus(rideId, status, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The ride status update successfully",
        data: updatedInfo,
    });
}));
const rideMe = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = decodedToken.userId;
    const query = req.query;
    const allRideMe = yield ride_services_1.rideServices.rideMe(id, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All ride retrieve successfully.",
        data: allRideMe,
    });
}));
const cancelRide = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const updatedRideInfo = yield ride_services_1.rideServices.cancelRide(rideId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The ride successfully canceled.",
        data: updatedRideInfo,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRequestedRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const requestedRides = yield ride_services_1.rideServices.getRequestedRides(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "The ride requested retrieve successfully.",
        data: requestedRides
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const allRides = yield ride_services_1.rideServices.getAllRides(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Rides Retrieve Successfully",
        data: allRides
    });
}));
exports.rideControllers = {
    requestRide,
    updateRideStatus,
    rideMe,
    cancelRide,
    getRequestedRides,
    getAllRides
};
