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
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
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
