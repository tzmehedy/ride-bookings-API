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
exports.userControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_services_1 = require("./user.services");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const createUser = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = yield user_services_1.userServices.createUser(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const users = yield user_services_1.userServices.getAllUser(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All user retrieve successfully..!!",
        data: users,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const blockedUnblockedUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { blockStatus } = req.body;
    const blockedUserInfo = yield user_services_1.userServices.blockedUnblockedUser(id, blockStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The user is successfully blocked",
        data: blockedUserInfo
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const result = yield user_services_1.userServices.getMe(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Successfully user info retrieve.",
        data: result
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    let updatedDoc = req.body;
    const { password } = updatedDoc, rest = __rest(updatedDoc, ["password"]);
    if (password === "") {
        updatedDoc = rest;
    }
    const result = yield user_services_1.userServices.updateUser(userId, updatedDoc);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Successfully user info retrieve.",
        data: result
    });
}));
exports.userControllers = {
    createUser,
    getAllUser,
    blockedUnblockedUser,
    getMe,
    updateUser
};
