import { Request, Response, NextFunction } from "express";
import { ApiResponseFactory } from "@/shared/utils/responseFactory";

class PaymentController {
  public processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      ApiResponseFactory.success(res, "Process payment not implemented yet");
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentController;
