import prisma from "@/lib/prisma";

export type DBPayment = {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  paidAt: Date | null;
  userId: string;
  bookingId: string;
};

export interface IPaymentRepository {
  getPaymentsByUser(userId: string): Promise<DBPayment[]>;
  getAllPayments(): Promise<DBPayment[]>;
  getByBookingId(bookingId: string): Promise<DBPayment | null>;
  payBooking(
    userId: string,
    bookingId: string
  ): Promise<{ success: boolean }>;
}

export class PrismaPaymentRepository implements IPaymentRepository {
  public async getPaymentsByUser(userId: string): Promise<DBPayment[]> {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async getAllPayments(): Promise<DBPayment[]> {
    return prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  public async getByBookingId(bookingId: string): Promise<DBPayment | null> {
    return prisma.payment.findFirst({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async payBooking(
    userId: string,
    bookingId: string
  ): Promise<{ success: boolean }> {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { payments: true },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "pending")
      throw new Error("Booking is not pending payment");

    const pendingPayment = booking.payments.find(
      (p) => p.status === "pending"
    );
    if (!pendingPayment) throw new Error("No pending payment found for booking");

    // Simulate payment processing (fake — always succeeds)
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: pendingPayment.id },
        data: { status: "completed", paidAt: new Date() },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "confirmed" },
      });
    });

    return { success: true };
  }
}
