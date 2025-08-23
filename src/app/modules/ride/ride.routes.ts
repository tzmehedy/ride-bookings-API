import { Router } from "express";
import { rideControllers } from "./ride.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.post("/request", checkAuth(IRole.RIDER), rideControllers.requestRide)
router.patch("/:id", checkAuth(IRole.DRIVER), rideControllers.updateRideStatus)
router.get("/me/:id", checkAuth(IRole.RIDER), rideControllers.rideMe)

export const rideRoutes = router