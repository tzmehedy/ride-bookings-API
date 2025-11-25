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
exports.userServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorhelpers/appError"));
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exist...!!!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, env_1.envVars.SALT_COUNT);
    payload.password = hashedPassword;
    const userPayload = Object.assign(Object.assign({}, payload), { auths: [
            {
                providerId: payload.email,
                providerName: "Credentials",
            },
        ] });
    const user = yield user_model_1.User.create(userPayload);
    return user;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = query.searchTerm || "";
    const blocked_status = query.blocked_status || "";
    const role = query.role || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseQuery = { role: { $ne: "ADMIN" } };
    if (blocked_status) {
        baseQuery.isBlocked = blocked_status;
    }
    if (role) {
        baseQuery.role = role;
    }
    if (searchTerm) {
        baseQuery.$or = [
            {
                name: { $regex: searchTerm, $options: "i" }
            },
            {
                email: { $regex: searchTerm, $options: "i" }
            },
            {
                phone: { $regex: searchTerm, $options: "i" }
            }
        ];
    }
    const users = yield user_model_1.User.find(baseQuery);
    return users;
});
const blockedUnblockedUser = (id, blockStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUsersDoc = {
        isBlocked: blockStatus
    };
    const updatedUserInfo = yield user_model_1.User.findByIdAndUpdate(id, updatedUsersDoc, { new: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = updatedUserInfo === null || updatedUserInfo === void 0 ? void 0 : updatedUserInfo.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_model_1.User.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const updateUser = (id, updatedDoc) => __awaiter(void 0, void 0, void 0, function* () {
    if (updatedDoc.password) {
        const hashedPassword = yield bcryptjs_1.default.hash(updatedDoc.password, env_1.envVars.SALT_COUNT);
        updatedDoc.password = hashedPassword;
    }
    const updatedUserInfo = yield user_model_1.User.findByIdAndUpdate(id, updatedDoc, {
        new: true
    });
    return updatedUserInfo;
});
exports.userServices = {
    createUser,
    getAllUser,
    blockedUnblockedUser,
    getMe,
    updateUser
};
