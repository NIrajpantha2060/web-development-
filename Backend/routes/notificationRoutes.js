const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all notifications
router.get("/", authMiddleware, getNotifications);

// Get unread count
router.get("/unread-count", authMiddleware, getUnreadCount);

// Mark notification as read
router.put("/:id/read", authMiddleware, markAsRead);

// Mark all as read
router.put("/read-all", authMiddleware, markAllAsRead);

// Delete notification
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;