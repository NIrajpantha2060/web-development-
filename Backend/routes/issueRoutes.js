const express = require("express");
const router = express.Router();
const {
  submitIssue,
  getMyIssues,
  getIssueDetails,
  getAllIssues,
  getOpenIssuesCount,
  getIssueDetailsAdmin,
  updateIssueStatus,
  respondToIssue,
  deleteIssue
} = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");
const issueUpload = require("../middleware/issueUploadMiddleware");

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// ============= USER ROUTES =============

// Submit a new issue (with optional photo upload)
router.post("/submit", authMiddleware, issueUpload.single('photo'), submitIssue);

// Get user's own issues
router.get("/my-issues", authMiddleware, getMyIssues);

// Get single issue details (for user)
router.get("/my-issues/:id", authMiddleware, getIssueDetails);

// ============= ADMIN ROUTES =============

// Get all issues (with optional status filter)
router.get("/all", authMiddleware, adminOnly, getAllIssues);

// Get open issues count (for badge on admin dashboard)
router.get("/open-count", authMiddleware, adminOnly, getOpenIssuesCount);

// Get single issue details (admin view with user info)
router.get("/:id", authMiddleware, adminOnly, getIssueDetailsAdmin);

// Update issue status
router.put("/:id/status", authMiddleware, adminOnly, updateIssueStatus);

// Respond to an issue
router.post("/:id/respond", authMiddleware, adminOnly, respondToIssue);

// Delete an issue
router.delete("/:id", authMiddleware, adminOnly, deleteIssue);

module.exports = router;
