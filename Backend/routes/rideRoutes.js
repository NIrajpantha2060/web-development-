const express = require("express");
const router = express.Router();
const { addRide, getMyRides, getAllRides, deleteRide } = require("../controllers/Ridecontroller");
const authMiddleware = require("../middleware/authMiddleware");
const uploadVehicle = require("../middleware/Vehicleuploadmiddleware");

// ✅ POST - Add new ride (protected, with vehicle photo upload)
router.post("/", authMiddleware, uploadVehicle.single('vehiclePhoto'), addRide);

// ✅ GET - Get my posted rides (protected)
router.get("/my-rides", authMiddleware, getMyRides);

// ✅ GET - Get all active rides (protected - for browsing)
router.get("/", authMiddleware, getAllRides);

// ✅ DELETE - Delete/cancel a ride (protected)
router.delete("/:id", authMiddleware, deleteRide);

module.exports = router;
