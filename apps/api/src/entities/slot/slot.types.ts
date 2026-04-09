import { DBBooking } from "@/entities/booking/booking.types";

export type DBSlot = {
  id: string;
  slotCode: string;
  slotType: "standard" | "compact" | "handicapped" | "ev_charging";
  status: "available" | "reserved" | "occupied" | "inactive";

  floorId: string;
  bookings: DBBooking[];

  createdAt: Date;
  updatedAt: Date;
};
