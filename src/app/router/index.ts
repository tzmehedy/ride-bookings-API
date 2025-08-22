import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { driverRoutes } from "../modules/driver/driver.routes";
import { rideRoutes } from "../modules/ride/ride.routes";

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
    }
]

moduleRoutes.forEach(route=> router.use(route.path, route.route))