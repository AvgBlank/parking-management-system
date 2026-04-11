import { PrismaPg } from "@prisma/adapter-pg";
import {
  BookingStatus,
  PaymentStatus,
  PrismaClient,
  Role,
  SlotStatus,
  SlotType,
} from "@/generated/prisma/client";
import { config } from "dotenv";
import { resolve } from "path";
import { hash } from "argon2";

// Load .env from the api root (one directory up from prisma/)
config({ path: resolve(__dirname, "../.env") });

// ── Prisma client ─────────────────────────────────────────────────────────────
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  connectionTimeoutMillis: 5000,
});
const prisma = new PrismaClient({ adapter });

// ── Helpers ───────────────────────────────────────────────────────────────────
async function hashPassword(plain: string) {
  return await hash(plain, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// ── Slot definitions per floor ────────────────────────────────────────────────
const SLOT_TYPES: SlotType[] = [
  "standard",
  "standard",
  "standard",
  "compact",
  "compact",
  "handicapped",
  "ev_charging",
  "ev_charging",
];

function buildSlots(prefix: string) {
  return SLOT_TYPES.map((type, i) => ({
    slotCode: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    slotType: type,
    status: "available" as SlotStatus,
  }));
}

// ── Main seed ─────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding database…\n");

  // ── 1. Admin user ───────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@parking.local" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@parking.local",
      phone: "+1-000-000-0000",
      password: await hashPassword("Admin@1234"),
      role: Role.admin,
    },
  });
  console.log(`✅ Admin user        → ${admin.email}`);

  // ── 2. Driver user ──────────────────────────────────────────────────────────
  const driver = await prisma.user.upsert({
    where: { email: "driver@parking.local" },
    update: {},
    create: {
      name: "Jane Driver",
      email: "driver@parking.local",
      phone: "+1-111-111-1111",
      password: await hashPassword("Driver@1234"),
      role: Role.driver,
    },
  });
  console.log(`✅ Driver user       → ${driver.email}`);

  // ── 3. Vehicle ──────────────────────────────────────────────────────────────
  const vehicle = await prisma.vehicle.upsert({
    where: { id: "seed-vehicle-001" },
    update: {},
    create: {
      id: "seed-vehicle-001",
      licensePlate: "ABC-1234",
      model: "Toyota Camry",
      userId: driver.id,
    },
  });
  console.log(`✅ Vehicle           → ${vehicle.licensePlate} (${vehicle.model})`);

  // ── 4. Parking lot A — Downtown ─────────────────────────────────────────────
  const lotA = await prisma.parkingLot.upsert({
    where: { id: "seed-lot-downtown" },
    update: {},
    create: {
      id: "seed-lot-downtown",
      name: "Downtown Parking",
      address: "1 Main Street, Downtown",
      floors: {
        create: [
          {
            name: "Ground Floor",
            level: 0,
            slots: { create: buildSlots("DT-G") },
          },
          {
            name: "First Floor",
            level: 1,
            slots: { create: buildSlots("DT-1") },
          },
        ],
      },
    },
    include: { floors: { include: { slots: true } } },
  });
  console.log(
    `✅ Parking lot A     → "${lotA.name}" (${lotA.floors.length} floors, ${lotA.floors.reduce((n, f) => n + f.slots.length, 0)} slots)`
  );

  // ── 5. Parking lot B — Airport ──────────────────────────────────────────────
  const lotB = await prisma.parkingLot.upsert({
    where: { id: "seed-lot-airport" },
    update: {},
    create: {
      id: "seed-lot-airport",
      name: "Airport Parking",
      address: "Terminal 1, International Airport",
      floors: {
        create: [
          {
            name: "Level P1",
            level: 1,
            slots: { create: buildSlots("AP-1") },
          },
          {
            name: "Level P2",
            level: 2,
            slots: { create: buildSlots("AP-2") },
          },
          {
            name: "Level P3",
            level: 3,
            slots: { create: buildSlots("AP-3") },
          },
        ],
      },
    },
    include: { floors: { include: { slots: true } } },
  });
  console.log(
    `✅ Parking lot B     → "${lotB.name}" (${lotB.floors.length} floors, ${lotB.floors.reduce((n, f) => n + f.slots.length, 0)} slots)`
  );

  // ── 6. Sample booking + payment (uses first slot of lot A, ground floor) ────
  const targetSlot = lotA.floors[0].slots[0];
  const now = new Date();

  const booking = await prisma.booking.upsert({
    where: { id: "seed-booking-001" },
    update: {},
    create: {
      id: "seed-booking-001",
      startTime: now,
      endTime: addHours(now, 2),
      status: BookingStatus.confirmed,
      userId: driver.id,
      vehicleId: vehicle.id,
      slotId: targetSlot.id,
      payments: {
        create: {
          amount: 10.0,
          status: PaymentStatus.completed,
          paidAt: now,
          userId: driver.id,
        },
      },
    },
  });

  // Mark that slot as reserved
  await prisma.slot.update({
    where: { id: targetSlot.id },
    data: { status: "reserved" },
  });

  console.log(
    `✅ Sample booking    → ID ${booking.id} (slot ${targetSlot.slotCode}, $10.00 paid)`
  );

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n  Credentials:");
  console.log("  ┌─────────────────────────────────────────────┐");
  console.log("  │  Admin   admin@parking.local  Admin@1234    │");
  console.log("  │  Driver  driver@parking.local Driver@1234   │");
  console.log("  └─────────────────────────────────────────────┘\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
