// const express = require("express");
// const router = express.Router();
// const { getUserInfo, updateUserInfo } = require("../controllers/userController");
// const authMiddleware = require("../middleware/authMiddleware");

// // GET user info (protected)
// router.get("/info", authMiddleware, getUserInfo);

// // UPDATE user info (protected)
// router.put("/update", authMiddleware, updateUserInfo);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { 
  getUserInfo, 
  updateUserInfo, 
  uploadProfilePicture,
  deleteProfilePicture 
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/UploadMiddleware");  // ✅ ADD

// GET user info (protected)
router.get("/info", authMiddleware, getUserInfo);

// UPDATE user info (protected)
router.put("/update", authMiddleware, updateUserInfo);

// ✅ UPLOAD profile picture (protected)
router.post("/upload-profile", authMiddleware, upload.single('profilePicture'), uploadProfilePicture);

// ✅ DELETE profile picture (protected)
router.delete("/delete-profile", authMiddleware, deleteProfilePicture);

module.exports = router;