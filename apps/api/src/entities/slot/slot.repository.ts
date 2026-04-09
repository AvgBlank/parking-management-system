import prisma from "@/lib/prisma";
import { DBSlot } from "@/entities/slot/slot.types";

export interface ISlotRepository {
  createSlot(data: {
    slotCode: string;
    slotType:
      | "standard"
      | "compact"
      | "handicapped"
      | "ev_charging"
      | undefined;
    status: "available" | "reserved" | "occupied" | "inactive" | undefined;
    floorId: string;
  }): Promise<DBSlot>;
  deleteSlot(slotId: string): Promise<void>;
}

export class PrismaSlotRepository implements ISlotRepository {
  public constructor() {}

  public async createSlot(data: {
    slotCode: string;
    slotType:
      | "standard"
      | "compact"
      | "handicapped"
      | "ev_charging"
      | undefined;
    status: "available" | "reserved" | "occupied" | "inactive" | undefined;
    floorId: string;
  }) {
    const { slotCode, slotType, status, floorId } = data;

    return await prisma.slot.create({
      data: {
        slotCode,
        slotType,
        status,
        floor: {
          connect: { id: floorId },
        },
      },
      include: {
        bookings: true,
      },
    });
  }

  public async deleteSlot(slotId: string) {
    await prisma.slot.deleteMany({
      where: { id: slotId },
    });
  }
}
