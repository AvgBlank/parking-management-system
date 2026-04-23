import { Request, Response, NextFunction } from "express";
import { OK, BAD_REQUEST } from "@/constants/httpStatusCodes";
import { IPaymentService } from "./payment.service";
import AppError from "@/utils/AppError";

class PaymentController {
  constructor(private paymentService: IPaymentService) {}

  public getMyPayments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new AppError(BAD_REQUEST, "User missing");

      const payments = await this.paymentService.handleGetMyPayments(userId);
      res.status(OK).json({ payments });
    } catch (error) {
      next(error);
    }
  };

  public getAllPayments = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payments = await this.paymentService.handleGetAllPayments();
      res.status(OK).json({ payments });
    } catch (error) {
      next(error);
    }
  };

  public payBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const bookingId = req.params.bookingId as string;
      if (!userId) throw new AppError(BAD_REQUEST, "User missing");
      if (!bookingId) throw new AppError(BAD_REQUEST, "Booking ID is required");

      const result = await this.paymentService.handlePayBooking(
        userId,
        bookingId
      );
      res.status(OK).json(result);
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(BAD_REQUEST, error.message || "Payment failed"));
      } else {
        next(new AppError(BAD_REQUEST, "Payment failed"));
      }
    }
  };
}

export default PaymentController;
