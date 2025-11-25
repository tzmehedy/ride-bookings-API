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
exports.StatsControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const stats_services_1 = require("./stats.services");
const sendResponse_1 = require("../../utils/sendResponse");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDriverStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const driverId = decodedToken.userId;
    const driverStats = yield stats_services_1.StatsServices.getDriverStats(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "The Driver Stats Get Successfully.",
        data: driverStats
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAdminStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminStats = yield stats_services_1.StatsServices.getAdminStats();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "The Admin Stats Get Successfully.",
        data: adminStats
    });
}));
exports.StatsControllers = {
    getDriverStats,
    getAdminStats
};
