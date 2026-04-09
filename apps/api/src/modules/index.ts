import { Router } from "express";

import authRouter from "@/modules/auth/auth.router";
import adminRouter from "@/modules/admin/admin.router";
import vehicleRouter from "@/modules/vehicle/vehicle.router";

const router = Router()
  .use("/api/auth", authRouter)
  .use("/api/admin", adminRouter)
  .use("/api/vehicle", vehicleRouter);

export default router;
