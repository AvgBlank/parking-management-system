import AuthRoute from "./auth.route";
import ParkingLotRoute from "./parkingLot.route";
import BookingRoute from "./booking.route";
import PaymentRoute from "./payment.route";

const routes = [
  new AuthRoute(),
  new ParkingLotRoute(),
  new BookingRoute(),
  new PaymentRoute(),
];

export default routes;
