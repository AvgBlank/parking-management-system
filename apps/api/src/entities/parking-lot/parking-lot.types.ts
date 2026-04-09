import { DBFloor } from "@/entities/floor/floor.types";

export type DBParkingLot = {
  id: string;
  name: string;
  address: string;

  floors: DBFloor[];

  createdAt: Date;
  updatedAt: Date;
};
