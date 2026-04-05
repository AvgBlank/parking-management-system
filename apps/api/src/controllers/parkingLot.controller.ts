import { Request, Response, NextFunction } from "express";

class ParkingLotController {
  public getLots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: "Get parking lots not implemented yet" });
    } catch (error) {
      next(error);
    }
  };

  public getLotById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: `Get parking lot by id ${req.params.id} not implemented yet` });
    } catch (error) {
      next(error);
    }
  };
  
  public createLot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ message: "Create parking lot not implemented yet" });
    } catch (error) {
      next(error);
    }
  };
}

export default ParkingLotController;
