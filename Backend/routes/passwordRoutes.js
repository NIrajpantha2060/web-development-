const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword, changePassword } = require("../controllers/passwordController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/password/forgot - Send reset email
router.post("/forgot", forgotPassword);

// POST /api/password/reset - Reset password with token
router.post("/reset", resetPassword);

// PUT /api/password/change - Change password for authenticated user
router.put("/change", authMiddleware, changePassword);

module.exports = router;
