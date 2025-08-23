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
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    if (userId !== req.body.userId) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Forbidden Access.");
    }
    const rideRequestInfo = yield ride_services_1.rideServices.requestRide(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The ride request successfully requested.",
        data: rideRequestInfo
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateRideStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const status = req.query.status;
    const updatedInfo = yield ride_services_1.rideServices.updateRideStatus(id, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The ride status update successfully",
        data: updatedInfo
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rideMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (req.user.userId !== id) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Forbidden Access.");
    }
    const allRideMe = yield ride_services_1.rideServices.rideMe(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All ride retrieve successfully.",
        data: allRideMe
    });
}));
exports.rideControllers = {
    requestRide,
    updateRideStatus,
    rideMe,
};
