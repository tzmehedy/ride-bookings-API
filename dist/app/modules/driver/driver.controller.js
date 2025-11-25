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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const driver_services_1 = require("./driver.services");
const sendResponse_1 = require("../../utils/sendResponse");
const jwt_1 = require("../../utils/jwt");
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const mongoose_1 = require("mongoose");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const { vehicle_info } = req.body;
    const accessToken = req.cookies.accessToken;
    const verifiedToken = (yield (0, jwt_1.verifyToken)(accessToken));
    if (verifiedToken.userId !== userId) {
        throw new appError_1.default(403, "Forbidden Access.");
    }
    const driverInfoPayload = {
        userId: new mongoose_1.Types.ObjectId(userId),
        vehicle_info,
    };
    const driverInfo = yield driver_services_1.DriverServices.createDriver(driverInfoPayload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "The driver created successfully completed.",
        data: driverInfo
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getRequestedDrivers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedDrivers = yield driver_services_1.DriverServices.getRequestedDrivers();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All requested driver retrieve successfully.",
        data: requestedDrivers
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const driverInfo = yield driver_services_1.DriverServices.getSingleDriver(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Single driver info get successfully",
        data: driverInfo
    });
}));
const driverApproval = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const status = req.query.status;
    const updatedDriverInfo = yield driver_services_1.DriverServices.driverApproval(userId, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The Driver is approve for driving.",
        data: updatedDriverInfo
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setAvailability = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const driverId = decodedToken.userId;
    const status = req.body.online_status;
    const updatedDriverInfo = yield driver_services_1.DriverServices.setAvailability(driverId, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your availability updated successfully.",
        data: updatedDriverInfo
    });
}));
const viewMyEarning = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.driverId;
    const driverInfo = yield driver_services_1.DriverServices.viewMyEarning(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your earning history get successfully.",
        data: driverInfo,
    });
}));
const acceptRide = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const driverId = decodedToken.userId;
    const rideId = req.params.id;
    const acceptedRideInfo = yield driver_services_1.DriverServices.acceptRide(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "The ride is successfully accepted.",
        data: acceptedRideInfo,
    });
}));
const updateDriverInfo = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    // eslint-disable-next-line prefer-const
    let { user_info: userUpdatedDoc, vehicle_info } = req.body;
    const { password } = userUpdatedDoc, rest = __rest(userUpdatedDoc, ["password"]);
    if (password === "") {
        userUpdatedDoc = rest;
    }
    const driverUpdatedDoc = {
        vehicle_info
    };
    const updatedDriverInfo = yield driver_services_1.DriverServices.updateDriverInfo(userId, userUpdatedDoc, driverUpdatedDoc);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Your Profile info is updated",
        data: updatedDriverInfo
    });
}));
exports.DriverControllers = {
    createDriver,
    driverApproval,
    getRequestedDrivers,
    setAvailability,
    viewMyEarning,
    getSingleDriver,
    acceptRide,
    updateDriverInfo
};
