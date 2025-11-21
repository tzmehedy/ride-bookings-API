import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { driverRoutes } from "../modules/driver/driver.routes";
import { rideRoutes } from "../modules/ride/ride.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { statsRoutes } from "../modules/stats/stats.routes";

export const router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/drivers",
        route: driverRoutes
    },
    {
        path: "/rides",
        route: rideRoutes
    },
    {
        path: "/payment",
        route: paymentRoutes
    },
    {
        path: "/stats",
        route: statsRoutes
    },
]

moduleRoutes.forEach(route=> router.use(route.path, route.route))