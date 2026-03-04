const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  setupMpin,
  verifyMpin,
  changeMpin,
  setupPayment,
  getPaymentStatus,
  applyForRide,
  getMyBookings,
  cancelBooking,
  getRideBookings,
  getMyRideHistory,
  rateRider,
  deleteBookingFromHistory
} = require("../controllers/bookingController");

// ✅ MPIN Routes
router.post("/mpin/setup", verifyToken, setupMpin);
router.post("/mpin/verify", verifyToken, verifyMpin);
router.put("/mpin/change", verifyToken, changeMpin);

// ✅ Payment Routes
router.post("/payment/setup", verifyToken, setupPayment);
router.get("/payment/status", verifyToken, getPaymentStatus);

// ✅ Booking Routes
router.post("/apply", verifyToken, applyForRide);
router.get("/my-bookings", verifyToken, getMyBookings);
router.get("/my-history", verifyToken, getMyRideHistory);
router.delete("/history/:id", verifyToken, deleteBookingFromHistory);
router.put("/:id/cancel", verifyToken, cancelBooking);
router.get("/ride/:rideId/passengers", verifyToken, getRideBookings);

// ✅ Rating Routes
router.post("/:bookingId/rate", verifyToken, rateRider);

module.exports = router;
