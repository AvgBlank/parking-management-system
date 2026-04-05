import { Request, Response, NextFunction } from "express";

class BookingController {
  public createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ message: "Create booking not implemented yet" });
    } catch (error) {
      next(error);
    }
  };

  public getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: `Get booking by id ${req.params.id} not implemented yet` });
    } catch (error) {
      next(error);
    }
  };
  
  public cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: `Cancel booking by id ${req.params.id} not implemented yet` });
    } catch (error) {
      next(error);
    }
  };
}

export default BookingController;
