const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controllers/passwordController");

// POST /api/password/forgot - Send reset email
router.post("/forgot", forgotPassword);

// POST /api/password/reset - Reset password with token
router.post("/reset", resetPassword);

module.exports = router;