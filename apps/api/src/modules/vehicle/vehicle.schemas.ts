import { z } from "zod";

export const createVehicleSchema = z.object({
  licencePlate: z.string().min(1, "Licence plate is required"),
  model: z.string().optional(),
});

export const getVehicleByIdSchema = z.object({
  vehicleId: z.uuid().min(1, "Vehicle ID is required"),
});
