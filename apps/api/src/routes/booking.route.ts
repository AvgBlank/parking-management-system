import { Router } from "express";
import { Route } from "@/app";
import BookingController from "@/controllers/booking.controller";

class BookingRoute implements Route {
  public path = "/api/bookings";
  public router = Router();
  public bookingController = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.bookingController.createBooking);
    this.router.get(`${this.path}/:id`, this.bookingController.getBookingById);
    this.router.delete(`${this.path}/:id`, this.bookingController.cancelBooking);
  }
}

export default BookingRoute;
