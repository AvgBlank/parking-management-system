import { Router } from "express";
import { Route } from "@/app";
import PaymentController from "@/controllers/payment.controller";

class PaymentRoute implements Route {
  public path = "/api/payments";
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.paymentController.processPayment);
  }
}

export default PaymentRoute;
