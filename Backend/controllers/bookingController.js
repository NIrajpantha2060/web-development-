const RideBooking = require("../models/RideBooking");
const Ride = require("../models/Ride");
const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// ✅ SETUP MPIN (first time)
const setupMpin = async (req, res) => {
  const { mpin } = req.body;

  // Validation
  if (!mpin || mpin.length !== 4 || !/^\d{4}$/.test(mpin)) {
    return res.status(400).json({ 
      message: "MPIN must be exactly 4 digits" 
    });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (user.hasMpinSetup) {
      return res.status(400).json({ 
        message: "MPIN is already set up. Use change MPIN option instead." 
      });
    }

    // Hash the MPIN
    const hashedMpin = await bcrypt.hash(mpin, 10);

    await user.update({
      mpin: hashedMpin,
      hasMpinSetup: true
    });

    console.log(`✅ MPIN set up for user ${req.user.id}`);

    res.status(200).json({
      message: "MPIN set up successfully!",
      hasMpinSetup: true
    });
  } catch (error) {
    console.error("Setup MPIN error:", error);
    res.status(500).json({ 
      message: "Server error while setting up MPIN",
      error: error.message 
    });
  }
};

// ✅ VERIFY MPIN
const verifyMpin = async (req, res) => {
  const { mpin } = req.body;

  if (!mpin) {
    return res.status(400).json({ message: "MPIN is required" });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user.hasMpinSetup) {
      return res.status(400).json({ 
        message: "MPIN not set up yet. Please set up MPIN first." 
      });
    }

    const isValid = await bcrypt.compare(mpin, user.mpin);

    if (!isValid) {
      return res.status(401).json({ 
        message: "Invalid MPIN. Please try again." 
      });
    }

    console.log(`✅ MPIN verified for user ${req.user.id}`);

    res.status(200).json({
      message: "MPIN verified successfully",
      verified: true
    });
  } catch (error) {
    console.error("Verify MPIN error:", error);
    res.status(500).json({ 
      message: "Server error while verifying MPIN",
      error: error.message 
    });
  }
};

// ✅ CHANGE MPIN
const changeMpin = async (req, res) => {
  const { currentMpin, newMpin } = req.body;

  // Validation
  if (!currentMpin || !newMpin) {
    return res.status(400).json({ 
      message: "Current MPIN and new MPIN are required" 
    });
  }

  if (newMpin.length !== 4 || !/^\d{4}$/.test(newMpin)) {
    return res.status(400).json({ 
      message: "New MPIN must be exactly 4 digits" 
    });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user.hasMpinSetup) {
      return res.status(400).json({ 
        message: "MPIN not set up yet. Please set up MPIN first." 
      });
    }

    // Verify current MPIN
    const isValid = await bcrypt.compare(currentMpin, user.mpin);
    if (!isValid) {
      return res.status(401).json({ 
        message: "Current MPIN is incorrect" 
      });
    }

    // Hash and update new MPIN
    const hashedMpin = await bcrypt.hash(newMpin, 10);
    await user.update({ mpin: hashedMpin });

    console.log(`✅ MPIN changed for user ${req.user.id}`);

    res.status(200).json({
      message: "MPIN changed successfully!"
    });
  } catch (error) {
    console.error("Change MPIN error:", error);
    res.status(500).json({ 
      message: "Server error while changing MPIN",
      error: error.message 
    });
  }
};

// ✅ SETUP PAYMENT INFO (Debit Card)
const setupPayment = async (req, res) => {
  const { cardNumber, cardHolderName, cardExpiry, cvv } = req.body;

  // Validation
  if (!cardNumber || !cardHolderName || !cardExpiry || !cvv) {
    return res.status(400).json({ 
      message: "All card details are required" 
    });
  }

  // Validate card number (16 digits)
  const cleanCardNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleanCardNumber)) {
    return res.status(400).json({ 
      message: "Card number must be 16 digits" 
    });
  }

  // Validate expiry (MM/YY)
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
    return res.status(400).json({ 
      message: "Invalid expiry date. Use MM/YY format" 
    });
  }

  // Check if card is not expired
  const [month, year] = cardExpiry.split('/');
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
  if (expiryDate < new Date()) {
    return res.status(400).json({ 
      message: "Card has expired" 
    });
  }

  // Validate CVV (3 digits)
  if (!/^\d{3}$/.test(cvv)) {
    return res.status(400).json({ 
      message: "CVV must be 3 digits" 
    });
  }

  // Validate cardholder name
  if (cardHolderName.trim().length < 2) {
    return res.status(400).json({ 
      message: "Please enter a valid cardholder name" 
    });
  }

  // Detect card brand
  let cardBrand = 'Card';
  if (/^4/.test(cleanCardNumber)) {
    cardBrand = 'Visa';
  } else if (/^5[1-5]/.test(cleanCardNumber) || /^2[2-7]/.test(cleanCardNumber)) {
    cardBrand = 'Mastercard';
  } else if (/^3[47]/.test(cleanCardNumber)) {
    cardBrand = 'Amex';
  }

  try {
    const user = await User.findByPk(req.user.id);

    // Store only last 4 digits for security
    const cardLastFour = cleanCardNumber.slice(-4);

    await user.update({
      paymentMethod: 'debit_card',
      hasPaymentSetup: true,
      cardLastFour,
      cardHolderName: cardHolderName.trim().toUpperCase(),
      cardExpiry,
      cardBrand
    });

    console.log(`✅ Debit card linked for user ${req.user.id}: ****${cardLastFour}`);

    res.status(200).json({
      message: "Debit card linked successfully!",
      paymentInfo: {
        paymentMethod: 'debit_card',
        cardLastFour,
        cardBrand,
        cardHolderName: cardHolderName.trim().toUpperCase(),
        hasPaymentSetup: true
      }
    });
  } catch (error) {
    console.error("Setup payment error:", error);
    res.status(500).json({ 
      message: "Server error while saving payment info",
      error: error.message 
    });
  }
};

// ✅ GET PAYMENT STATUS
const getPaymentStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'hasMpinSetup', 'hasPaymentSetup', 'paymentMethod', 'phone', 
                   'cardLastFour', 'cardHolderName', 'cardExpiry', 'cardBrand']
    });

    res.status(200).json({
      hasMpinSetup: user.hasMpinSetup,
      hasPaymentSetup: user.hasPaymentSetup,
      paymentMethod: user.paymentMethod,
      phone: user.phone ? `${user.phone.slice(0,2)}****${user.phone.slice(-4)}` : null,
      // Card info (for display)
      cardLastFour: user.cardLastFour,
      cardBrand: user.cardBrand,
      cardHolderName: user.cardHolderName,
      cardExpiry: user.cardExpiry
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ 
      message: "Server error while fetching payment status",
      error: error.message 
    });
  }
};

// ✅ APPLY FOR RIDE (Book a ride with payment)
const applyForRide = async (req, res) => {
  const { rideId, seatsToBook, mpin } = req.body;

  // Validation
  if (!rideId) {
    return res.status(400).json({ message: "Ride ID is required" });
  }

  if (!mpin) {
    return res.status(400).json({ message: "MPIN is required for payment" });
  }

  const seats = seatsToBook || 1;

  try {
    // Get user with payment info
    const user = await User.findByPk(req.user.id);

    // Check MPIN setup
    if (!user.hasMpinSetup) {
      return res.status(400).json({ 
        message: "Please set up your MPIN first",
        requiresMpinSetup: true 
      });
    }

    // Check payment setup
    if (!user.hasPaymentSetup) {
      return res.status(400).json({ 
        message: "Please set up your payment information first",
        requiresPaymentSetup: true 
      });
    }

    // Verify MPIN
    const isMpinValid = await bcrypt.compare(mpin, user.mpin);
    if (!isMpinValid) {
      return res.status(401).json({ 
        message: "Invalid MPIN. Payment verification failed." 
      });
    }

    // Get the ride
    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'phone']
        }
      ]
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if ride is available
    if (ride.status !== 'active') {
      return res.status(400).json({ 
        message: `This ride is ${ride.status}. Cannot book.` 
      });
    }

    // Check if user is trying to book their own ride
    if (ride.userId === req.user.id) {
      return res.status(400).json({ 
        message: "You cannot book your own ride" 
      });
    }

    // Check available seats
    const availableSeats = ride.availableSeats - ride.bookedSeats;
    if (seats > availableSeats) {
      return res.status(400).json({ 
        message: `Only ${availableSeats} seat(s) available. You requested ${seats}.` 
      });
    }

    // Check if user already booked this ride
    const existingBooking = await RideBooking.findOne({
      where: {
        rideId,
        passengerId: req.user.id,
        bookingStatus: 'confirmed'
      }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: "You have already booked this ride" 
      });
    }

    // Calculate total amount
    const totalAmount = (parseFloat(ride.price) || 0) * seats;

    // Generate transaction ID (in real app, this comes from payment gateway)
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create booking
    const booking = await RideBooking.create({
      rideId,
      passengerId: req.user.id,
      seatsBooked: seats,
      totalAmount,
      paymentMethod: user.paymentMethod,
      paymentStatus: 'completed',
      transactionId,
      bookingStatus: 'confirmed'
    });

    // Update ride's booked seats
    const newBookedSeats = ride.bookedSeats + seats;
    const newStatus = newBookedSeats >= ride.availableSeats ? 'taken' : 'active';

    await ride.update({
      bookedSeats: newBookedSeats,
      status: newStatus
    });

    // ✅ Create notification for the rider (ride owner)
    await Notification.create({
      userId: ride.userId,
      type: 'ride_booked',
      title: 'New Ride Booking! 🎉',
      message: `Your ride from ${ride.from} to ${ride.to} has been booked by ${user.username}. ${seats} seat(s) booked for Rs. ${totalAmount}.`,
      relatedId: booking.id
    });

    console.log(`✅ Ride ${rideId} booked by user ${req.user.id}. ${seats} seat(s). Status: ${newStatus}`);
    console.log(`📬 Notification sent to rider ${ride.userId}`);

    res.status(201).json({
      message: "Ride booked successfully! Payment completed.",
      booking: {
        id: booking.id,
        rideId: booking.rideId,
        seatsBooked: booking.seatsBooked,
        totalAmount: booking.totalAmount,
        paymentMethod: booking.paymentMethod,
        transactionId: booking.transactionId,
        bookingStatus: booking.bookingStatus,
        createdAt: booking.createdAt
      },
      rideStatus: newStatus,
      rider: ride.rider ? {
        username: ride.rider.username,
        phone: ride.rider.phone
      } : null
    });
  } catch (error) {
    console.error("Apply for ride error:", error);
    res.status(500).json({ 
      message: "Server error while booking ride",
      error: error.message 
    });
  }
};

// ✅ GET MY BOOKINGS (rides I've booked as passenger)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await RideBooking.findAll({
      where: { 
        passengerId: req.user.id 
      },
      include: [
        {
          model: Ride,
          as: 'ride',
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['id', 'username', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider', 'riderAverageRating', 'totalRatingsReceived']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${bookings.length} bookings for user ${req.user.id}`);

    res.status(200).json({
      message: "Bookings fetched successfully",
      count: bookings.length,
      bookings: bookings.map(booking => ({
        id: booking.id,
        seatsBooked: booking.seatsBooked,
        totalAmount: booking.totalAmount,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        transactionId: booking.transactionId,
        bookingStatus: booking.bookingStatus,
        createdAt: booking.createdAt,
        ride: booking.ride ? {
          id: booking.ride.id,
          from: booking.ride.from,
          to: booking.ride.to,
          date: booking.ride.date,
          time: booking.ride.time,
          pickupLocation: booking.ride.pickupLocation,
          vehicleType: booking.ride.vehicleType,
          vehicleNumber: booking.ride.vehicleNumber,
          price: booking.ride.price,
          status: booking.ride.status,
          rider: booking.ride.rider ? {
            id: booking.ride.rider.id,
            username: booking.ride.rider.username,
            phone: booking.ride.rider.phone,
            profilePicture: booking.ride.rider.profilePicture,
            isVerifiedUser: booking.ride.rider.isVerifiedUser,
            isVerifiedRider: booking.ride.rider.isVerifiedRider
          } : null
        } : null
      }))
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ 
      message: "Server error while fetching bookings",
      error: error.message 
    });
  }
};

// ✅ CANCEL MY BOOKING
const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await RideBooking.findByPk(id, {
      include: [{ 
        model: Ride, 
        as: 'ride',
        include: [{ model: User, as: 'rider', attributes: ['id', 'username'] }]
      }]
    });
    
    // Get passenger info for notification
    const passenger = await User.findByPk(req.user.id, { attributes: ['username'] });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.passengerId !== req.user.id) {
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (booking.bookingStatus === 'completed') {
      return res.status(400).json({ message: "Cannot cancel a completed booking" });
    }

    // Update booking status
    await booking.update({ 
      bookingStatus: 'cancelled',
      paymentStatus: 'refunded'
    });

    // Update ride's booked seats
    if (booking.ride) {
      const newBookedSeats = Math.max(0, booking.ride.bookedSeats - booking.seatsBooked);
      const newStatus = booking.ride.status === 'taken' && newBookedSeats < booking.ride.availableSeats 
        ? 'active' 
        : booking.ride.status;

      await booking.ride.update({
        bookedSeats: newBookedSeats,
        status: newStatus
      });
    }

    console.log(`✅ Booking ${id} cancelled by user ${req.user.id}`);

    // ✅ Send notification to the rider about booking cancellation
    if (booking.ride && booking.ride.userId) {
      await Notification.create({
        userId: booking.ride.userId,
        type: 'booking_cancelled',
        title: 'Booking Cancelled 🚨',
        message: `${passenger.username} has cancelled their booking for your ride from ${booking.ride.from} to ${booking.ride.to}. ${booking.seatsBooked} seat(s) are now available again.`,
        relatedId: booking.id
      });
      console.log(`📬 Notification sent to rider ${booking.ride.userId}`);
    }

    res.status(200).json({
      message: "Booking cancelled successfully. Refund initiated.",
      booking: {
        id: booking.id,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus
      }
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ 
      message: "Server error while cancelling booking",
      error: error.message 
    });
  }
};

// ✅ GET RIDE BOOKINGS (for ride owner to see who booked)
const getRideBookings = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findByPk(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only view bookings for your own rides" });
    }

    const bookings = await RideBooking.findAll({
      where: { 
        rideId,
        bookingStatus: 'confirmed'
      },
      include: [
        {
          model: User,
          as: 'passenger',
          attributes: ['id', 'username', 'phone', 'profilePicture', 'isVerifiedUser']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      message: "Ride bookings fetched successfully",
      count: bookings.length,
      totalSeatsBooked: bookings.reduce((sum, b) => sum + b.seatsBooked, 0),
      bookings: bookings.map(booking => ({
        id: booking.id,
        seatsBooked: booking.seatsBooked,
        totalAmount: booking.totalAmount,
        createdAt: booking.createdAt,
        passenger: booking.passenger ? {
          id: booking.passenger.id,
          username: booking.passenger.username,
          phone: booking.passenger.phone,
          profilePicture: booking.passenger.profilePicture,
          isVerifiedUser: booking.passenger.isVerifiedUser
        } : null
      }))
    });
  } catch (error) {
    console.error("Get ride bookings error:", error);
    res.status(500).json({ 
      message: "Server error while fetching ride bookings",
      error: error.message 
    });
  }
};

// ✅ NEW: GET MY RIDE HISTORY (completed/past bookings for user mode)
const getMyRideHistory = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Get bookings where ride date has passed OR booking is completed/cancelled
    const bookings = await RideBooking.findAll({
      where: { 
        passengerId: req.user.id 
      },
      include: [
        {
          model: Ride,
          as: 'ride',
          where: {
            [Op.or]: [
              { date: { [Op.lt]: todayStr } }, // Past rides
              { status: 'completed' }
            ]
          },
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['id', 'username', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider', 'riderAverageRating', 'totalRatingsReceived']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${bookings.length} ride history for user ${req.user.id}`);

    res.status(200).json({
      message: "Ride history fetched successfully",
      count: bookings.length,
      bookings: bookings.map(booking => ({
        id: booking.id,
        bookingId: `BK${String(booking.id).padStart(6, '0')}`,
        seatsBooked: booking.seatsBooked,
        totalAmount: booking.totalAmount,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        transactionId: booking.transactionId,
        bookingStatus: booking.bookingStatus,
        createdAt: booking.createdAt,
        // Rating info
        riderRating: booking.riderRating,
        riderReview: booking.riderReview,
        ratedAt: booking.ratedAt,
        hasRated: !!booking.riderRating,
        // Ride info
        ride: booking.ride ? {
          id: booking.ride.id,
          rideId: `RD${String(booking.ride.id).padStart(6, '0')}`,
          from: booking.ride.from,
          to: booking.ride.to,
          date: booking.ride.date,
          time: booking.ride.time,
          pickupLocation: booking.ride.pickupLocation,
          vehicleType: booking.ride.vehicleType,
          vehicleNumber: booking.ride.vehicleNumber,
          vehiclePhoto: booking.ride.vehiclePhoto,
          price: booking.ride.price,
          status: booking.ride.status,
          description: booking.ride.description,
          // Rider (driver) info
          rider: booking.ride.rider ? {
            id: booking.ride.rider.id,
            username: booking.ride.rider.username,
            phone: booking.ride.rider.phone,
            profilePicture: booking.ride.rider.profilePicture,
            isVerifiedUser: booking.ride.rider.isVerifiedUser,
            isVerifiedRider: booking.ride.rider.isVerifiedRider
          } : null
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

// ✅ NEW: RATE RIDER (after ride completion)
const rateRider = async (req, res) => {
  const { bookingId } = req.params;
  const { rating, review } = req.body;

  // Validation
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ 
      message: "Rating must be between 1 and 5 stars" 
    });
  }

  try {
    // Find the booking
    const booking = await RideBooking.findByPk(bookingId, {
      include: [
        {
          model: Ride,
          as: 'ride',
          include: [
            {
              model: User,
              as: 'rider',
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the booking belongs to the current user
    if (booking.passengerId !== req.user.id) {
      return res.status(403).json({ message: "You can only rate your own bookings" });
    }

    // Check if already rated
    if (booking.riderRating) {
      return res.status(400).json({ message: "You have already rated this ride" });
    }

    // Check if the ride date has passed (can only rate after ride)
    const rideDate = new Date(booking.ride.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (rideDate >= today) {
      return res.status(400).json({ 
        message: "You can only rate a ride after it has been completed" 
      });
    }

    // Update booking with rating
    await booking.update({
      riderRating: rating,
      riderReview: review || null,
      ratedAt: new Date()
    });

    // ✅ Update rider's average rating
    const riderId = booking.ride.userId;
    const rider = await User.findByPk(riderId);
    
    if (rider) {
      const currentAvg = parseFloat(rider.riderAverageRating) || 0;
      const currentCount = rider.totalRatingsReceived || 0;
      
      // Calculate new average: ((oldAvg * count) + newRating) / (count + 1)
      const newCount = currentCount + 1;
      const newAverage = ((currentAvg * currentCount) + rating) / newCount;
      
      await rider.update({
        riderAverageRating: Math.round(newAverage * 10) / 10, // Round to 1 decimal
        totalRatingsReceived: newCount
      });
      
      console.log(`✅ Updated rider ${riderId} average rating: ${newAverage.toFixed(1)} (${newCount} ratings)`);
    }

    // Send notification to the rider
    await Notification.create({
      userId: booking.ride.userId,
      type: 'rider_rated',
      title: 'New Rating Received! ⭐',
      message: `You received a ${rating}-star rating for your ride from ${booking.ride.from} to ${booking.ride.to}${review ? `: "${review}"` : '.'}`,
      relatedId: booking.id
    });

    console.log(`✅ Booking ${bookingId} rated: ${rating} stars by user ${req.user.id}`);

    res.status(200).json({
      message: "Rating submitted successfully!",
      rating: {
        bookingId: booking.id,
        riderRating: rating,
        riderReview: review || null,
        ratedAt: booking.ratedAt
      }
    });
  } catch (error) {
    console.error("Rate rider error:", error);
    res.status(500).json({ 
      message: "Server error while submitting rating",
      error: error.message 
    });
  }
};

module.exports = { 
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
  rateRider
};
