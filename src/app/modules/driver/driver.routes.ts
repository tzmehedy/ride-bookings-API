import { Router } from "express";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.post("/register",checkAuth(IRole.DRIVER), DriverControllers.createDriver)
router.post("/approve/:id",checkAuth(IRole.ADMIN), DriverControllers.driverApproval)
router.get("/requested-driver",checkAuth(IRole.ADMIN), DriverControllers.getRequestedDrivers)
router.get("/me", checkAuth(IRole.DRIVER), DriverControllers.getSingleDriver)
router.post("/setAvailability/:driverId", checkAuth(IRole.DRIVER), DriverControllers.setAvailability)
router.get("/viewMyEarning/:driverId",checkAuth(IRole.DRIVER), DriverControllers.viewMyEarning)

export const driverRoutes = router

