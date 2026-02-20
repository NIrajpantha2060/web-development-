const express = require("express");
const router = express.Router();
const { 
  getVehicleProfile,
  createVehicleProfile,
  updateVehicleProfile,
  deleteVehicleProfile
} = require("../controllers/vehicleController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadVehicle = require("../middleware/Vehicleuploadmiddleware");

// ✅ GET - Get user's vehicle profile
router.get("/", authMiddleware, getVehicleProfile);

// ✅ POST - Create vehicle profile
router.post("/", authMiddleware, uploadVehicle.single('vehiclePhoto'), createVehicleProfile);

// ✅ PUT - Update vehicle profile
router.put("/", authMiddleware, uploadVehicle.single('vehiclePhoto'), updateVehicleProfile);

// ✅ DELETE - Delete vehicle profile
router.delete("/", authMiddleware, deleteVehicleProfile);

module.exports = router;