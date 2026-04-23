import { IPaymentRepository } from "@/entities/payment/payment.repository";

export interface IPaymentService {
  handleGetMyPayments(userId: string): Promise<unknown[]>;
  handleGetAllPayments(): Promise<unknown[]>;
  handlePayBooking(
    userId: string,
    bookingId: string
  ): Promise<{ success: boolean }>;
}

class PaymentService implements IPaymentService {
  constructor(private paymentRepository: IPaymentRepository) {}

  public async handleGetMyPayments(userId: string) {
    return this.paymentRepository.getPaymentsByUser(userId);
  }

  public async handleGetAllPayments() {
    return this.paymentRepository.getAllPayments();
  }

  public async handlePayBooking(userId: string, bookingId: string) {
    return this.paymentRepository.payBooking(userId, bookingId);
  }
}

export default PaymentService;
