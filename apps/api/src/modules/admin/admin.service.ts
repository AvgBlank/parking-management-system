import { IFloorRepository } from "@/entities/floor/floor.repository";
import { DBFloor } from "@/entities/floor/floor.types";
import { IParkingLotRepository } from "@/entities/parking-lot/parking-lot.repository";
import { DBParkingLot } from "@/entities/parking-lot/parking-lot.types";
import { ISlotRepository } from "@/entities/slot/slot.repository";
import { DBSlot } from "@/entities/slot/slot.types";
import { IUserRepository } from "@/entities/user/user.repository";
import { DBUser } from "@/entities/user/user.types";

export interface IAdminService {
  handleGetUsers(): Promise<DBUser[]>;
  handleCreateFloor(data: { name: string }): Promise<DBFloor>;
  handleCreateSlot(data: {
    floorId: string;
    slotCode: string;
    slotType:
      | "standard"
      | "compact"
      | "handicapped"
      | "ev_charging"
      | undefined;
    status: "available" | "reserved" | "occupied" | "inactive" | undefined;
  }): Promise<DBSlot>;
  handleCreateParkingLot(data: {
    name: string;
    address: string;
  }): Promise<DBParkingLot>;
}

class AdminService implements IAdminService {
  public constructor(
    private userRepository: IUserRepository,
    private floorRepository: IFloorRepository,
    private slotRepository: ISlotRepository,
    private parkingLotRepository: IParkingLotRepository,
  ) {}

  public async handleGetUsers() {
    return this.userRepository.getAllUsers();
  }

  public async handleCreateFloor(data: { name: string }) {
    return this.floorRepository.createFloor(data);
  }

  public async handleCreateSlot(data: {
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

    return this.slotRepository.createSlot({
      slotCode,
      slotType,
      status,
      floorId,
    });
  }

  public async handleCreateParkingLot(data: { name: string; address: string }) {
    const { name, address } = data;

    return this.parkingLotRepository.createParkingLot({
      name,
      address,
    });
  }
}

export default AdminService;
