import { Router } from "express";

import authRouter from "@/modules/auth/auth.router";
import adminRouter from "@/modules/admin/admin.router";

const router = Router()
  .use("/api/auth", authRouter)
  .use("/api/admin", adminRouter);

export default router;
