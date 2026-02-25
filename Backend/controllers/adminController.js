


// const Verification = require("../models/Verification");
// const User = require("../models/User");
// const Notification = require("../models/Notification");
// const { Op } = require('sequelize');

// // Get all pending verifications
// const getPendingVerifications = async (req, res) => {
//   try {
//     const verifications = await Verification.findAll({
//       where: { status: 'pending' },
//       include: [{
//         model: User,
//         as: 'user',
//         attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
//       }],
//       order: [['submittedAt', 'ASC']]
//     });

//     res.status(200).json({ verifications });
//   } catch (error) {
//     console.error("Get pending verifications error:", error);
//     res.status(500).json({ 
//       message: "Error fetching pending verifications",
//       error: error.message
//     });
//   }
// };

// // Get all verifications (with filters)
// const getAllVerifications = async (req, res) => {
//   try {
//     const { status } = req.query;
    
//     const whereClause = status ? { status } : {};

//     const verifications = await Verification.findAll({
//       where: whereClause,
//       include: [{
//         model: User,
//         as: 'user',
//         attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
//       }],
//       order: [['createdAt', 'DESC']]
//     });

//     res.status(200).json({ verifications });
//   } catch (error) {
//     console.error("Get all verifications error:", error);
//     res.status(500).json({ 
//       message: "Error fetching verifications",
//       error: error.message
//     });
//   }
// };

// // ✅ UPDATED: Approve verification with better logic
// const approveVerification = async (req, res) => {
//   try {
//     const adminId = req.user.id;
//     const verificationId = req.params.id;
//     const { approvalType, remarks } = req.body;

//     console.log('=== APPROVE VERIFICATION ===');
//     console.log('Verification ID:', verificationId);
//     console.log('Approval Type:', approvalType);
//     console.log('Admin ID:', adminId);

//     const verification = await Verification.findByPk(verificationId);

//     if (!verification) {
//       return res.status(404).json({ message: "Verification not found" });
//     }

//     if (verification.status !== 'pending') {
//       return res.status(400).json({ message: "Verification already processed" });
//     }

//     const user = await User.findByPk(verification.userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let newStatus = '';
//     let notificationMessage = '';

//     // ✅ Determine what to approve based on what was submitted
//     if (approvalType === 'user' || verification.verificationType === 'user_only') {
//       // Approving citizenship verification
//       if (!verification.citizenshipNumber) {
//         return res.status(400).json({ 
//           message: "Cannot approve user verification without citizenship documents" 
//         });
//       }

//       newStatus = 'approved_user';
//       user.isVerifiedUser = true;
//       notificationMessage = 'Your citizenship has been verified! You now have a green verification tick. ✅';

//     } else if (approvalType === 'rider' || verification.verificationType === 'rider') {
//       // Approving license verification
//       if (!verification.drivingLicenseFront) {
//         return res.status(400).json({ 
//           message: "Cannot approve rider verification without driving license" 
//         });
//       }

//       newStatus = 'approved_rider';
//       user.isVerifiedRider = true;
//       notificationMessage = 'Your driving license has been verified! You now have a blue verification tick. 🔵';

//     } else if (approvalType === 'both' || verification.verificationType === 'both') {
//       // Approving both (legacy support)
//       if (!verification.citizenshipNumber || !verification.drivingLicenseFront) {
//         return res.status(400).json({ 
//           message: "Cannot approve both without all required documents" 
//         });
//       }

//       newStatus = 'approved_both';
//       user.isVerifiedUser = true;
//       user.isVerifiedRider = true;
//       notificationMessage = 'Your account has been fully verified! You can now request and offer rides. ✅🔵';

//     } else {
//       return res.status(400).json({ message: "Invalid approval type" });
//     }

//     verification.status = newStatus;
//     verification.adminRemarks = remarks || null;
//     verification.reviewedAt = new Date();
//     verification.reviewedBy = adminId;

//     await verification.save();
//     await user.save();

//     // Create notification for user
//     await Notification.create({
//       userId: verification.userId,
//       type: 'verification_approved',
//       title: 'Verification Approved! ✅',
//       message: notificationMessage,
//       relatedId: verification.id
//     });

//     console.log('✅ Verification approved successfully');
//     console.log('New Status:', newStatus);
//     console.log('User flags - isVerifiedUser:', user.isVerifiedUser, 'isVerifiedRider:', user.isVerifiedRider);

//     res.status(200).json({
//       message: "Verification approved successfully",
//       verification
//     });
//   } catch (error) {
//     console.error("Approve verification error:", error);
//     res.status(500).json({ 
//       message: "Error approving verification",
//       error: error.message
//     });
//   }
// };

// // Reject verification
// const rejectVerification = async (req, res) => {
//   try {
//     const adminId = req.user.id;
//     const verificationId = req.params.id;
//     const { remarks } = req.body;

//     if (!remarks) {
//       return res.status(400).json({ message: "Remarks are required for rejection" });
//     }

//     const verification = await Verification.findByPk(verificationId);

//     if (!verification) {
//       return res.status(404).json({ message: "Verification not found" });
//     }

//     if (verification.status !== 'pending') {
//       return res.status(400).json({ message: "Verification already processed" });
//     }

//     verification.status = 'rejected';
//     verification.adminRemarks = remarks;
//     verification.reviewedAt = new Date();
//     verification.reviewedBy = adminId;

//     await verification.save();

//     // Create notification for user
//     await Notification.create({
//       userId: verification.userId,
//       type: 'verification_rejected',
//       title: 'Verification Rejected',
//       message: `Your verification request has been rejected. Reason: ${remarks}`,
//       relatedId: verification.id
//     });

//     res.status(200).json({
//       message: "Verification rejected",
//       verification
//     });
//   } catch (error) {
//     console.error("Reject verification error:", error);
//     res.status(500).json({ 
//       message: "Error rejecting verification",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   getPendingVerifications,
//   getAllVerifications,
//   approveVerification,
//   rejectVerification
// };


const Verification = require("../models/Verification");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Ride = require("../models/Ride");
const RideBooking = require("../models/RideBooking");
const { Op } = require('sequelize');

// Get all pending verifications
const getPendingVerifications = async (req, res) => {
  try {
    const verifications = await Verification.findAll({
      where: { status: 'pending' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
      }],
      order: [['submittedAt', 'ASC']]
    });

    res.status(200).json({ verifications });
  } catch (error) {
    console.error("Get pending verifications error:", error);
    res.status(500).json({ 
      message: "Error fetching pending verifications",
      error: error.message
    });
  }
};

// Get all verifications (with filters)
const getAllVerifications = async (req, res) => {
  try {
    const { status } = req.query;
    
    const whereClause = status ? { status } : {};

    const verifications = await Verification.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ verifications });
  } catch (error) {
    console.error("Get all verifications error:", error);
    res.status(500).json({ 
      message: "Error fetching verifications",
      error: error.message
    });
  }
};

// ✅✅✅ UPDATED: Approve verification - "BOTH" option removed ✅✅✅
const approveVerification = async (req, res) => {
  try {
    const adminId = req.user.id;
    const verificationId = req.params.id;
    const { approvalType, remarks } = req.body;

    console.log('=== APPROVE VERIFICATION ===');
    console.log('Verification ID:', verificationId);
    console.log('Approval Type:', approvalType);
    console.log('Admin ID:', adminId);

    const verification = await Verification.findByPk(verificationId);

    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ message: "Verification already processed" });
    }

    const user = await User.findByPk(verification.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let newStatus = '';
    let notificationMessage = '';

    // ✅ UPDATED: Only "user" or "rider" - "both" removed
    if (approvalType === 'user') {
      // Approving citizenship verification
      if (!verification.citizenshipNumber) {
        return res.status(400).json({ 
          message: "Cannot approve user verification without citizenship documents" 
        });
      }

      newStatus = 'approved_user';
      user.isVerifiedUser = true;
      notificationMessage = 'Your citizenship has been verified! You now have a green verification tick. ✅';

    } else if (approvalType === 'rider') {
      // Approving license verification
      if (!verification.drivingLicenseFront) {
        return res.status(400).json({ 
          message: "Cannot approve rider verification without driving license" 
        });
      }

      newStatus = 'approved_rider';
      user.isVerifiedRider = true;
      notificationMessage = 'Your driving license has been verified! You now have a blue verification tick. 🔵';

    } else {
      // ❌ REMOVED: "both" option no longer supported
      return res.status(400).json({ 
        message: "Invalid approval type. Use 'user' or 'rider' only." 
      });
    }

    verification.status = newStatus;
    verification.adminRemarks = remarks || null;
    verification.reviewedAt = new Date();
    verification.reviewedBy = adminId;

    await verification.save();
    await user.save();

    // Create notification for user
    await Notification.create({
      userId: verification.userId,
      type: 'verification_approved',
      title: 'Verification Approved! ✅',
      message: notificationMessage,
      relatedId: verification.id
    });

    console.log('✅ Verification approved successfully');
    console.log('New Status:', newStatus);
    console.log('User flags - isVerifiedUser:', user.isVerifiedUser, 'isVerifiedRider:', user.isVerifiedRider);

    res.status(200).json({
      message: "Verification approved successfully",
      verification
    });
  } catch (error) {
    console.error("Approve verification error:", error);
    res.status(500).json({ 
      message: "Error approving verification",
      error: error.message
    });
  }
};

// Reject verification
const rejectVerification = async (req, res) => {
  try {
    const adminId = req.user.id;
    const verificationId = req.params.id;
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({ message: "Remarks are required for rejection" });
    }

    const verification = await Verification.findByPk(verificationId);

    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ message: "Verification already processed" });
    }

    verification.status = 'rejected';
    verification.adminRemarks = remarks;
    verification.reviewedAt = new Date();
    verification.reviewedBy = adminId;

    await verification.save();

    // Create notification for user
    await Notification.create({
      userId: verification.userId,
      type: 'verification_rejected',
      title: 'Verification Rejected',
      message: `Your verification request has been rejected. Reason: ${remarks}`,
      relatedId: verification.id
    });

    res.status(200).json({
      message: "Verification rejected",
      verification
    });
  } catch (error) {
    console.error("Reject verification error:", error);
    res.status(500).json({
      message: "Error rejecting verification",
      error: error.message
    });
  }
};

// Delete verification
const deleteVerification = async (req, res) => {
  try {
    const adminId = req.user.id;
    const verificationId = req.params.id;

    const verification = await Verification.findByPk(verificationId);

    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    // Delete the verification record
    await verification.destroy();

    console.log(`Admin ${adminId} deleted verification ${verificationId}`);

    res.status(200).json({
      message: "Verification deleted successfully"
    });
  } catch (error) {
    console.error("Delete verification error:", error);
    res.status(500).json({
      message: "Error deleting verification",
      error: error.message
    });
  }
};

// =====================================================
// ✅ USER MANAGEMENT ENDPOINTS
// =====================================================

const Report = require("../models/Report");
const sequelize = require("../config/db");

// Get all users with report counts
const getAllUsers = async (req, res) => {
  try {
    // Get all non-admin users with their report counts
    const users = await User.findAll({
      where: {
        role: 'user'
      },
      attributes: [
        'id',
        'username',
        'phone',
        'email',
        'profilePicture',
        'isVerifiedUser',
        'isVerifiedRider',
        'isSuspended',
        'createdAt',
        'riderAverageRating',
        'totalRatingsReceived'
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get report counts for each user (reports against them as rider)
    const usersWithReportCounts = await Promise.all(
      users.map(async (user) => {
        const reportCount = await Report.count({
          where: { reportedRiderId: user.id }
        });
        
        const pendingReportCount = await Report.count({
          where: { 
            reportedRiderId: user.id,
            status: 'pending'
          }
        });

        return {
          ...user.toJSON(),
          reportCount,
          pendingReportCount
        };
      })
    );

    res.status(200).json({ users: usersWithReportCounts });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });
  }
};

// Get single user details with full info
const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'phone',
        'email',
        'profilePicture',
        'isVerifiedUser',
        'isVerifiedRider',
        'isSuspended',
        'suspensionReason',
        'suspendedAt',
        'createdAt',
        'riderAverageRating',
        'totalRatingsReceived',
        'hasPaymentSetup',
        'hasMpinSetup'
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get reports against this user
    const reports = await Report.findAll({
      where: { reportedRiderId: userId },
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ 
      user: user.toJSON(),
      reports 
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      message: "Error fetching user details",
      error: error.message
    });
  }
};

// Suspend a user
const suspendUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const userId = req.params.id;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Suspension reason is required" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: "Cannot suspend an admin user" });
    }

    if (user.isSuspended) {
      return res.status(400).json({ message: "User is already suspended" });
    }

    user.isSuspended = true;
    user.suspensionReason = reason;
    user.suspendedAt = new Date();
    user.suspendedBy = adminId;

    await user.save();

    // Create notification for user
    await Notification.create({
      userId: userId,
      type: 'account_suspended',
      title: '⚠️ Account Suspended',
      message: `Your account has been suspended. Reason: ${reason}`,
      relatedId: null
    });

    console.log(`Admin ${adminId} suspended user ${userId}. Reason: ${reason}`);

    res.status(200).json({
      message: "User suspended successfully",
      user: {
        id: user.id,
        username: user.username,
        isSuspended: user.isSuspended,
        suspensionReason: user.suspensionReason,
        suspendedAt: user.suspendedAt
      }
    });
  } catch (error) {
    console.error("Suspend user error:", error);
    res.status(500).json({
      message: "Error suspending user",
      error: error.message
    });
  }
};

// Unsuspend (reactivate) a user
const unsuspendUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isSuspended) {
      return res.status(400).json({ message: "User is not suspended" });
    }

    user.isSuspended = false;
    user.suspensionReason = null;
    user.suspendedAt = null;
    user.suspendedBy = null;

    await user.save();

    // Create notification for user
    await Notification.create({
      userId: userId,
      type: 'account_reactivated',
      title: '✅ Account Reactivated',
      message: 'Your account has been reactivated. You can now use all features again.',
      relatedId: null
    });

    console.log(`Admin ${adminId} unsuspended user ${userId}`);

    res.status(200).json({
      message: "User reactivated successfully",
      user: {
        id: user.id,
        username: user.username,
        isSuspended: user.isSuspended
      }
    });
  } catch (error) {
    console.error("Unsuspend user error:", error);
    res.status(500).json({
      message: "Error reactivating user",
      error: error.message
    });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: "Cannot delete an admin user" });
    }

    const username = user.username;
    const email = user.email;

    // Delete the user (cascades will handle related records)
    await user.destroy();

    console.log(`Admin ${adminId} deleted user ${userId} (${username}, ${email})`);

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        id: userId,
        username,
        email
      }
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message
    });
  }
};

// =====================================================
// ✅ RIDE MANAGEMENT ENDPOINTS
// =====================================================

// Get all rides with rider info and booking counts
const getAllRides = async (req, res) => {
  try {
    const { search, status, from, to } = req.query;
    
    // Build where clause for rides
    const whereClause = {};
    
    // Search by ride ID
    if (search) {
      const searchTerm = search.trim();
      // If search is numeric, search by ID
      if (!isNaN(searchTerm)) {
        whereClause.id = parseInt(searchTerm);
      } else {
        // Search by route
        whereClause[Op.or] = [
          { from: { [Op.like]: `%${searchTerm}%` } },
          { to: { [Op.like]: `%${searchTerm}%` } }
        ];
      }
    }
    
    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    // Filter by from location
    if (from) {
      whereClause.from = { [Op.like]: `%${from}%` };
    }
    
    // Filter by to location
    if (to) {
      whereClause.to = { [Op.like]: `%${to}%` };
    }

    const rides = await Ride.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'phone', 'email', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider', 'riderAverageRating', 'totalRatingsReceived']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get booking counts for each ride
    const ridesWithBookingCounts = await Promise.all(
      rides.map(async (ride) => {
        const bookingCount = await RideBooking.count({
          where: { rideId: ride.id }
        });
        
        const confirmedBookings = await RideBooking.count({
          where: { 
            rideId: ride.id,
            bookingStatus: 'confirmed'
          }
        });

        return {
          ...ride.toJSON(),
          totalBookings: bookingCount,
          confirmedBookings
        };
      })
    );

    res.status(200).json({ rides: ridesWithBookingCounts });
  } catch (error) {
    console.error("Get all rides error:", error);
    res.status(500).json({
      message: "Error fetching rides",
      error: error.message
    });
  }
};

// Get single ride details with full info (rider + all passengers)
const getRideDetails = async (req, res) => {
  try {
    const rideId = req.params.id;

    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username', 'phone', 'email', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider', 'riderAverageRating', 'totalRatingsReceived', 'isSuspended']
        },
        {
          model: RideBooking,
          as: 'bookings',
          include: [
            {
              model: User,
              as: 'passenger',
              attributes: ['id', 'username', 'phone', 'email', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
            }
          ]
        }
      ]
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json({ ride });
  } catch (error) {
    console.error("Get ride details error:", error);
    res.status(500).json({
      message: "Error fetching ride details",
      error: error.message
    });
  }
};

// Delete a ride (admin only)
const deleteRide = async (req, res) => {
  try {
    const adminId = req.user.id;
    const rideId = req.params.id;

    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const rideInfo = {
      id: ride.id,
      from: ride.from,
      to: ride.to,
      rider: ride.rider?.username
    };

    // Delete the ride (cascades will handle bookings)
    await ride.destroy();

    console.log(`Admin ${adminId} deleted ride ${rideId}`, rideInfo);

    res.status(200).json({
      message: "Ride deleted successfully",
      deletedRide: rideInfo
    });
  } catch (error) {
    console.error("Delete ride error:", error);
    res.status(500).json({
      message: "Error deleting ride",
      error: error.message
    });
  }
};

// Cancel a ride (admin action)
const cancelRide = async (req, res) => {
  try {
    const adminId = req.user.id;
    const rideId = req.params.id;
    const { reason } = req.body;

    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: 'rider',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status === 'cancelled') {
      return res.status(400).json({ message: "Ride is already cancelled" });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Notify the rider
    await Notification.create({
      userId: ride.userId,
      type: 'ride_cancelled',
      title: '⚠️ Ride Cancelled by Admin',
      message: `Your ride from ${ride.from} to ${ride.to} has been cancelled by admin.${reason ? ` Reason: ${reason}` : ''}`,
      relatedId: ride.id
    });

    // Notify all passengers with confirmed bookings
    const bookings = await RideBooking.findAll({
      where: { 
        rideId: ride.id,
        bookingStatus: 'confirmed'
      }
    });

    for (const booking of bookings) {
      booking.bookingStatus = 'cancelled';
      await booking.save();

      await Notification.create({
        userId: booking.passengerId,
        type: 'booking_cancelled',
        title: '⚠️ Booking Cancelled',
        message: `Your booking for ride from ${ride.from} to ${ride.to} has been cancelled by admin.${reason ? ` Reason: ${reason}` : ''}`,
        relatedId: booking.id
      });
    }

    console.log(`Admin ${adminId} cancelled ride ${rideId}. Reason: ${reason || 'Not specified'}`);

    res.status(200).json({
      message: "Ride cancelled successfully",
      ride: {
        id: ride.id,
        from: ride.from,
        to: ride.to,
        status: ride.status
      }
    });
  } catch (error) {
    console.error("Cancel ride error:", error);
    res.status(500).json({
      message: "Error cancelling ride",
      error: error.message
    });
  }
};

module.exports = {
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
  deleteVerification,
  // User management
  getAllUsers,
  getUserDetails,
  suspendUser,
  unsuspendUser,
  deleteUser,
  // Ride management
  getAllRides,
  getRideDetails,
  deleteRide,
  cancelRide
};
