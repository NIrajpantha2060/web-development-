const express = require("express");
const router = express.Router();
const {
  submitReport,
  getMyReports,
  getAllReports,
  getPendingReportsCount,
  updateReportStatus,
  deleteReport
} = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// ============= USER ROUTES =============

// Submit a report against a rider
router.post("/submit", authMiddleware, submitReport);

// Get user's own reports
router.get("/my-reports", authMiddleware, getMyReports);

// ============= ADMIN ROUTES =============

// Get all reports (with optional status filter)
router.get("/all", authMiddleware, adminOnly, getAllReports);

// Get pending reports count (for badge on admin dashboard)
router.get("/pending-count", authMiddleware, adminOnly, getPendingReportsCount);

// Update report status
router.put("/:id/status", authMiddleware, adminOnly, updateReportStatus);

// Delete a report
router.delete("/:id", authMiddleware, adminOnly, deleteReport);

module.exports = router;
