/*
  Warnings:

  - You are about to drop the column `floorId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `parkingLotId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `parkingLotId` on the `Slot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_floorId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_parkingLotId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_parkingLotId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "floorId",
DROP COLUMN "parkingLotId";

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "parkingLotId";
