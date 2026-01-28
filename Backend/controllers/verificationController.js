// const Verification = require("../models/verification");
// const User = require("../models/User");
// const Notification = require("../models/Notification");
// const fs = require('fs');
// const path = require('path');

// // Submit verification request
// const submitVerification = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { citizenshipNumber, drivingLicenseNumber, verificationType } = req.body;

//     // Validate required files
//     if (!req.files || !req.files.citizenshipFront || !req.files.citizenshipBack) {
//       return res.status(400).json({ 
//         message: "Citizenship front and back photos are required" 
//       });
//     }

//     // Check if requesting rider verification without license
//     if ((verificationType === 'rider' || verificationType === 'both') && 
//         (!req.files.drivingLicenseFront || !req.files.drivingLicenseBack)) {
//       return res.status(400).json({ 
//         message: "Driving license photos are required for rider verification" 
//       });
//     }

//     // Check if user already has a pending verification
//     const existingVerification = await Verification.findOne({
//       where: { userId, status: 'pending' }
//     });

//     if (existingVerification) {
//       return res.status(400).json({ 
//         message: "You already have a pending verification request" 
//       });
//     }

//     // Create verification record
//     const verificationData = {
//       userId,
//       citizenshipFront: `/uploads/documents/${req.files.citizenshipFront[0].filename}`,
//       citizenshipBack: `/uploads/documents/${req.files.citizenshipBack[0].filename}`,
//       citizenshipNumber,
//       verificationType,
//       status: 'pending'
//     };

//     // Add driving license if provided
//     if (req.files.drivingLicenseFront && req.files.drivingLicenseBack) {
//       verificationData.drivingLicenseFront = `/uploads/documents/${req.files.drivingLicenseFront[0].filename}`;
//       verificationData.drivingLicenseBack = `/uploads/documents/${req.files.drivingLicenseBack[0].filename}`;
//       verificationData.drivingLicenseNumber = drivingLicenseNumber;
//     }

//     const verification = await Verification.create(verificationData);

//     // Create notification for user
//     await Notification.create({
//       userId,
//       type: 'verification_pending',
//       title: 'Verification Submitted',
//       message: 'Your verification documents have been submitted and are under review.',
//       relatedId: verification.id
//     });

//     res.status(201).json({
//       message: "Verification request submitted successfully",
//       verification: {
//         id: verification.id,
//         status: verification.status,
//         verificationType: verification.verificationType
//       }
//     });
//   } catch (error) {
//     console.error("Submit verification error:", error);
    
//     // Clean up uploaded files on error
//     if (req.files) {
//       Object.values(req.files).forEach(fileArray => {
//         fileArray.forEach(file => {
//           if (fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path);
//           }
//         });
//       });
//     }
    
//     res.status(500).json({ message: "Error submitting verification request" });
//   }
// };

// // Get user's verification status
// const getVerificationStatus = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const verification = await Verification.findOne({
//       where: { userId },
//       order: [['createdAt', 'DESC']]
//     });

//     const user = await User.findByPk(userId, {
//       attributes: ['isVerifiedUser', 'isVerifiedRider']
//     });

//     res.status(200).json({
//       verification: verification || null,
//       isVerifiedUser: user.isVerifiedUser,
//       isVerifiedRider: user.isVerifiedRider
//     });
//   } catch (error) {
//     console.error("Get verification status error:", error);
//     res.status(500).json({ message: "Error fetching verification status" });
//   }
// };

// // Get verification details (for viewing documents)
// const getVerificationDetails = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const verificationId = req.params.id;

//     const verification = await Verification.findOne({
//       where: { id: verificationId, userId }
//     });

//     if (!verification) {
//       return res.status(404).json({ message: "Verification not found" });
//     }

//     res.status(200).json({ verification });
//   } catch (error) {
//     console.error("Get verification details error:", error);
//     res.status(500).json({ message: "Error fetching verification details" });
//   }
// };

// module.exports = {
//   submitVerification,
//   getVerificationStatus,
//   getVerificationDetails
// };

const Verification = require("../models/verification");
const User = require("../models/User");
const Notification = require("../models/Notification");
const fs = require('fs');
const path = require('path');

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
      return res.status(400).json({ 
        message: "You already have a pending verification request" 
      });
    }

    // ✅ Store paths WITHOUT leading slash (consistent with your database)
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

    // ✅ Verify files actually exist on disk before saving to database
    const filesToCheck = [
      req.files.citizenshipFront[0].path,
      req.files.citizenshipBack[0].path
    ];
    
    if (req.files.drivingLicenseFront) {
      filesToCheck.push(req.files.drivingLicenseFront[0].path);
      filesToCheck.push(req.files.drivingLicenseBack[0].path);
    }

    console.log('🔍 Verifying files exist on disk...');
    const allFilesExist = filesToCheck.every(filePath => {
      const exists = fs.existsSync(filePath);
      console.log(`   ${path.basename(filePath)}: ${exists ? '✅' : '❌'}`);
      return exists;
    });

    if (!allFilesExist) {
      console.error('❌ One or more files do not exist on disk!');
      return res.status(500).json({ 
        message: "File upload failed - files not saved to disk. Please try again." 
      });
    }

    console.log('✅ All files verified on disk');

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
      console.log('🧹 Cleaning up uploaded files...');
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