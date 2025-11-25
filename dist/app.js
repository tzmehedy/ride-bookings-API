"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = require("./app/router");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const env_1 = require("./app/config/env");
require("./app/config/passport");
exports.app = (0, express_1.default)();
exports.app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: [env_1.envVars.FRONTEND_URL, "http://localhost:5173"],
    credentials: true
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use("/api/v1", router_1.router);
exports.app.get("/", (req, res) => {
    res.status(200).send({
        success: true,
        statusCode: true,
        message: "The ride bookings api is coming soon...."
    });
});
exports.app.use(globalErrorHandler_1.globalErrorHandler);
