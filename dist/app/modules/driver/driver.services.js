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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("./driver.model");
const driver_interface_1 = require("./driver.interface");
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const user_interface_1 = require("../user/user.interface");
const createDriver = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = payload;
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "The user does not exist...!!!");
    }
    yield user_model_1.User.findByIdAndUpdate(userId, { role: user_interface_1.IRole.DRIVER }, { new: true });
    const driverInfo = (yield driver_model_1.Driver.create(payload));
    return driverInfo;
});
const getAllDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    const allDrivers = yield driver_model_1.Driver.find().populate("userId");
    return allDrivers;
});
const driverApproval = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDoc = {
        approval_status: driver_interface_1.IApprovalStatus.Accept
    };
    const updatedDriverInfo = yield driver_model_1.Driver.findByIdAndUpdate(userId, updatedDoc, { new: true });
    return updatedDriverInfo;
});
exports.DriverServices = {
    createDriver,
    driverApproval,
    getAllDrivers,
};
