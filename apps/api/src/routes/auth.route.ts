import { Router } from "express";
import { Route } from "@/app";
import AuthController from "@/controllers/auth.controller";

class AuthRoute implements Route {
  public path = "/api/auth";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.authController.register);
    this.router.post(`${this.path}/login`, this.authController.login);
  }
}

export default AuthRoute;
