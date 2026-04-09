import env from "@/constants/env";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { AuthGuardService } from "@/middleware/services/auth-guard.service";
import { PrismaSessionRepository } from "@/entities/session/session.repository";
import { JoseTokenService } from "@/services/token.service";
import VehicleController from "@/modules/vehicle/vehicle.controller";
import VehicleService from "@/modules/vehicle/vehicle.service";
import { PrismaVehicleRepository } from "@/entities/vehicle/vehicle.repository";

export function createVehicleModule() {
  const sessionRepository = new PrismaSessionRepository();
  const vehicleRepository = new PrismaVehicleRepository();

  const tokenService = new JoseTokenService(
    env.get("REFRESH_TOKEN_SECRET"),
    env.get("ACCESS_TOKEN_SECRET"),
  );

  const vehicleService = new VehicleService(vehicleRepository);

  const authGuardService = new AuthGuardService(
    tokenService,
    sessionRepository,
  );

  const vehicleController = new VehicleController(vehicleService);

  const authMiddleware = new AuthMiddleware(authGuardService, true);
  const authenticate = authMiddleware.authenticate;

  return {
    vehicleController,
    authenticate,
  };
}
