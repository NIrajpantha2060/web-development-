// const Ride = require("../models/Ride");
// const User = require("../models/User");
// const { Op } = require("sequelize");

// // ✅ ADD NEW RIDE
// const addRide = async (req, res) => {
//   const { 
//     from, 
//     to, 
//     date, 
//     time, 
//     pickupLocation, 
//     vehicleNumber, 
//     vehicleType, 
//     description,
//     price,
//     availableSeats
//   } = req.body;

//   // Validation
//   if (!from || !to || !date || !time || !pickupLocation || !vehicleNumber || !vehicleType) {
//     return res.status(400).json({ 
//       message: "All required fields must be provided (from, to, date, time, pickupLocation, vehicleNumber, vehicleType)" 
//     });
//   }

//   // Validate vehicleType
//   if (!['bike', 'car'].includes(vehicleType.toLowerCase())) {
//     return res.status(400).json({ 
//       message: "Vehicle type must be either 'bike' or 'car'" 
//     });
//   }

//   // Validate string lengths
//   if (from.length > 30 || to.length > 30 || pickupLocation.length > 30 || vehicleNumber.length > 30) {
//     return res.status(400).json({ 
//       message: "From, To, Pickup Location, and Vehicle Number must be 30 characters or less" 
//     });
//   }

//   if (description && description.length > 400) {
//     return res.status(400).json({ 
//       message: "Description must be 400 characters or less" 
//     });
//   }

//   try {
//     // Get vehicle photo path if uploaded
//     const vehiclePhoto = req.file ? `/uploads/vehicles/${req.file.filename}` : null;

//     // Create ride
//     const ride = await Ride.create({
//       from,
//       to,
//       date,
//       time,
//       pickupLocation,
//       vehicleNumber,
//       vehiclePhoto,
//       vehicleType: vehicleType.toLowerCase(),
//       description: description || null,
//       price: price || null,
//       availableSeats: availableSeats || 1,
//       userId: req.user.id,
//       status: 'active'
//     });

//     console.log("✅ Ride created:", ride.id);

//     res.status(201).json({
//       message: "Ride posted successfully!",
//       ride: {
//         id: ride.id,
//         from: ride.from,
//         to: ride.to,
//         date: ride.date,
//         time: ride.time,
//         pickupLocation: ride.pickupLocation,
//         vehicleNumber: ride.vehicleNumber,
//         vehiclePhoto: ride.vehiclePhoto,
//         vehicleType: ride.vehicleType,
//         description: ride.description,
//         price: ride.price,
//         availableSeats: ride.availableSeats,
//         status: ride.status,
//         userId: ride.userId,
//         createdAt: ride.createdAt,
//         updatedAt: ride.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error("Add ride error:", error);
//     res.status(500).json({ 
//       message: "Server error while creating ride",
//       error: error.message 
//     });
//   }
// };

// // ✅ GET MY RIDES (only rides posted by logged-in user)
// const getMyRides = async (req, res) => {
//   try {
//     const rides = await Ride.findAll({
//       where: { 
//         userId: req.user.id 
//       },
//       include: [
//         {
//           model: User,
//           as: 'rider',
//           attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     console.log(`✅ Found ${rides.length} rides for user ${req.user.id}`);

//     res.status(200).json({
//       message: "Rides fetched successfully",
//       count: rides.length,
//       rides: rides.map(ride => ({
//         id: ride.id,
//         from: ride.from,
//         to: ride.to,
//         date: ride.date,
//         time: ride.time,
//         pickupLocation: ride.pickupLocation,
//         vehicleNumber: ride.vehicleNumber,
//         vehiclePhoto: ride.vehiclePhoto,
//         vehicleType: ride.vehicleType,
//         description: ride.description,
//         price: ride.price,
//         availableSeats: ride.availableSeats,
//         status: ride.status,
//         createdAt: ride.createdAt,
//         updatedAt: ride.updatedAt,
//         rider: ride.rider ? {
//           id: ride.rider.id,
//           username: ride.rider.username,
//           email: ride.rider.email,
//           phone: ride.rider.phone,
//           profilePicture: ride.rider.profilePicture,
//           isVerifiedUser: ride.rider.isVerifiedUser,
//           isVerifiedRider: ride.rider.isVerifiedRider
//         } : null
//       }))
//     });
//   } catch (error) {
//     console.error("Get my rides error:", error);
//     res.status(500).json({ 
//       message: "Server error while fetching rides",
//       error: error.message 
//     });
//   }
// };

// // ✅ GET ALL ACTIVE RIDES (for users to browse - FUTURE USE)
// const getAllRides = async (req, res) => {
//   try {
//     const { vehicleType, from, to, date } = req.query;

//     // Build filter conditions
//     const whereConditions = {
//       status: 'active'
//     };

//     if (vehicleType && ['bike', 'car'].includes(vehicleType.toLowerCase())) {
//       whereConditions.vehicleType = vehicleType.toLowerCase();
//     }

//     if (from) {
//       whereConditions.from = {
//         [Op.iLike]: `%${from}%`
//       };
//     }

//     if (to) {
//       whereConditions.to = {
//         [Op.iLike]: `%${to}%`
//       };
//     }

//     if (date) {
//       whereConditions.date = date;
//     }

//     const rides = await Ride.findAll({
//       where: whereConditions,
//       include: [
//         {
//           model: User,
//           as: 'rider',
//           attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
//         }
//       ],
//       order: [['date', 'ASC'], ['time', 'ASC']]
//     });

//     console.log(`✅ Found ${rides.length} active rides`);

//     res.status(200).json({
//       message: "Active rides fetched successfully",
//       count: rides.length,
//       rides: rides.map(ride => ({
//         id: ride.id,
//         from: ride.from,
//         to: ride.to,
//         date: ride.date,
//         time: ride.time,
//         pickupLocation: ride.pickupLocation,
//         vehicleNumber: ride.vehicleNumber,
//         vehiclePhoto: ride.vehiclePhoto,
//         vehicleType: ride.vehicleType,
//         description: ride.description,
//         price: ride.price,
//         availableSeats: ride.availableSeats,
//         status: ride.status,
//         createdAt: ride.createdAt,
//         updatedAt: ride.updatedAt,
//         rider: ride.rider ? {
//           id: ride.rider.id,
//           username: ride.rider.username,
//           profilePicture: ride.rider.profilePicture,
//           isVerifiedUser: ride.rider.isVerifiedUser,
//           isVerifiedRider: ride.rider.isVerifiedRider
//         } : null
//       }))
//     });
//   } catch (error) {
//     console.error("Get all rides error:", error);
//     res.status(500).json({ 
//       message: "Server error while fetching rides",
//       error: error.message 
//     });
//   }
// };

// // ✅ DELETE RIDE (only by the ride owner)
// const deleteRide = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the ride
//     const ride = await Ride.findByPk(id);

//     if (!ride) {
//       return res.status(404).json({ message: "Ride not found" });
//     }

//     // Check if the logged-in user is the owner of the ride
//     if (ride.userId !== req.user.id) {
//       return res.status(403).json({ message: "You can only delete your own rides" });
//     }

//     // Check if ride is already cancelled or completed
//     if (ride.status === 'cancelled') {
//       return res.status(400).json({ message: "Ride is already cancelled" });
//     }

//     if (ride.status === 'completed') {
//       return res.status(400).json({ message: "Cannot delete a completed ride" });
//     }

//     // Update status to cancelled (soft delete)
//     await ride.update({ status: 'cancelled' });

//     console.log(`✅ Ride ${id} cancelled by user ${req.user.id}`);

//     res.status(200).json({
//       message: "Ride cancelled successfully",
//       ride: {
//         id: ride.id,
//         status: ride.status
//       }
//     });
//   } catch (error) {
//     console.error("Delete ride error:", error);
//     res.status(500).json({ 
//       message: "Server error while deleting ride",
//       error: error.message 
//     });
//   }
// };

// module.exports = { 
//   addRide, 
//   getMyRides,
//   getAllRides,
//   deleteRide
// };


const Ride = require("../models/Ride");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const { Op } = require("sequelize");

// ✅ ADD NEW RIDE (UPDATED WITH SMART LOGIC)
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
    availableSeats,
    vehicleBrand,
    vehicleModel,
    saveVehicle // ✅ NEW: Flag to save vehicle info
  } = req.body;

  // Validation
  if (!from || !to || !date || !time || !pickupLocation) {
    return res.status(400).json({ 
      message: "All required fields must be provided (from, to, date, time, pickupLocation)" 
    });
  }

  // ✅ SMART CHECK: Prevent adding ride if user already has an active ride (date >= today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingActiveRide = await Ride.findOne({
    where: {
      userId: req.user.id,
      status: 'active',
      date: {
        [Op.gte]: today
      }
    }
  });

  if (existingActiveRide) {
    return res.status(400).json({
      message: "You already have an active ride scheduled. Complete or cancel your current ride before adding a new one.",
      existingRide: {
        id: existingActiveRide.id,
        from: existingActiveRide.from,
        to: existingActiveRide.to,
        date: existingActiveRide.date,
        time: existingActiveRide.time
      }
    });
  }

  // ✅ NEW: Check if user has vehicle profile
  let userVehicle = await Vehicle.findOne({
    where: { userId: req.user.id }
  });

  // ✅ If no vehicle profile and user wants to save, validate vehicle data
  if (!userVehicle && saveVehicle === 'true') {
    if (!vehicleNumber || !vehicleType) {
      return res.status(400).json({ 
        message: "Vehicle number and type are required to save vehicle profile" 
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
  }

  // ✅ If vehicle profile exists, use those details (unless overridden)
  let finalVehicleNumber = vehicleNumber;
  let finalVehicleType = vehicleType;
  let finalVehiclePhoto = req.file ? `/uploads/vehicles/${req.file.filename}` : null;

  if (userVehicle) {
    finalVehicleNumber = vehicleNumber || userVehicle.vehicleNumber;
    finalVehicleType = vehicleType || userVehicle.vehicleType;
    finalVehiclePhoto = finalVehiclePhoto || userVehicle.vehiclePhoto;
  }

  // ✅ Seat validation based on vehicle type
  let finalSeats = parseInt(availableSeats) || 1;
  const vType = (finalVehicleType || '').toLowerCase();
  
  if (vType === 'bike') {
    if (finalSeats > 1) {
      return res.status(400).json({ 
        message: "Bikes can have maximum 1 seat only" 
      });
    }
    finalSeats = 1; // Force to 1 for bikes
  } else if (vType === 'car') {
    if (finalSeats > 5) {
      return res.status(400).json({ 
        message: "Cars can have maximum 5 seats only" 
      });
    }
  }

  // Validate string lengths
  if (from.length > 30 || to.length > 30 || pickupLocation.length > 30) {
    return res.status(400).json({ 
      message: "From, To, and Pickup Location must be 30 characters or less" 
    });
  }

  if (description && description.length > 400) {
    return res.status(400).json({ 
      message: "Description must be 400 characters or less" 
    });
  }

  try {
    // ✅ NEW: Create vehicle profile if user wants to save and doesn't have one
    if (!userVehicle && saveVehicle === 'true') {
      const vehiclePhotoForProfile = req.file ? `/uploads/vehicles/${req.file.filename}` : null;
      
      userVehicle = await Vehicle.create({
        vehicleNumber: finalVehicleNumber,
        vehicleType: finalVehicleType.toLowerCase(),
        vehiclePhoto: vehiclePhotoForProfile,
        vehicleBrand: vehicleBrand || null,
        vehicleModel: vehicleModel || null,
        userId: req.user.id
      });

      console.log("✅ Vehicle profile created:", userVehicle.id);
    }

    // Create ride
    const ride = await Ride.create({
      from,
      to,
      date,
      time,
      pickupLocation,
      vehicleNumber: finalVehicleNumber,
      vehiclePhoto: finalVehiclePhoto,
      vehicleType: finalVehicleType.toLowerCase(),
      description: description || null,
      price: price || null,
      availableSeats: finalSeats,
      userId: req.user.id,
      status: 'active'
    });

    console.log("✅ Ride created:", ride.id);

    res.status(201).json({
      message: "Ride posted successfully!",
      vehicleSaved: !!(saveVehicle === 'true' && userVehicle),
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

// ✅ GET MY ACTIVE RIDES (only upcoming/active rides - date >= today)
const getMyRides = async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rides = await Ride.findAll({
      where: { 
        userId: req.user.id,
        status: 'active',
        date: {
          [Op.gte]: today // Only rides with date >= today
        }
      },
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']] // Order by closest date first
    });

    console.log(`✅ Found ${rides.length} active rides for user ${req.user.id}`);

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

// ✅ GET ALL ACTIVE RIDES (for users to browse - only upcoming rides)
const getAllRides = async (req, res) => {
  try {
    const { vehicleType, from, to, date } = req.query;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build filter conditions - only show active rides with date >= today
    const whereConditions = {
      status: 'active',
      date: {
        [Op.gte]: today
      }
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

    // ✅ Get total rides count for each unique rider
    const riderIds = [...new Set(rides.map(r => r.rider?.id).filter(Boolean))];
    const riderTotalRides = {};
    
    for (const riderId of riderIds) {
      const count = await Ride.count({
        where: { userId: riderId }
      });
      riderTotalRides[riderId] = count;
    }

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
          phone: ride.rider.phone,
          profilePicture: ride.rider.profilePicture,
          isVerifiedUser: ride.rider.isVerifiedUser,
          isVerifiedRider: ride.rider.isVerifiedRider,
          totalRides: riderTotalRides[ride.rider.id] || 0
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

// ✅ GET MY RIDE HISTORY (past rides - date < today OR cancelled/completed)
const getMyRideHistory = async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rides = await Ride.findAll({
      where: { 
        userId: req.user.id,
        [Op.or]: [
          // Past dates (regardless of status)
          {
            date: {
              [Op.lt]: today
            }
          },
          // Cancelled or completed rides (regardless of date)
          {
            status: {
              [Op.in]: ['cancelled', 'completed']
            }
          }
        ]
      },
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
        }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']] // Most recent first
    });

    console.log(`✅ Found ${rides.length} ride history entries for user ${req.user.id}`);

    res.status(200).json({
      message: "Ride history fetched successfully",
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
    console.error("Get ride history error:", error);
    res.status(500).json({ 
      message: "Server error while fetching ride history",
      error: error.message 
    });
  }
};

// ✅ CHECK IF USER HAS ACTIVE RIDE (for frontend to show/hide Add Ride button)
const checkActiveRide = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeRide = await Ride.findOne({
      where: {
        userId: req.user.id,
        status: 'active',
        date: {
          [Op.gte]: today
        }
      },
      attributes: ['id', 'from', 'to', 'date', 'time', 'status']
    });

    res.status(200).json({
      hasActiveRide: !!activeRide,
      activeRide: activeRide ? {
        id: activeRide.id,
        from: activeRide.from,
        to: activeRide.to,
        date: activeRide.date,
        time: activeRide.time
      } : null
    });
  } catch (error) {
    console.error("Check active ride error:", error);
    res.status(500).json({ 
      message: "Server error while checking active ride",
      error: error.message 
    });
  }
};

module.exports = { 
  addRide, 
  getMyRides,
  getMyRideHistory,
  getAllRides,
  deleteRide,
  checkActiveRide
};
