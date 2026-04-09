import type { RequestHandler } from "express";

import { IVehicleService } from "@/modules/vehicle/vehicle.service";
import {
  createVehicleSchema,
  getVehicleByIdSchema,
} from "@/modules/vehicle/vehicle.schemas";
import { CREATED, NOT_FOUND, OK } from "@/constants/httpStatusCodes";
import AppError from "@/utils/AppError";

class VehicleController {
  public constructor(private vehicleService: IVehicleService) {}

  public registerVehicle: RequestHandler = async (req, res) => {
    const { licencePlate, model } = createVehicleSchema.parse(req.body);
    const userId = req.user!.id as string;

    const newVehicle = await this.vehicleService.handleRegisterVehicle({
      licencePlate,
      model,
      userId,
    });

    res.status(CREATED).json({
      vehicle: newVehicle,
      message: "Vehicle registered successfully",
    });
  };

  public getVehicles: RequestHandler = async (req, res) => {
    const userId = req.user!.id as string;

    const vehicles =
      await this.vehicleService.handleGetVehiclesByUserId(userId);

    res.json({ vehicles });
  };

  public getVehicleById: RequestHandler = async (req, res) => {
    const { vehicleId } = getVehicleByIdSchema.parse(req.params);

    const vehicle = await this.vehicleService.handleGetVehicleById(vehicleId);
    if (!vehicle) {
      throw new AppError(NOT_FOUND, "Vehicle not found");
    }

    res.json({ vehicle });
  };

  public deleteVehicle: RequestHandler = async (req, res) => {
    const { vehicleId } = getVehicleByIdSchema.parse(req.body);

    await this.vehicleService.handleDeleteVehicle(vehicleId);

    res.status(OK).json({
      message: "Vehicle deleted successfully",
    });
  };
}

export default VehicleController;
