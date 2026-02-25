// const User = require("../models/User");

// // GET user info
// const getUserInfo = async (req, res) => {
//   try {
//     const userId = req.user.id; // From authMiddleware

//     const user = await User.findByPk(userId, {
//       attributes: ['id', 'username', 'email', 'phone', 'role', 'createdAt', 'updatedAt']
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error("Get user info error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // UPDATE user info
// const updateUserInfo = async (req, res) => {
//   try {
//     const userId = req.user.id; // From authMiddleware
//     const { username, phone } = req.body;

//     // Validation
//     if (!username || !phone) {
//       return res.status(400).json({ message: "Username and phone are required" });
//     }

//     // Validate phone format (Nepal: 97/98 followed by 8 digits)
//     const phoneRegex = /^(97|98)\d{8}$/;
//     if (!phoneRegex.test(phone)) {
//       return res.status(400).json({ message: "Invalid phone number format" });
//     }

//     // Check if phone is already taken by another user
//     const existingUser = await User.findOne({ 
//       where: { 
//         phone,
//         id: { [require('sequelize').Op.ne]: userId } // Not equal to current user
//       } 
//     });

//     if (existingUser) {
//       return res.status(400).json({ message: "Phone number already in use" });
//     }

//     // Update user
//     const user = await User.findByPk(userId);
    
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.username = username;
//     user.phone = phone;
//     await user.save();

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error("Update user info error:", error);
//     res.status(500).json({ message: "Server error during update" });
//   }
// };

// module.exports = { getUserInfo, updateUserInfo };



const User = require("../models/User");
const fs = require('fs');
const path = require('path');

// GET user info
const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'phone', 'role', 'profilePicture', 'createdAt', 'updatedAt', 'isVerifiedUser', 'isVerifiedRider', 'isSuspended', 'suspensionReason', 'suspendedAt']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerifiedUser: user.isVerifiedUser,
        isVerifiedRider: user.isVerifiedRider,
        isSuspended: user.isSuspended,
        suspensionReason: user.suspensionReason,
        suspendedAt: user.suspendedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE user info
const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: "Username and phone are required" });
    }

    const phoneRegex = /^(97|98)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const existingUser = await User.findOne({ 
      where: { 
        phone,
        id: { [require('sequelize').Op.ne]: userId }
      } 
    });

    if (existingUser) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.phone = phone;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Update user info error:", error);
    res.status(500).json({ message: "Server error during update" });
  }
};

// ✅ UPLOAD profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new profile picture path (relative path)
    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;
    user.profilePicture = profilePicturePath;
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePicture: profilePicturePath
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
};

// ✅ DELETE profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ message: 'No profile picture to delete' });
    }

    // Delete file from server
    const filePath = path.join(__dirname, '..', user.profilePicture);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from database
    user.profilePicture = null;
    await user.save();

    res.status(200).json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ message: 'Error deleting profile picture' });
  }
};

module.exports = { 
  getUserInfo, 
  updateUserInfo, 
  uploadProfilePicture,  // ✅ ADD
  deleteProfilePicture   // ✅ ADD
};