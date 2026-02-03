const express = require("express");
const router = express.Router();
const {
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
  deleteVerification
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Get pending verifications
router.get("/verifications/pending", authMiddleware, adminOnly, getPendingVerifications);

// Get all verifications (with optional status filter)
router.get("/verifications", authMiddleware, adminOnly, getAllVerifications);

// Approve verification
router.put("/verifications/:id/approve", authMiddleware, adminOnly, approveVerification);

// Reject verification
router.put("/verifications/:id/reject", authMiddleware, adminOnly, rejectVerification);

// Delete verification
router.delete("/verifications/:id", authMiddleware, adminOnly, deleteVerification);

module.exports = router;
