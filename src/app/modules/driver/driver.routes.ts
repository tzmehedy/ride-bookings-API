import { Router } from "express";
import { DriverControllers } from "./driver.controller";

const router = Router()

router.post("/register", DriverControllers.createDriver)


export const driverRoutes = router

