import type { RequestHandler } from "express";

import { IAdminService } from "@/modules/admin/admin.service";
import {
  createFloorSchema,
  createParkingLotSchema,
  createSlotSchema,
} from "@/modules/admin/admin.schemas";
import { CREATED } from "@/constants/httpStatusCodes";

class AdminController {
  public constructor(private adminServce: IAdminService) {}

  public getUsers: RequestHandler = async (_req, res) => {
    const users = await this.adminServce.handleGetUsers();

    res.json({ users });
  };

  public createFloor: RequestHandler = async (req, res) => {
    const { name } = createFloorSchema.parse(req.body);

    const newFloor = await this.adminServce.handleCreateFloor({ name });

    res.status(CREATED).json({ floor: newFloor });
  };

  public createSlot: RequestHandler = async (req, res) => {
    const { slotCode, slotType, status, floorId } = createSlotSchema.parse(
      req.body,
    );

    const newSlot = await this.adminServce.handleCreateSlot({
      slotCode,
      slotType,
      status,
      floorId,
    });

    res.status(CREATED).json({ slot: newSlot });
  };

  public createParkingLot: RequestHandler = async (req, res) => {
    const { name, address } = createParkingLotSchema.parse(req.body);

    const newParkingLot = await this.adminServce.handleCreateParkingLot({
      name,
      address,
    });

    res.status(CREATED).json({ parkingLot: newParkingLot });
  };
}

export default AdminController;
