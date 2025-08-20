import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { driverRoutes } from "../modules/driver/driver.routes";

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
    }
]

moduleRoutes.forEach(route=> router.use(route.path, route.route))