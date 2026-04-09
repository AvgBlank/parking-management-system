export interface DBVehicle {
  id: string;

  licensePlate: string;
  model: string | null;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}
