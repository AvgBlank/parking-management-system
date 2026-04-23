import { Router } from "express";

import authRouter from "@/modules/auth/auth.router";
import adminRouter from "@/modules/admin/admin.router";
import vehicleRouter from "@/modules/vehicle/vehicle.router";
import bookingRouter from "@/modules/booking/booking.router";
import paymentRouter from "@/modules/payment/payment.router";

const router = Router()
  .use("/auth", authRouter)
  .use("/admin", adminRouter)
  .use("/vehicle", vehicleRouter)
  .use("/booking", bookingRouter)
  .use("/payment", paymentRouter);

export default router;
