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
exports.checkAuth = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../modules/user/user.model");
const appError_1 = __importDefault(require("../errorhelpers/appError"));
const checkAuth = (...AuthRole) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not login. Please login first");
        }
        const verifiedTokenInfo = yield (0, jwt_1.verifyToken)(accessToken);
        if (!verifiedTokenInfo) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not login. Please login first");
        }
        req.user = verifiedTokenInfo;
        const isUserExist = yield user_model_1.User.findOne({ email: verifiedTokenInfo.email });
        if (!isUserExist) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The user does not exist.");
        }
        if (isUserExist.isBlocked === true) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The user is blocked");
        }
        if (!AuthRole.includes(isUserExist.role)) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not permitted for this route.");
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
