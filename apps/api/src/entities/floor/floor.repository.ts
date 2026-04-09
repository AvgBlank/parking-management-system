import prisma from "@/lib/prisma";
import { DBFloor } from "@/entities/floor/floor.types";

export interface IFloorRepository {
  getFloorsByLotId(id: string): Promise<DBFloor[]>;
  createFloor(data: { name: string }): Promise<DBFloor>;
  deleteFloor(floorId: string): Promise<void>;
}

export class PrismaFloorRepository implements IFloorRepository {
  public constructor() {}

  public async getFloorsByLotId(id: string) {
    return await prisma.floor.findMany({
      where: {
        parkingLotId: id,
      },
    });
  }

  public async createFloor(data: { name: string; parkingLotId: string }) {
    const { name, parkingLotId } = data;
    const floors = await this.getFloorsByLotId(parkingLotId);
    const totalFloors = floors.length;

    return await prisma.floor.create({
      data: {
        name,
        level: totalFloors + 1,
        parkingLotId: parkingLotId,
      },
    });
  }

  public async deleteFloor(floorId: string) {
    await prisma.floor.deleteMany({
      where: { id: floorId },
    });
  }
}
