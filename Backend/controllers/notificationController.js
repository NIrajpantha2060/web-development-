const Notification = require("../models/Notification");

// Get all notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50 // Get last 50 notifications
    });

    const unreadCount = await Notification.count({
      where: { userId, isRead: false }
    });

    res.status(200).json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Error updating notification" });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Error updating notifications" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: { userId, isRead: false }
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Error fetching unread count" });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};