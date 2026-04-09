import { DBVehicle } from "@/entities/vehicle/vehicle.types";
import { IVehicleRepository } from "@/entities/vehicle/vehicle.repository";

export interface IVehicleService {
  handleRegisterVehicle(data: {
    licencePlate: string;
    model?: string;
    userId: string;
  }): Promise<DBVehicle>;
  handleGetVehiclesByUserId(userId: string): Promise<DBVehicle[]>;
  handleGetVehicleById(vehicleId: string): Promise<DBVehicle | null>;
  handleDeleteVehicle(vehicleId: string): Promise<void>;
}

class VehicleService implements IVehicleService {
  public constructor(private vehicleRepository: IVehicleRepository) {}

  public async handleRegisterVehicle(data: {
    licencePlate: string;
    model?: string;
    userId: string;
  }) {
    return this.vehicleRepository.registerVehicle(data);
  }

  public async handleGetVehiclesByUserId(userId: string) {
    return this.vehicleRepository.getVehiclesByUserId(userId);
  }

  public async handleGetVehicleById(vehicleId: string) {
    return this.vehicleRepository.getVehicleById(vehicleId);
  }

  public async handleDeleteVehicle(vehicleId: string) {
    return this.vehicleRepository.deleteVehicle(vehicleId);
  }
}

export default VehicleService;
