import { Router } from "express";
import { rideControllers } from "./ride.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.post("/request", checkAuth(IRole.RIDER), rideControllers.requestRide)
router.post("/:id", checkAuth(IRole.DRIVER, IRole.ADMIN), rideControllers.updateRideStatus)
router.get("/me/:id", checkAuth(IRole.RIDER), rideControllers.rideMe)
router.post("/cancel/:id", checkAuth(IRole.DRIVER, IRole.RIDER), rideControllers.cancelRide)

export const rideRoutes = router