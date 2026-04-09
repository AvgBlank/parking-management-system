-- CreateEnum
CREATE TYPE "SlotType" AS ENUM ('standard', 'compact', 'handicapped', 'ev_charging');

-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('available', 'reserved', 'occupied', 'inactive');

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "slotCode" TEXT NOT NULL,
    "slotType" "SlotType" NOT NULL DEFAULT 'standard',
    "status" "SlotStatus" NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "floorId" TEXT NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
