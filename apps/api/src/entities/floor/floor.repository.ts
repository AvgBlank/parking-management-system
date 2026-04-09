import prisma from "@/lib/prisma";
import { DBFloor } from "@/entities/floor/floor.types";

export interface IFloorRepository {
  getFloorsByLotId(id: string): Promise<DBFloor[]>;
  createFloor(data: { name: string }): Promise<DBFloor>;
}

export class PrismaFloorRepository implements IFloorRepository {
  public constructor() {}

  async getFloorsByLotId(id: string) {
    return await prisma.floor.findMany({
      where: {
        parkingLotId: id,
      },
    });
  }

  async createFloor(data: { name: string; parkingLotId: string }) {
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
}
