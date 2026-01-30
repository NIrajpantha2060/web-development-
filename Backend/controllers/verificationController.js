const Verification = require("../models/verification");
const User = require("../models/User");
const Notification = require("../models/Notification");
const fs = require('fs');
const path = require('path');

// ✅ CRITICAL FIX: Helper function to verify file exists with retry logic
const verifyFileWithRetry = async (fileInfo, maxRetries = 5, retryDelay = 200) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Check if file exists
      const exists = fs.existsSync(fileInfo.path);
      
      if (exists) {
        // ✅ CRITICAL: Verify file is not empty and fully written
        const stats = fs.statSync(fileInfo.path);
        
        if (stats.size > 0 && stats.size === fileInfo.size) {
          // ✅ Extra safety: Try to read a byte to ensure file is accessible
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
    
    // Wait before retry
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  return false;
};

// Submit verification request
const submitVerification = async (req, res) => {
  try {
    console.log('\n=== SUBMIT VERIFICATION REQUEST ===');
    console.log('User ID:', req.user.id);
    console.log('Body:', req.body);
    console.log('Files received:', req.files ? Object.keys(req.files) : 'None');
    
    const userId = req.user.id;
    const { citizenshipNumber, drivingLicenseNumber, verificationType } = req.body;

    // Validate required files
    if (!req.files || !req.files.citizenshipFront || !req.files.citizenshipBack) {
      console.error('❌ Missing required citizenship files');
      return res.status(400).json({ 
        message: "Citizenship front and back photos are required" 
      });
    }

    // Check if requesting rider verification without license
    if ((verificationType === 'rider' || verificationType === 'both') && 
        (!req.files.drivingLicenseFront || !req.files.drivingLicenseBack)) {
      console.error('❌ Missing driving license files for rider verification');
      return res.status(400).json({ 
        message: "Driving license photos are required for rider verification" 
      });
    }

    // Check if user already has a pending verification
    const existingVerification = await Verification.findOne({
      where: { userId, status: 'pending' }
    });

    if (existingVerification) {
      console.log('⚠️  User already has pending verification');
      
      // ✅ FIX: Clean up uploaded files before returning error
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

    // ✅ CRITICAL FIX: Collect all files that need verification
    const filesToVerify = [
      req.files.citizenshipFront[0],
      req.files.citizenshipBack[0]
    ];
    
    if (req.files.drivingLicenseFront) {
      filesToVerify.push(req.files.drivingLicenseFront[0]);
      filesToVerify.push(req.files.drivingLicenseBack[0]);
    }

    // ✅ CRITICAL FIX: Wait for ALL file writes to complete with retry logic
    console.log('🔍 Verifying all files are fully written to disk...');
    
    for (const fileInfo of filesToVerify) {
      const isReady = await verifyFileWithRetry(fileInfo);
      
      if (!isReady) {
        console.error(`❌ ${fileInfo.filename}: FAILED after 5 attempts`);
        
        // ✅ Clean up all uploaded files
        filesToVerify.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🧹 Cleaned up: ${file.filename}`);
          }
        });
        
        return res.status(500).json({ 
          message: `File upload failed: ${fileInfo.filename} could not be written to disk. This may be due to antivirus software, file system issues, or insufficient permissions. Please try again.`
        });
      }
    }

    console.log('✅ All files verified and ready');

    // ✅ Now it's safe to save paths to database
    const verificationData = {
      userId,
      citizenshipFront: `uploads/documents/${req.files.citizenshipFront[0].filename}`,
      citizenshipBack: `uploads/documents/${req.files.citizenshipBack[0].filename}`,
      citizenshipNumber,
      verificationType,
      status: 'pending'
    };

    console.log('📄 Citizenship Front Path:', verificationData.citizenshipFront);
    console.log('📄 Citizenship Back Path:', verificationData.citizenshipBack);

    // Add driving license if provided
    if (req.files.drivingLicenseFront && req.files.drivingLicenseBack) {
      verificationData.drivingLicenseFront = `uploads/documents/${req.files.drivingLicenseFront[0].filename}`;
      verificationData.drivingLicenseBack = `uploads/documents/${req.files.drivingLicenseBack[0].filename}`;
      verificationData.drivingLicenseNumber = drivingLicenseNumber;
      
      console.log('📄 License Front Path:', verificationData.drivingLicenseFront);
      console.log('📄 License Back Path:', verificationData.drivingLicenseBack);
    }

    // Create verification record
    const verification = await Verification.create(verificationData);
    console.log('✅ Verification record created:', verification.id);

    // Create notification for user
    await Notification.create({
      userId,
      type: 'verification_pending',
      title: 'Verification Submitted',
      message: 'Your verification documents have been submitted and are under review.',
      relatedId: verification.id
    });
    console.log('✅ Notification created');
    console.log('=== VERIFICATION SUBMITTED SUCCESSFULLY ===\n');

    res.status(201).json({
      message: "Verification request submitted successfully",
      verification: {
        id: verification.id,
        status: verification.status,
        verificationType: verification.verificationType,
        citizenshipFront: verification.citizenshipFront,
        citizenshipBack: verification.citizenshipBack
      }
    });
  } catch (error) {
    console.error("❌ Submit verification error:", error);
    
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
      message: "Error submitting verification request",
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