import { Request, Response, NextFunction } from "express";

class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ message: "Register user not implemented yet" });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: "Login user not implemented yet" });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
