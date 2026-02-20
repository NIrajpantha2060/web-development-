const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

// ✅ GET vehicle profile
const getVehicleProfile = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { userId: req.user.id }
    });

    if (!vehicle) {
      return res.status(404).json({ 
        message: "No vehicle profile found",
        hasVehicle: false
      });
    }

    console.log("✅ Vehicle profile found for user:", req.user.id);

    res.status(200).json({
      message: "Vehicle profile fetched successfully",
      hasVehicle: true,
      vehicle: {
        id: vehicle.id,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        vehiclePhoto: vehicle.vehiclePhoto,
        vehicleBrand: vehicle.vehicleBrand,
        vehicleModel: vehicle.vehicleModel,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt
      }
    });
  } catch (error) {
    console.error("Get vehicle profile error:", error);
    res.status(500).json({ 
      message: "Server error while fetching vehicle profile",
      error: error.message 
    });
  }
};

// ✅ CREATE vehicle profile
const createVehicleProfile = async (req, res) => {
  const { 
    vehicleNumber, 
    vehicleType, 
    vehicleBrand, 
    vehicleModel 
  } = req.body;

  // Validation
  if (!vehicleNumber || !vehicleType) {
    return res.status(400).json({ 
      message: "Vehicle number and type are required" 
    });
  }

  // Validate vehicleType
  if (!['bike', 'car'].includes(vehicleType.toLowerCase())) {
    return res.status(400).json({ 
      message: "Vehicle type must be either 'bike' or 'car'" 
    });
  }

  // Validate string lengths
  if (vehicleNumber.length > 30) {
    return res.status(400).json({ 
      message: "Vehicle number must be 30 characters or less" 
    });
  }

  try {
    // Check if user already has a vehicle
    const existingVehicle = await Vehicle.findOne({
      where: { userId: req.user.id }
    });

    if (existingVehicle) {
      return res.status(400).json({ 
        message: "You already have a vehicle profile. Please update it instead." 
      });
    }

    // Get vehicle photo path if uploaded
    const vehiclePhoto = req.file ? `/uploads/vehicles/${req.file.filename}` : null;

    // Create vehicle
    const vehicle = await Vehicle.create({
      vehicleNumber,
      vehicleType: vehicleType.toLowerCase(),
      vehiclePhoto,
      vehicleBrand: vehicleBrand || null,
      vehicleModel: vehicleModel || null,
      userId: req.user.id
    });

    console.log("✅ Vehicle profile created:", vehicle.id);

    res.status(201).json({
      message: "Vehicle profile created successfully!",
      vehicle: {
        id: vehicle.id,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        vehiclePhoto: vehicle.vehiclePhoto,
        vehicleBrand: vehicle.vehicleBrand,
        vehicleModel: vehicle.vehicleModel,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt
      }
    });
  } catch (error) {
    console.error("Create vehicle profile error:", error);
    res.status(500).json({ 
      message: "Server error while creating vehicle profile",
      error: error.message 
    });
  }
};

// ✅ UPDATE vehicle profile
const updateVehicleProfile = async (req, res) => {
  const { 
    vehicleNumber, 
    vehicleType, 
    vehicleBrand, 
    vehicleModel 
  } = req.body;

  try {
    // Find user's vehicle
    const vehicle = await Vehicle.findOne({
      where: { userId: req.user.id }
    });

    if (!vehicle) {
      return res.status(404).json({ 
        message: "No vehicle profile found. Please create one first." 
      });
    }

    // Prepare update data
    const updateData = {};
    
    if (vehicleNumber) {
      if (vehicleNumber.length > 30) {
        return res.status(400).json({ 
          message: "Vehicle number must be 30 characters or less" 
        });
      }
      updateData.vehicleNumber = vehicleNumber;
    }

    if (vehicleType) {
      if (!['bike', 'car'].includes(vehicleType.toLowerCase())) {
        return res.status(400).json({ 
          message: "Vehicle type must be either 'bike' or 'car'" 
        });
      }
      updateData.vehicleType = vehicleType.toLowerCase();
    }

    if (vehicleBrand !== undefined) updateData.vehicleBrand = vehicleBrand || null;
    if (vehicleModel !== undefined) updateData.vehicleModel = vehicleModel || null;

    // Update photo if new one is uploaded
    if (req.file) {
      updateData.vehiclePhoto = `/uploads/vehicles/${req.file.filename}`;
    }

    // Update vehicle
    await vehicle.update(updateData);

    console.log("✅ Vehicle profile updated:", vehicle.id);

    res.status(200).json({
      message: "Vehicle profile updated successfully!",
      vehicle: {
        id: vehicle.id,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,
        vehiclePhoto: vehicle.vehiclePhoto,
        vehicleBrand: vehicle.vehicleBrand,
        vehicleModel: vehicle.vehicleModel,
        updatedAt: vehicle.updatedAt
      }
    });
  } catch (error) {
    console.error("Update vehicle profile error:", error);
    res.status(500).json({ 
      message: "Server error while updating vehicle profile",
      error: error.message 
    });
  }
};

// ✅ DELETE vehicle profile
const deleteVehicleProfile = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { userId: req.user.id }
    });

    if (!vehicle) {
      return res.status(404).json({ 
        message: "No vehicle profile found" 
      });
    }

    await vehicle.destroy();

    console.log("✅ Vehicle profile deleted for user:", req.user.id);

    res.status(200).json({
      message: "Vehicle profile deleted successfully"
    });
  } catch (error) {
    console.error("Delete vehicle profile error:", error);
    res.status(500).json({ 
      message: "Server error while deleting vehicle profile",
      error: error.message 
    });
  }
};

module.exports = { 
  getVehicleProfile,
  createVehicleProfile,
  updateVehicleProfile,
  deleteVehicleProfile
};