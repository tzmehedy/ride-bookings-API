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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTokens = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const createUserTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = yield (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET_KEY, env_1.envVars.JWT_ACCESS_EXPIRES_IN);
    const refreshToken = yield (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET_KEY, env_1.envVars.JWT_REFRESH_EXPIRES_IN);
    return {
        accessToken,
        refreshToken,
    };
});
exports.createUserTokens = createUserTokens;
