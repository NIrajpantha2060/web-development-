const Verification = require("../models/verification");
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
        as: 'user', // ✅ IMPORTANT: Use the alias defined in the model
        attributes: ['id', 'username', 'email', 'phone', 'profilePicture']
      }],
      order: [['submittedAt', 'ASC']]
    });

    res.status(200).json({ verifications });
  } catch (error) {
    console.error("Get pending verifications error:", error);
    res.status(500).json({ 
      message: "Error fetching pending verifications",
      error: error.message // ✅ Added for debugging
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
        as: 'user', // ✅ IMPORTANT: Use the alias defined in the model
        attributes: ['id', 'username', 'email', 'phone', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ verifications });
  } catch (error) {
    console.error("Get all verifications error:", error);
    res.status(500).json({ 
      message: "Error fetching verifications",
      error: error.message // ✅ Added for debugging
    });
  }
};

// Approve verification (user, rider, or both)
const approveVerification = async (req, res) => {
  try {
    const adminId = req.user.id;
    const verificationId = req.params.id;
    const { approvalType, remarks } = req.body;

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

    // Check if trying to approve rider without driving license
    if ((approvalType === 'rider' || approvalType === 'both') && 
        !verification.drivingLicenseFront) {
      return res.status(400).json({ 
        message: "Cannot approve rider verification without driving license" 
      });
    }

    // Update verification status
    let newStatus = '';
    let notificationMessage = '';

    if (approvalType === 'user') {
      newStatus = 'approved_user';
      user.isVerifiedUser = true;
      notificationMessage = 'Your account has been verified as a User! You can now request rides.';
    } else if (approvalType === 'rider') {
      newStatus = 'approved_rider';
      user.isVerifiedRider = true;
      notificationMessage = 'Your account has been verified as a Rider! You can now offer rides.';
    } else if (approvalType === 'both') {
      newStatus = 'approved_both';
      user.isVerifiedUser = true;
      user.isVerifiedRider = true;
      notificationMessage = 'Your account has been fully verified! You can now request and offer rides.';
    } else {
      return res.status(400).json({ message: "Invalid approval type" });
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

    res.status(200).json({
      message: "Verification approved successfully",
      verification
    });
  } catch (error) {
    console.error("Approve verification error:", error);
    res.status(500).json({ 
      message: "Error approving verification",
      error: error.message // ✅ Added for debugging
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
      error: error.message // ✅ Added for debugging
    });
  }
};

module.exports = {
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification
};