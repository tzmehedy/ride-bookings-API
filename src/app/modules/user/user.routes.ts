import { Router } from "express";
import { userControllers } from "./user.controller";
import { validationRequest } from "../../middlewares/validationRequest";
import { createZodSchema } from "./user.validates";

const router = Router()

router.post("/register", validationRequest(createZodSchema), userControllers.createUser)

export const userRoutes = router