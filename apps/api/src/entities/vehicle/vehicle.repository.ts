import prisma from "@/lib/prisma";
import { DBVehicle } from "@/entities/vehicle/vehicle.types";

export interface IVehicleRepository {
  registerVehicle(data: {
    licencePlate: string;
    model?: string;
    userId: string;
  }): Promise<DBVehicle>;
  getVehiclesByUserId(userId: string): Promise<DBVehicle[]>;
  getVehicleById(vehicleId: string): Promise<DBVehicle | null>;
  deleteVehicle(vehicleId: string): Promise<void>;
}

export class PrismaVehicleRepository implements IVehicleRepository {
  public constructor() {}

  public async registerVehicle(data: {
    licencePlate: string;
    model: string;
    userId: string;
  }) {
    const { licencePlate, model, userId } = data;

    return await prisma.vehicle.create({
      data: {
        licensePlate: licencePlate,
        model,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  public async getVehiclesByUserId(userId: string) {
    return await prisma.vehicle.findMany({
      where: { userId },
    });
  }

  public async getVehicleById(vehicleId: string) {
    return await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
  }

  public async deleteVehicle(vehicleId: string) {
    await prisma.vehicle.deleteMany({
      where: { id: vehicleId },
    });
  }
}
