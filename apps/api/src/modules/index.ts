import { Router } from "express";

import authRouter from "@/modules/auth/auth.router";
import adminRouter from "@/modules/admin/admin.router";
import vehicleRouter from "@/modules/vehicle/vehicle.router";

const router = Router()
  .use("/auth", authRouter)
  .use("/admin", adminRouter)
  .use("/vehicle", vehicleRouter);

export default router;
