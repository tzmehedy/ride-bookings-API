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
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_services_1 = require("./auth.services");
const sendResponse_1 = require("../../utils/sendResponse");
const setCookies_1 = require("../../utils/setCookies");
const catchAsync_1 = require("../../utils/catchAsync");
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
const credentialsLogin = (0, catchAsync_1.catchAsync)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_services_1.AuthServices.credentialsLogin(req.body);
    (0, setCookies_1.setCookies)(res, loginInfo.userTokens);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The user login successfully...",
        data: loginInfo,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logOut = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Logged Out Successfully",
        data: null,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleCallback = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    const tokens = yield (0, userTokens_1.createUserTokens)(user);
    (0, setCookies_1.setCookies)(res, tokens);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
exports.AuthControllers = {
    credentialsLogin,
    logOut,
    googleCallback,
};
