const express = require("express");
const router = express.Router();
const {
  getPendingVerifications,
  getAllVerifications,
  approveVerification,
  rejectVerification,
  deleteVerification,
  // User management
  getAllUsers,
  getUserDetails,
  suspendUser,
  unsuspendUser,
  deleteUser,
  // Ride management
  getAllRides,
  getRideDetails,
  deleteRide,
  cancelRide
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// 
// VERIFICATION ROUTES
// 

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

// =====================================================
// USER MANAGEMENT ROUTES
// =====================================================

// Get all users with report counts
router.get("/users", authMiddleware, adminOnly, getAllUsers);

// Get single user details
router.get("/users/:id", authMiddleware, adminOnly, getUserDetails);

// Suspend a user
router.put("/users/:id/suspend", authMiddleware, adminOnly, suspendUser);

// Unsuspend (reactivate) a user
router.put("/users/:id/unsuspend", authMiddleware, adminOnly, unsuspendUser);

// Delete a user
router.delete("/users/:id", authMiddleware, adminOnly, deleteUser);

// =====================================================
// RIDE MANAGEMENT ROUTES
// =====================================================

// Get all rides with search/filter
router.get("/rides", authMiddleware, adminOnly, getAllRides);

// Get single ride details with all passengers
router.get("/rides/:id", authMiddleware, adminOnly, getRideDetails);

// Cancel a ride
router.put("/rides/:id/cancel", authMiddleware, adminOnly, cancelRide);

// Delete a ride
router.delete("/rides/:id", authMiddleware, adminOnly, deleteRide);

module.exports = router;
