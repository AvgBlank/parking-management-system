import { z } from "zod";

export const createFloorSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const createSlotSchema = z.object({
  slotCode: z.string().min(1, "Slot code is required"),
  slotType: z
    .enum(["standard", "compact", "handicapped", "ev_charging"])
    .optional(),
  status: z.enum(["available", "reserved", "occupied", "inactive"]).optional(),
  floorId: z.uuid("Floor ID must be a valid UUID"),
});

export const createParkingLotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});
