import env from "@/constants/env";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { AuthGuardService } from "@/middleware/services/auth-guard.service";
import AdminController from "@/modules/admin/admin.controller";
import AdminService from "@/modules/admin/admin.service";
import { PrismaSessionRepository } from "@/entities/session/session.repository";
import { JoseTokenService } from "@/services/token.service";
import { PrismaUserRepository } from "@/entities/user/user.repository";
import { PrismaFloorRepository } from "@/entities/floor/floor.repository";
import { PrismaSlotRepository } from "@/entities/slot/slot.repository";
import { PrismaParkingLotRepository } from "@/entities/parking-lot/parking-lot.repository";

export function createAdminModule() {
  const userRepository = new PrismaUserRepository();
  const sessionRepository = new PrismaSessionRepository();
  const slotRepository = new PrismaSlotRepository();
  const floorRepository = new PrismaFloorRepository();
  const parkingLotRepository = new PrismaParkingLotRepository();

  const tokenService = new JoseTokenService(
    env.get("REFRESH_TOKEN_SECRET"),
    env.get("ACCESS_TOKEN_SECRET"),
  );

  const adminService = new AdminService(
    userRepository,
    floorRepository,
    slotRepository,
    parkingLotRepository,
  );

  const authGuardService = new AuthGuardService(
    tokenService,
    sessionRepository,
  );

  const adminController = new AdminController(adminService);

  const adminMiddleware = new AuthMiddleware(authGuardService, true);
  const adminAuthenticate = adminMiddleware.authenticate;

  return {
    adminController,
    adminAuthenticate,
  };
}
