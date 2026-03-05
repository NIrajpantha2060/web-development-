

const Ride = require("../models/Ride");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const RideBooking = require("../models/RideBooking");
const Notification = require("../models/Notification");
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

  // Price per seat validation
  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).json({ 
      message: "Price per seat is required and must be a valid positive number" 
    });
  }

  // ✅ SMART CHECK: Prevent adding ride if user already has an active/booked ride (date >= today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check for rides with status 'active' or 'taken' (fully booked but not completed)
  const existingActiveRide = await Ride.findOne({
    where: {
      userId: req.user.id,
      status: {
        [Op.in]: ['active', 'taken']
      },
      date: {
        [Op.gte]: today
      }
    },
    include: [{
      model: RideBooking,
      as: 'bookings',
      where: { bookingStatus: 'confirmed' },
      required: false
    }]
  });

  if (existingActiveRide) {
    const hasBookings = existingActiveRide.bookings && existingActiveRide.bookings.length > 0;
    const message = hasBookings 
      ? "You have a ride with confirmed bookings. Complete your current ride before adding a new one."
      : "You already have an active ride scheduled. Complete or cancel your current ride before adding a new one.";
    
    return res.status(400).json({
      message,
      hasBookings,
      existingRide: {
        id: existingActiveRide.id,
        from: existingActiveRide.from,
        to: existingActiveRide.to,
        date: existingActiveRide.date,
        time: existingActiveRide.time,
        status: existingActiveRide.status,
        bookedSeats: existingActiveRide.bookedSeats
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
    // Set no-cache headers to prevent browser caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rides = await Ride.findAll({
      where: { 
        userId: req.user.id,
        status: {
          [Op.in]: ['active', 'taken'] // ✅ Include both active and taken rides
        },
        date: {
          [Op.gte]: today // Only rides with date >= today
        }
      },
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider', 'riderAverageRating', 'totalRatingsReceived']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']] // Order by closest date first
    });

    console.log(`✅ Found ${rides.length} active/taken rides for user ${req.user.id}`);

    res.status(200).json({
      message: "Rides fetched successfully",
      count: rides.length,
      rides: rides.map(ride => ({
        id: ride.id,
        userId: ride.userId, // ✅ Include userId for ownership check
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
        bookedSeats: ride.bookedSeats || 0, // ✅ Include bookedSeats
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
          isVerifiedRider: ride.rider.isVerifiedRider,
          riderAverageRating: ride.rider.riderAverageRating,
          totalRatingsReceived: ride.rider.totalRatingsReceived
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
    // Set no-cache headers to prevent browser caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const { vehicleType, from, to, date } = req.query;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build filter conditions - show active and taken rides with date >= today
    const whereConditions = {
      status: {
        [Op.in]: ['active', 'taken']
      },
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
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider', 'riderAverageRating', 'totalRatingsReceived']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    console.log(`✅ Found ${rides.length} active/taken rides`);

    // ✅ Get total booked rides count for each unique rider (only completed or taken rides, excluding cancelled/active)
    const riderIds = [...new Set(rides.map(r => r.rider?.id).filter(Boolean))];
    const riderTotalRides = {};
    
    for (const riderId of riderIds) {
      const count = await Ride.count({
        where: { 
          userId: riderId,
          status: { [Op.in]: ['completed', 'taken'] }  // Count completed and taken rides (booked rides)
        }
      });
      riderTotalRides[riderId] = count;
    }

    res.status(200).json({
      message: "Active rides fetched successfully",
      count: rides.length,
      rides: rides.map(ride => ({
        id: ride.id,
        userId: ride.userId, // ✅ Include userId for ownership check
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
        bookedSeats: ride.bookedSeats || 0,
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
          riderAverageRating: ride.rider.riderAverageRating,
          totalRatingsReceived: ride.rider.totalRatingsReceived,
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

    // ✅ Get all confirmed bookings for this ride to notify passengers
    const confirmedBookings = await RideBooking.findAll({
      where: {
        rideId: id,
        bookingStatus: 'confirmed'
      },
      include: [{ model: User, as: 'passenger', attributes: ['id', 'username'] }]
    });

    // Update status to cancelled (soft delete)
    await ride.update({ status: 'cancelled' });

    // ✅ Update all bookings to cancelled and refunded
    await RideBooking.update(
      { bookingStatus: 'cancelled', paymentStatus: 'refunded' },
      { where: { rideId: id, bookingStatus: 'confirmed' } }
    );

    // ✅ Send notification to all passengers who had booked
    const rider = await User.findByPk(req.user.id, { attributes: ['username'] });
    for (const booking of confirmedBookings) {
      await Notification.create({
        userId: booking.passengerId,
        type: 'ride_cancelled',
        title: 'Ride Cancelled 🚨',
        message: `The ride from ${ride.from} to ${ride.to} on ${new Date(ride.date).toLocaleDateString()} has been cancelled by ${rider.username}. Your payment of Rs. ${booking.totalAmount} will be refunded.`,
        relatedId: ride.id
      });
    }

    console.log(`✅ Ride ${id} cancelled by user ${req.user.id}`);
    console.log(`📬 Notified ${confirmedBookings.length} passenger(s) about cancellation`);

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
// ✅ UPDATED: Now includes booking information (customer details)
const getMyRideHistory = async (req, res) => {
  try {
    // Get today's date for comparison
    // Rides appear in history the day AFTER the ride date
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const rides = await Ride.findAll({
      where: { 
        userId: req.user.id,
        hiddenFromHistory: false, // ✅ Exclude hidden rides
        [Op.or]: [
          // Past dates (before today) - rides show in history the day AFTER the ride date
          {
            date: {
              [Op.lt]: todayStr
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
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider', 'riderAverageRating', 'totalRatingsReceived']
        },
        // ✅ NEW: Include bookings with passenger details
        {
          model: RideBooking,
          as: 'bookings',
          required: false, // Left join - include rides even without bookings
          where: {
            bookingStatus: {
              [Op.in]: ['confirmed', 'completed'] // Only show confirmed/completed bookings
            }
          },
          include: [
            {
              model: User,
              as: 'passenger',
              attributes: ['id', 'username', 'email', 'phone', 'profilePicture']
            }
          ]
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
        bookedSeats: ride.bookedSeats || 0,
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
          isVerifiedRider: ride.rider.isVerifiedRider,
          riderAverageRating: ride.rider.riderAverageRating,
          totalRatingsReceived: ride.rider.totalRatingsReceived
        } : null,
        // ✅ NEW: Include booking information with customer details
        bookings: (ride.bookings || []).map(booking => ({
          id: booking.id,
          seatsBooked: booking.seatsBooked,
          totalAmount: booking.totalAmount,
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          bookingStatus: booking.bookingStatus,
          createdAt: booking.createdAt,
          passenger: booking.passenger ? {
            id: booking.passenger.id,
            username: booking.passenger.username,
            email: booking.passenger.email,
            phone: booking.passenger.phone,
            profilePicture: booking.passenger.profilePicture
          } : null
        })),
        // ✅ Convenience field: Summary of who booked
        bookedBy: (ride.bookings && ride.bookings.length > 0) 
          ? ride.bookings.map(b => b.passenger?.username || 'Unknown').join(', ')
          : 'None'
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

    // Check for rides with status 'active' or 'taken' (fully booked but not completed)
    const activeRide = await Ride.findOne({
      where: {
        userId: req.user.id,
        status: {
          [Op.in]: ['active', 'taken']
        },
        date: {
          [Op.gte]: today
        }
      },
      include: [{
        model: RideBooking,
        as: 'bookings',
        where: { bookingStatus: 'confirmed' },
        required: false
      }],
      attributes: ['id', 'from', 'to', 'date', 'time', 'status', 'bookedSeats', 'availableSeats']
    });

    const hasBookings = activeRide?.bookings && activeRide.bookings.length > 0;

    res.status(200).json({
      hasActiveRide: !!activeRide,
      hasBookings,
      activeRide: activeRide ? {
        id: activeRide.id,
        from: activeRide.from,
        to: activeRide.to,
        date: activeRide.date,
        time: activeRide.time,
        status: activeRide.status,
        bookedSeats: activeRide.bookedSeats,
        availableSeats: activeRide.availableSeats
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

// ✅ DELETE RIDE FROM HISTORY (soft delete - hides from user's history view)
const deleteRideFromHistory = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the ride
    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if the logged-in user is the owner of the ride
    if (ride.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own ride history" });
    }

    // Update hiddenFromHistory to true (soft delete)
    await ride.update({ hiddenFromHistory: true });

    console.log(`✅ Ride ${id} removed from history by user ${req.user.id}`);

    res.status(200).json({
      message: "Ride removed from history successfully",
      rideId: ride.id
    });
  } catch (error) {
    console.error("Delete ride from history error:", error);
    res.status(500).json({ 
      message: "Server error while deleting ride from history",
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
  checkActiveRide,
  deleteRideFromHistory
};
