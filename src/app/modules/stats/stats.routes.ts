import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { IRole } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = Router()

router.get("/driver", checkAuth(IRole.DRIVER), StatsControllers.getDriverStats)
router.get("/admin", checkAuth(IRole.ADMIN),StatsControllers.getAdminStats )


export const statsRoutes = router