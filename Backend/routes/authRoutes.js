
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route to verify token validity
router.get("/verify", verifyToken, (req, res) => {
  res.json({ 
    valid: true,
    user: req.user 
  });
});

// Example protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({ 
    message: "Protected route accessed", 
    user: req.user 
  });
});

module.exports = router;