import { DBUser } from "@/entities/user/user.types";

export interface DBVehicle {
  id: string;
  licensePlate: string;
  model: string;

  user: DBUser;

  createdAt: Date;
  updatedAt: Date;
}
