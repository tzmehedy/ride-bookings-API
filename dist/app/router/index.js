"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const driver_routes_1 = require("../modules/driver/driver.routes");
const ride_routes_1 = require("../modules/ride/ride.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.authRoutes
    },
    {
        path: "/drivers",
        route: driver_routes_1.driverRoutes
    },
    {
        path: "/rides",
        route: ride_routes_1.rideRoutes
    },
    {
        path: "/payment",
        route: payment_routes_1.paymentRoutes
    }
];
moduleRoutes.forEach(route => exports.router.use(route.path, route.route));
