import { Router } from "express";
import { userControllers } from "./user.controller";
import { validationRequest } from "../../middlewares/validationRequest";
import { createZodSchema } from "./user.validates";
import { checkAuth } from "../../middlewares/checkAuth";
import { IRole } from "./user.interface";

const router = Router()

router.post("/register", validationRequest(createZodSchema), userControllers.createUser)

router.get("/all-users", checkAuth(IRole.ADMIN), userControllers.getAllUser)

export const userRoutes = router