import { Router } from "express";
import rateLimit from "express-rate-limit";
import env from "@/constants/env";
import { createPaymentModule } from "./payment.container";

const { paymentController, authenticate } = createPaymentModule();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: env.get("NODE_ENV") === "production" ? 200 : 10000,
  message: { error: "Too many requests, please try again later." },
  skipSuccessfulRequests: true,
});

const paymentRouter = Router()
  .use(limiter)
  .use(authenticate)
  // Driver routes
  .get("/my-payments", paymentController.getMyPayments)
  .post("/:bookingId/pay", paymentController.payBooking)
  // Admin route
  .get("/", paymentController.getAllPayments);

export default paymentRouter;
