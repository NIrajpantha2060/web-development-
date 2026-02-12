const Ride = require("../models/Ride");
const User = require("../models/User");
const { Op } = require("sequelize");

// ✅ ADD NEW RIDE
const addRide = async (req, res) => {
  const { 
    from, 
    to, 
    date, 
    time, 
    pickupLocation, 
    vehicleNumber, 
    vehicleType, 
    description,
    price,
    availableSeats
  } = req.body;

  // Validation
  if (!from || !to || !date || !time || !pickupLocation || !vehicleNumber || !vehicleType) {
    return res.status(400).json({ 
      message: "All required fields must be provided (from, to, date, time, pickupLocation, vehicleNumber, vehicleType)" 
    });
  }

  // Validate vehicleType
  if (!['bike', 'car'].includes(vehicleType.toLowerCase())) {
    return res.status(400).json({ 
      message: "Vehicle type must be either 'bike' or 'car'" 
    });
  }

  // Validate string lengths
  if (from.length > 30 || to.length > 30 || pickupLocation.length > 30 || vehicleNumber.length > 30) {
    return res.status(400).json({ 
      message: "From, To, Pickup Location, and Vehicle Number must be 30 characters or less" 
    });
  }

  if (description && description.length > 400) {
    return res.status(400).json({ 
      message: "Description must be 400 characters or less" 
    });
  }

  try {
    // Get vehicle photo path if uploaded
    const vehiclePhoto = req.file ? `/uploads/vehicles/${req.file.filename}` : null;

    // Create ride
    const ride = await Ride.create({
      from,
      to,
      date,
      time,
      pickupLocation,
      vehicleNumber,
      vehiclePhoto,
      vehicleType: vehicleType.toLowerCase(),
      description: description || null,
      price: price || null,
      availableSeats: availableSeats || 1,
      userId: req.user.id,
      status: 'active'
    });

    console.log("✅ Ride created:", ride.id);

    res.status(201).json({
      message: "Ride posted successfully!",
      ride: {
        id: ride.id,
        from: ride.from,
        to: ride.to,
        date: ride.date,
        time: ride.time,
        pickupLocation: ride.pickupLocation,
        vehicleNumber: ride.vehicleNumber,
        vehiclePhoto: ride.vehiclePhoto,
        vehicleType: ride.vehicleType,
        description: ride.description,
        price: ride.price,
        availableSeats: ride.availableSeats,
        status: ride.status,
        userId: ride.userId,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt
      }
    });
  } catch (error) {
    console.error("Add ride error:", error);
    res.status(500).json({ 
      message: "Server error while creating ride",
      error: error.message 
    });
  }
};

// ✅ GET MY RIDES (only rides posted by logged-in user)
const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.findAll({
      where: { 
        userId: req.user.id 
      },
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${rides.length} rides for user ${req.user.id}`);

    res.status(200).json({
      message: "Rides fetched successfully",
      count: rides.length,
      rides: rides.map(ride => ({
        id: ride.id,
        from: ride.from,
        to: ride.to,
        date: ride.date,
        time: ride.time,
        pickupLocation: ride.pickupLocation,
        vehicleNumber: ride.vehicleNumber,
        vehiclePhoto: ride.vehiclePhoto,
        vehicleType: ride.vehicleType,
        description: ride.description,
        price: ride.price,
        availableSeats: ride.availableSeats,
        status: ride.status,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt,
        rider: ride.rider ? {
          id: ride.rider.id,
          username: ride.rider.username,
          email: ride.rider.email,
          phone: ride.rider.phone,
          profilePicture: ride.rider.profilePicture,
          isVerifiedUser: ride.rider.isVerifiedUser,
          isVerifiedRider: ride.rider.isVerifiedRider
        } : null
      }))
    });
  } catch (error) {
    console.error("Get my rides error:", error);
    res.status(500).json({ 
      message: "Server error while fetching rides",
      error: error.message 
    });
  }
};

// ✅ GET ALL ACTIVE RIDES (for users to browse - FUTURE USE)
const getAllRides = async (req, res) => {
  try {
    const { vehicleType, from, to, date } = req.query;

    // Build filter conditions
    const whereConditions = {
      status: 'active'
    };

    if (vehicleType && ['bike', 'car'].includes(vehicleType.toLowerCase())) {
      whereConditions.vehicleType = vehicleType.toLowerCase();
    }

    if (from) {
      whereConditions.from = {
        [Op.iLike]: `%${from}%`
      };
    }

    if (to) {
      whereConditions.to = {
        [Op.iLike]: `%${to}%`
      };
    }

    if (date) {
      whereConditions.date = date;
    }

    const rides = await Ride.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    console.log(`✅ Found ${rides.length} active rides`);

    res.status(200).json({
      message: "Active rides fetched successfully",
      count: rides.length,
      rides: rides.map(ride => ({
        id: ride.id,
        from: ride.from,
        to: ride.to,
        date: ride.date,
        time: ride.time,
        pickupLocation: ride.pickupLocation,
        vehicleNumber: ride.vehicleNumber,
        vehiclePhoto: ride.vehiclePhoto,
        vehicleType: ride.vehicleType,
        description: ride.description,
        price: ride.price,
        availableSeats: ride.availableSeats,
        status: ride.status,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt,
        rider: ride.rider ? {
          id: ride.rider.id,
          username: ride.rider.username,
          profilePicture: ride.rider.profilePicture,
          isVerifiedUser: ride.rider.isVerifiedUser,
          isVerifiedRider: ride.rider.isVerifiedRider
        } : null
      }))
    });
  } catch (error) {
    console.error("Get all rides error:", error);
    res.status(500).json({ 
      message: "Server error while fetching rides",
      error: error.message 
    });
  }
};

// ✅ DELETE RIDE (only by the ride owner)
const deleteRide = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the ride
    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if the logged-in user is the owner of the ride
    if (ride.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own rides" });
    }

    // Check if ride is already cancelled or completed
    if (ride.status === 'cancelled') {
      return res.status(400).json({ message: "Ride is already cancelled" });
    }

    if (ride.status === 'completed') {
      return res.status(400).json({ message: "Cannot delete a completed ride" });
    }

    // Update status to cancelled (soft delete)
    await ride.update({ status: 'cancelled' });

    console.log(`✅ Ride ${id} cancelled by user ${req.user.id}`);

    res.status(200).json({
      message: "Ride cancelled successfully",
      ride: {
        id: ride.id,
        status: ride.status
      }
    });
  } catch (error) {
    console.error("Delete ride error:", error);
    res.status(500).json({ 
      message: "Server error while deleting ride",
      error: error.message 
    });
  }
};

module.exports = { 
  addRide, 
  getMyRides,
  getAllRides,
  deleteRide
};
