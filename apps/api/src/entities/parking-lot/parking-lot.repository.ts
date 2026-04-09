import prisma from "@/lib/prisma";
import { DBParkingLot } from "./parking-lot.types";

export interface IParkingLotRepository {
  createParkingLot(data: {
    name: string;
    address: string;
  }): Promise<DBParkingLot>;
}

export class PrismaParkingLotRepository implements IParkingLotRepository {
  public constructor() {}

  public async createParkingLot(data: {
    name: string;
    address: string;
  }): Promise<DBParkingLot> {
    const { name, address } = data;

    const newParkingLot = await prisma.parkingLot.create({
      data: {
        name,
        address,
      },
      include: {
        floors: true,
      },
    });

    return newParkingLot;
  }
}
