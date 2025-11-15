import { Router } from "express";
import { rideControllers } from "./ride.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()




router.post("/request", checkAuth(IRole.RIDER), rideControllers.requestRide)
router.post("/update-status/:id", checkAuth(IRole.DRIVER, IRole.ADMIN), rideControllers.updateRideStatus)
router.post("/cancel/:id", checkAuth(IRole.DRIVER, IRole.RIDER), rideControllers.cancelRide)
router.get("/me", checkAuth(IRole.RIDER), rideControllers.rideMe)
router.get("/requested-rides", checkAuth(IRole.DRIVER), rideControllers.getRequestedRides)



export const rideRoutes = router