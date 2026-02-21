const express = require("express");
const router = express.Router();
const { addRide, getMyRides, getMyRideHistory, getAllRides, deleteRide, checkActiveRide } = require("../controllers/Ridecontroller");
const authMiddleware = require("../middleware/authMiddleware");
const uploadVehicle = require("../middleware/Vehicleuploadmiddleware");

// ✅ POST - Add new ride (protected, with vehicle photo upload)
router.post("/", authMiddleware, uploadVehicle.single('vehiclePhoto'), addRide);

// ✅ GET - Check if user has an active ride (for frontend Add Ride button visibility)
router.get("/check-active", authMiddleware, checkActiveRide);

// ✅ GET - Get my active/upcoming rides (protected)
router.get("/my-rides", authMiddleware, getMyRides);

// ✅ GET - Get my ride history (past/cancelled/completed rides)
router.get("/my-history", authMiddleware, getMyRideHistory);

// ✅ GET - Get all active rides (protected - for browsing)
router.get("/", authMiddleware, getAllRides);

// ✅ DELETE - Delete/cancel a ride (protected)
router.delete("/:id", authMiddleware, deleteRide);

module.exports = router;
