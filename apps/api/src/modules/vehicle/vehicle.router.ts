import { Router } from "express";
import rateLimit from "express-rate-limit";

import env from "@/constants/env";
import { createVehicleModule } from "@/modules/vehicle/vehicle.container";

const { vehicleController, authenticate } = createVehicleModule();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: env.get("NODE_ENV") === "production" ? 200 : 10000,
  message: {
    error: "Too many requests, please try again later.",
  },
  skipSuccessfulRequests: true,
});

const vehicleRouter = Router()
  .use(limiter)
  .use(authenticate)
  .post("/", vehicleController.registerVehicle)
  .get("/", vehicleController.getVehicles)
  .get("/:id", vehicleController.getVehicleById)
  .delete("/", vehicleController.deleteVehicle);

export default vehicleRouter;
