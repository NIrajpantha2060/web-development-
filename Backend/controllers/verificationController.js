const Verification = require("../models/verification");
const User = require("../models/User");
const Notification = require("../models/Notification");
const fs = require('fs');
const path = require('path');

// Submit verification request
const submitVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { citizenshipNumber, drivingLicenseNumber, verificationType } = req.body;

    // Validate required files
    if (!req.files || !req.files.citizenshipFront || !req.files.citizenshipBack) {
      return res.status(400).json({ 
        message: "Citizenship front and back photos are required" 
      });
    }

    // Check if requesting rider verification without license
    if ((verificationType === 'rider' || verificationType === 'both') && 
        (!req.files.drivingLicenseFront || !req.files.drivingLicenseBack)) {
      return res.status(400).json({ 
        message: "Driving license photos are required for rider verification" 
      });
    }

    // Check if user already has a pending verification
    const existingVerification = await Verification.findOne({
      where: { userId, status: 'pending' }
    });

    if (existingVerification) {
      return res.status(400).json({ 
        message: "You already have a pending verification request" 
      });
    }

    // Create verification record
    const verificationData = {
      userId,
      citizenshipFront: `/uploads/documents/${req.files.citizenshipFront[0].filename}`,
      citizenshipBack: `/uploads/documents/${req.files.citizenshipBack[0].filename}`,
      citizenshipNumber,
      verificationType,
      status: 'pending'
    };

    // Add driving license if provided
    if (req.files.drivingLicenseFront && req.files.drivingLicenseBack) {
      verificationData.drivingLicenseFront = `/uploads/documents/${req.files.drivingLicenseFront[0].filename}`;
      verificationData.drivingLicenseBack = `/uploads/documents/${req.files.drivingLicenseBack[0].filename}`;
      verificationData.drivingLicenseNumber = drivingLicenseNumber;
    }

    const verification = await Verification.create(verificationData);

    // Create notification for user
    await Notification.create({
      userId,
      type: 'verification_pending',
      title: 'Verification Submitted',
      message: 'Your verification documents have been submitted and are under review.',
      relatedId: verification.id
    });

    res.status(201).json({
      message: "Verification request submitted successfully",
      verification: {
        id: verification.id,
        status: verification.status,
        verificationType: verification.verificationType
      }
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    
    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
    
    res.status(500).json({ message: "Error submitting verification request" });
  }
};

// Get user's verification status
const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const verification = await Verification.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    const user = await User.findByPk(userId, {
      attributes: ['isVerifiedUser', 'isVerifiedRider']
    });

    res.status(200).json({
      verification: verification || null,
      isVerifiedUser: user.isVerifiedUser,
      isVerifiedRider: user.isVerifiedRider
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    res.status(500).json({ message: "Error fetching verification status" });
  }
};

// Get verification details (for viewing documents)
const getVerificationDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const verificationId = req.params.id;

    const verification = await Verification.findOne({
      where: { id: verificationId, userId }
    });

    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    res.status(200).json({ verification });
  } catch (error) {
    console.error("Get verification details error:", error);
    res.status(500).json({ message: "Error fetching verification details" });
  }
};

module.exports = {
  submitVerification,
  getVerificationStatus,
  getVerificationDetails
};