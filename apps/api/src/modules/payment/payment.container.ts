import env from "@/constants/env";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { AuthGuardService } from "@/middleware/services/auth-guard.service";
import { PrismaSessionRepository } from "@/entities/session/session.repository";
import { PrismaPaymentRepository } from "@/entities/payment/payment.repository";
import { JoseTokenService } from "@/services/token.service";
import PaymentController from "./payment.controller";
import PaymentService from "./payment.service";

export function createPaymentModule() {
  const sessionRepository = new PrismaSessionRepository();
  const paymentRepository = new PrismaPaymentRepository();

  const tokenService = new JoseTokenService(
    env.get("REFRESH_TOKEN_SECRET"),
    env.get("ACCESS_TOKEN_SECRET")
  );

  const paymentService = new PaymentService(paymentRepository);

  const authGuardService = new AuthGuardService(tokenService, sessionRepository);

  const paymentController = new PaymentController(paymentService);

  const authMiddleware = new AuthMiddleware(authGuardService, false);
  const authenticate = authMiddleware.authenticate;

  return { paymentController, authenticate };
}
