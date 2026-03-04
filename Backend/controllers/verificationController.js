
const Verification = require("../models/Verification");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// ✅ CRITICAL FIX: Helper function to verify file exists with retry logic
const verifyFileWithRetry = async (fileInfo, maxRetries = 5, retryDelay = 200) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const exists = fs.existsSync(fileInfo.path);
      
      if (exists) {
        const stats = fs.statSync(fileInfo.path);
        
        if (stats.size > 0 && stats.size === fileInfo.size) {
          const fd = fs.openSync(fileInfo.path, 'r');
          fs.closeSync(fd);
          
          console.log(`✅ ${fileInfo.filename}: Verified (${stats.size} bytes)`);
          return true;
        } else {
          console.log(`⏳ ${fileInfo.filename}: Waiting for write completion... (attempt ${attempt + 1}/${maxRetries})`);
        }
      } else {
        console.log(`⏳ ${fileInfo.filename}: File not found yet... (attempt ${attempt + 1}/${maxRetries})`);
      }
    } catch (error) {
      console.error(`⚠️  ${fileInfo.filename}: Verification error:`, error.message);
    }
    
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  return false;
};

// ✅ NEW: Submit Citizenship Verification (User Only)
const submitCitizenshipVerification = async (req, res) => {
  try {
    console.log('\n=== SUBMIT CITIZENSHIP VERIFICATION ===');
    console.log('User ID:', req.user.id);
    console.log('Body:', req.body);
    console.log('Files received:', req.files ? Object.keys(req.files) : 'None');
    
    const userId = req.user.id;
    const { citizenshipNumber } = req.body;

    // Validate required files
    if (!req.files || !req.files.citizenshipFront || !req.files.citizenshipBack) {
      console.error('❌ Missing required citizenship files');
      return res.status(400).json({ 
        message: "Citizenship front and back photos are required" 
      });
    }

    // ✅ Check if citizenship number already exists and is verified
    const existingCitizenship = await Verification.findOne({
      where: {
        citizenshipNumber,
        status: {
          [Op.in]: ['approved_user', 'approved_rider', 'approved_both']
        }
      }
    });

    if (existingCitizenship) {
      console.log('⚠️  Citizenship number already verified');
      
      // Clean up uploaded files
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🧹 Cleaned up: ${file.filename}`);
          }
        });
      });
      
      return res.status(400).json({ 
        message: "This citizenship number is already verified in our system" 
      });
    }

    // ✅ Check if user already has a pending verification
    const existingPending = await Verification.findOne({
      where: { userId, status: 'pending' }
    });

    if (existingPending) {
      console.log('⚠️  User already has pending verification');
      
      // Clean up uploaded files
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🧹 Cleaned up: ${file.filename}`);
          }
        });
      });
      
      return res.status(400).json({ 
        message: "You already have a pending verification request" 
      });
    }

    // ✅ Verify files are written to disk
    const filesToVerify = [
      req.files.citizenshipFront[0],
      req.files.citizenshipBack[0]
    ];

    console.log('🔍 Verifying all files are fully written to disk...');
    
    for (const fileInfo of filesToVerify) {
      const isReady = await verifyFileWithRetry(fileInfo);
      
      if (!isReady) {
        console.error(`❌ ${fileInfo.filename}: FAILED after 5 attempts`);
        
        filesToVerify.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🧹 Cleaned up: ${file.filename}`);
          }
        });
        
        return res.status(500).json({ 
          message: `File upload failed: ${fileInfo.filename} could not be written to disk. Please try again.`
        });
      }
    }

    console.log('✅ All files verified and ready');

    // Create verification record
    const verificationData = {
      userId,
      citizenshipFront: `uploads/documents/${req.files.citizenshipFront[0].filename}`,
      citizenshipBack: `uploads/documents/${req.files.citizenshipBack[0].filename}`,
      citizenshipNumber,
      verificationType: 'user_only',
      status: 'pending'
    };

    const verification = await Verification.create(verificationData);
    console.log('✅ Citizenship verification record created:', verification.id);

    // Create notification
    await Notification.create({
      userId,
      type: 'verification_pending',
      title: 'Citizenship Verification Submitted',
      message: 'Your citizenship documents have been submitted and are under review.',
      relatedId: verification.id
    });

    console.log('=== CITIZENSHIP VERIFICATION SUBMITTED SUCCESSFULLY ===\n');

    res.status(201).json({
      message: "Citizenship verification request submitted successfully",
      verification: {
        id: verification.id,
        status: verification.status,
        verificationType: verification.verificationType
      }
    });
  } catch (error) {
    console.error("❌ Submit citizenship verification error:", error);
    
    // Clean up uploaded files on error
    if (req.files) {
      console.log('🧹 Cleaning up uploaded files due to error...');
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`   Deleted: ${file.filename}`);
          }
        });
      });
    }
    
    res.status(500).json({ 
      message: "Error submitting citizenship verification request",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ NEW: Submit Rider Verification (License Only)
const submitRiderVerification = async (req, res) => {
  try {
    console.log('\n=== SUBMIT RIDER VERIFICATION ===');
    console.log('User ID:', req.user.id);
    console.log('Body:', req.body);
    console.log('Files received:', req.files ? Object.keys(req.files) : 'None');
    
    const userId = req.user.id;
    const { drivingLicenseNumber, licenseExpiryDate } = req.body;

    // Validate required files
    if (!req.files || !req.files.drivingLicenseFront) {
      console.error('❌ Missing required license file');
      return res.status(400).json({ 
        message: "Driving license front photo is required" 
      });
    }

    // ✅ Check if license number already exists and is verified
    const existingLicense = await Verification.findOne({
      where: {
        drivingLicenseNumber,
        status: {
          [Op.in]: ['approved_rider', 'approved_both']
        }
      }
    });

    if (existingLicense) {
      console.log('⚠️  License number already verified');
      
      // Clean up uploaded files
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🧹 Cleaned up: ${file.filename}`);
          }
        });
      });
      
      return res.status(400).json({ 
        message: "This driving license number is already verified in our system" 
      });
    }

    // ✅ Check if user already has a pending verification
    const existingPending = await Verification.findOne({
      where: { userId, status: 'pending' }
    });

    if (existingPending) {
      console.log('⚠️  User already has pending verification');
      
      // Clean up uploaded files
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🧹 Cleaned up: ${file.filename}`);
          }
        });
      });
      
      return res.status(400).json({ 
        message: "You already have a pending verification request" 
      });
    }

    // ✅ Verify files are written to disk
    const filesToVerify = [req.files.drivingLicenseFront[0]];

    console.log('🔍 Verifying all files are fully written to disk...');
    
    for (const fileInfo of filesToVerify) {
      const isReady = await verifyFileWithRetry(fileInfo);
      
      if (!isReady) {
        console.error(`❌ ${fileInfo.filename}: FAILED after 5 attempts`);
        
        filesToVerify.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🧹 Cleaned up: ${file.filename}`);
          }
        });
        
        return res.status(500).json({ 
          message: `File upload failed: ${fileInfo.filename} could not be written to disk. Please try again.`
        });
      }
    }

    console.log('✅ All files verified and ready');

    // Create verification record
    const verificationData = {
      userId,
      drivingLicenseFront: `uploads/documents/${req.files.drivingLicenseFront[0].filename}`,
      drivingLicenseNumber,
      licenseExpiryDate: licenseExpiryDate || null,
      verificationType: 'rider',
      status: 'pending'
    };

    // Add back image if provided
    if (req.files.drivingLicenseBack) {
      verificationData.drivingLicenseBack = `uploads/documents/${req.files.drivingLicenseBack[0].filename}`;
    }

    const verification = await Verification.create(verificationData);
    console.log('✅ Rider verification record created:', verification.id);

    // Create notification
    await Notification.create({
      userId,
      type: 'verification_pending',
      title: 'Rider Verification Submitted',
      message: 'Your driving license documents have been submitted and are under review.',
      relatedId: verification.id
    });

    console.log('=== RIDER VERIFICATION SUBMITTED SUCCESSFULLY ===\n');

    res.status(201).json({
      message: "Rider verification request submitted successfully",
      verification: {
        id: verification.id,
        status: verification.status,
        verificationType: verification.verificationType
      }
    });
  } catch (error) {
    console.error("❌ Submit rider verification error:", error);
    
    // Clean up uploaded files on error
    if (req.files) {
      console.log('🧹 Cleaning up uploaded files due to error...');
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`   Deleted: ${file.filename}`);
          }
        });
      });
    }
    
    res.status(500).json({ 
      message: "Error submitting rider verification request",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



// ✅ NEW: Upgrade to Rider (for verified users)
const upgradeToRider = async (req, res) => {
  try {
    console.log('\n=== UPGRADE TO RIDER ===');
    console.log('User ID:', req.user.id);
    
    const userId = req.user.id;
    const { drivingLicenseNumber, licenseExpiryDate } = req.body;

    // Check if user is verified as user
    const user = await User.findByPk(userId);
    if (!user.isVerifiedUser) {
      return res.status(403).json({ 
        message: "You must be verified as a user first" 
      });
    }

    // Validate required files
    if (!req.files || !req.files.drivingLicenseFront) {
      return res.status(400).json({ 
        message: "Driving license front photo is required" 
      });
    }

    // ✅ Check if license number already exists and is verified
    const existingLicense = await Verification.findOne({
      where: {
        drivingLicenseNumber,
        status: {
          [Op.in]: ['approved_rider', 'approved_both']
        }
      }
    });

    if (existingLicense) {
      // Clean up uploaded files
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
      
      return res.status(400).json({ 
        message: "This driving license number is already verified in our system" 
      });
    }

    // ✅ Check if user already has a pending verification
    const existingPending = await Verification.findOne({
      where: { userId, status: 'pending' }
    });

    if (existingPending) {
      // Clean up uploaded files
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
      
      return res.status(400).json({ 
        message: "You already have a pending verification request" 
      });
    }

    // ✅ Verify files are written to disk
    const filesToVerify = [req.files.drivingLicenseFront[0]];
    if (req.files.drivingLicenseBack) {
      filesToVerify.push(req.files.drivingLicenseBack[0]);
    }

    for (const fileInfo of filesToVerify) {
      const isReady = await verifyFileWithRetry(fileInfo);
      
      if (!isReady) {
        filesToVerify.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
        
        return res.status(500).json({ 
          message: `File upload failed. Please try again.`
        });
      }
    }

    // ✅ CRITICAL FIX: Create rider verification WITHOUT citizenship data
    const verificationData = {
      userId,
      // ✅ Only license data - NO CITIZENSHIP!
      drivingLicenseFront: `uploads/documents/${req.files.drivingLicenseFront[0].filename}`,
      drivingLicenseNumber,
      licenseExpiryDate: licenseExpiryDate || null,
      verificationType: 'rider',
      status: 'pending',
      // ✅ Explicitly set citizenship fields to NULL
      citizenshipFront: null,
      citizenshipBack: null,
      citizenshipNumber: null
    };

    if (req.files.drivingLicenseBack) {
      verificationData.drivingLicenseBack = `uploads/documents/${req.files.drivingLicenseBack[0].filename}`;
    }

    const verification = await Verification.create(verificationData);
    
    console.log('✅ Rider upgrade created without citizenship data:', {
      id: verification.id,
      verificationType: verification.verificationType,
      hasCitizenship: !!verification.citizenshipNumber,
      hasLicense: !!verification.drivingLicenseFront
    });

    // Create notification
    await Notification.create({
      userId,
      type: 'verification_pending',
      title: 'Rider Upgrade Submitted',
      message: 'Your rider upgrade request has been submitted and is under review.',
      relatedId: verification.id
    });

    res.status(201).json({
      message: "Rider upgrade request submitted successfully",
      verification: {
        id: verification.id,
        status: verification.status,
        verificationType: verification.verificationType
      }
    });
  } catch (error) {
    console.error("❌ Upgrade to rider error:", error);
    
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
    
    res.status(500).json({ 
      message: "Error submitting rider upgrade request",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ NEW: Update Verification (for rejected or expired documents)
const updateVerification = async (req, res) => {
  try {
    console.log('\n=== UPDATE VERIFICATION ===');
    console.log('User ID:', req.user.id);
    
    const userId = req.user.id;
    const { updateType } = req.body; // 'citizenship' or 'license'

    const user = await User.findByPk(userId);

    if (updateType === 'citizenship') {
      // Update citizenship documents
      const { citizenshipNumber } = req.body;

      if (!req.files || !req.files.citizenshipFront || !req.files.citizenshipBack) {
        return res.status(400).json({ 
          message: "Citizenship front and back photos are required" 
        });
      }

      // Verify files
      const filesToVerify = [
        req.files.citizenshipFront[0],
        req.files.citizenshipBack[0]
      ];

      for (const fileInfo of filesToVerify) {
        const isReady = await verifyFileWithRetry(fileInfo);
        if (!isReady) {
          filesToVerify.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
          return res.status(500).json({ message: `File upload failed. Please try again.` });
        }
      }

      // Create new verification record
      const verificationData = {
        userId,
        citizenshipFront: `uploads/documents/${req.files.citizenshipFront[0].filename}`,
        citizenshipBack: `uploads/documents/${req.files.citizenshipBack[0].filename}`,
        citizenshipNumber,
        verificationType: 'user_only',
        status: 'pending'
      };

      const verification = await Verification.create(verificationData);

      await Notification.create({
        userId,
        type: 'verification_pending',
        title: 'Citizenship Update Submitted',
        message: 'Your updated citizenship documents have been submitted for review.',
        relatedId: verification.id
      });

      res.status(201).json({
        message: "Citizenship documents updated successfully",
        verification: {
          id: verification.id,
          status: verification.status
        }
      });

    } else if (updateType === 'license') {
      // Update license documents
      const { drivingLicenseNumber, licenseExpiryDate } = req.body;

      if (!req.files || !req.files.drivingLicenseFront) {
        return res.status(400).json({ 
          message: "Driving license front photo is required" 
        });
      }

      // Verify files
      const filesToVerify = [req.files.drivingLicenseFront[0]];
      if (req.files.drivingLicenseBack) {
        filesToVerify.push(req.files.drivingLicenseBack[0]);
      }

      for (const fileInfo of filesToVerify) {
        const isReady = await verifyFileWithRetry(fileInfo);
        if (!isReady) {
          filesToVerify.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
          return res.status(500).json({ message: `File upload failed. Please try again.` });
        }
      }

      // Create new verification record
      const verificationData = {
        userId,
        drivingLicenseFront: `uploads/documents/${req.files.drivingLicenseFront[0].filename}`,
        drivingLicenseNumber,
        licenseExpiryDate: licenseExpiryDate || null,
        verificationType: 'rider',
        status: 'pending'
      };

      if (req.files.drivingLicenseBack) {
        verificationData.drivingLicenseBack = `uploads/documents/${req.files.drivingLicenseBack[0].filename}`;
      }

      const verification = await Verification.create(verificationData);

      await Notification.create({
        userId,
        type: 'verification_pending',
        title: 'License Update Submitted',
        message: 'Your updated driving license documents have been submitted for review.',
        relatedId: verification.id
      });

      res.status(201).json({
        message: "License documents updated successfully",
        verification: {
          id: verification.id,
          status: verification.status
        }
      });

    } else {
      return res.status(400).json({ message: "Invalid update type" });
    }

  } catch (error) {
    console.error("❌ Update verification error:", error);
    
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
    
    res.status(500).json({ 
      message: "Error updating verification",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

// Get verification details
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
  submitCitizenshipVerification,
  submitRiderVerification,
  upgradeToRider,
  updateVerification,
  getVerificationStatus,
  getVerificationDetails
};