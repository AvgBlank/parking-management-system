import { Request, Response, NextFunction } from "express";

class PaymentController {
  public processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: "Process payment not implemented yet" });
    } catch (error) {
      next(error);
    }
  };
}

export default PaymentController;
