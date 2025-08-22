import { Router } from "express";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.post("/register/:id",checkAuth(IRole.RIDER), DriverControllers.createDriver)
router.patch("/approve/:id",checkAuth(IRole.ADMIN), DriverControllers.driverApproval)
router.get("/",checkAuth(IRole.ADMIN), DriverControllers.getAllDrivers)

export const driverRoutes = router

