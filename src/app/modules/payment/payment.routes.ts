import { Router } from "express";
import { paymentControllers } from "./payment.controllers";

const router = Router()
router.post("/init-payment/:rideId", paymentControllers.initPayment)
router.post("/success", paymentControllers.successPayment)
router.post("/cancel", paymentControllers.cancelPayment)
router.post("/failed", paymentControllers.failPayment)
router.post("/validate-payment", paymentControllers.validatePayment)


export const paymentRoutes = router