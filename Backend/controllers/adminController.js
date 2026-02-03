


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

module.exports = {
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
  deleteVerification
};
