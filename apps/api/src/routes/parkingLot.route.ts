import { Router } from "express";
import { Route } from "@/app";
import ParkingLotController from "@/controllers/parkingLot.controller";

class ParkingLotRoute implements Route {
  public path = "/api/parking-lots";
  public router = Router();
  public parkingLotController = new ParkingLotController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.parkingLotController.getLots);
    this.router.get(`${this.path}/:id`, this.parkingLotController.getLotById);
    this.router.post(`${this.path}`, this.parkingLotController.createLot);
  }
}

export default ParkingLotRoute;
