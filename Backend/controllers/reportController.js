const Report = require("../models/Report");
const RideBooking = require("../models/RideBooking");
const Ride = require("../models/Ride");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { Op } = require('sequelize');

// ✅ Submit a report against a rider
const submitReport = async (req, res) => {
  try {
    const reporterId = req.user.id;
    const { bookingId, issueType, remarks } = req.body;

    // Validate required fields
    if (!bookingId || !issueType || !remarks) {
      return res.status(400).json({ 
        message: "Booking ID, issue type, and remarks are required" 
      });
    }

    // Validate issue type
    const validIssueTypes = ['safety', 'behavior', 'vehicle_condition', 'route_deviation', 'overcharging', 'late_arrival', 'other'];
    if (!validIssueTypes.includes(issueType)) {
      return res.status(400).json({ 
        message: "Invalid issue type" 
      });
    }

    // Validate remarks length
    if (remarks.length < 10) {
      return res.status(400).json({ 
        message: "Please provide a more detailed description (at least 10 characters)" 
      });
    }

    // Find the booking with ride details
    const booking = await RideBooking.findByPk(bookingId, {
      include: [{
        model: Ride,
        as: 'ride',
        include: [{
          model: User,
          as: 'rider',
          attributes: ['id', 'username']
        }]
      }]
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the reporter is the passenger of this booking
    if (booking.passengerId !== reporterId) {
      return res.status(403).json({ 
        message: "You can only report riders from your own bookings" 
      });
    }

    // Check if already reported this booking
    const existingReport = await Report.findOne({
      where: { 
        bookingId, 
        reporterId 
      }
    });

    if (existingReport) {
      return res.status(400).json({ 
        message: "You have already submitted a report for this ride" 
      });
    }

    // Create the report
    const report = await Report.create({
      bookingId,
      rideId: booking.rideId,
      reporterId,
      reportedRiderId: booking.ride.userId,
      issueType,
      remarks,
      status: 'pending'
    });

    // Create notification for admin (will be seen when admin views reports)
    // Note: In a real app, you might want to create notifications for all admins
    console.log(`📝 New report submitted: ID ${report.id} by user ${reporterId}`);

    res.status(201).json({
      message: "Report submitted successfully. Our team will review it shortly.",
      report: {
        id: report.id,
        issueType: report.issueType,
        status: report.status,
        createdAt: report.createdAt
      }
    });

  } catch (error) {
    console.error("Submit report error:", error);
    res.status(500).json({ 
      message: "Error submitting report",
      error: error.message
    });
  }
};

// ✅ Get user's own reports
const getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await Report.findAll({
      where: { reporterId: userId },
      include: [
        {
          model: Ride,
          as: 'ride',
          attributes: ['id', 'from', 'to', 'date', 'time']
        },
        {
          model: User,
          as: 'reportedRider',
          attributes: ['id', 'username', 'profilePicture']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      count: reports.length,
      reports
    });

  } catch (error) {
    console.error("Get my reports error:", error);
    res.status(500).json({ 
      message: "Error fetching your reports",
      error: error.message
    });
  }
};

// ✅ ADMIN: Get all reports
const getAllReports = async (req, res) => {
  try {
    const { status } = req.query;
    
    const whereClause = status ? { status } : {};

    const reports = await Report.findAll({
      where: whereClause,
      include: [
        {
          model: RideBooking,
          as: 'booking',
          attributes: ['id', 'seatsBooked', 'totalAmount', 'createdAt']
        },
        {
          model: Ride,
          as: 'ride',
          attributes: ['id', 'from', 'to', 'date', 'time', 'vehicleType', 'vehicleNumber']
        },
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture']
        },
        {
          model: User,
          as: 'reportedRider',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedRider']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      count: reports.length,
      reports
    });

  } catch (error) {
    console.error("Get all reports error:", error);
    res.status(500).json({ 
      message: "Error fetching reports",
      error: error.message
    });
  }
};

// ✅ ADMIN: Get pending reports count
const getPendingReportsCount = async (req, res) => {
  try {
    const count = await Report.count({
      where: { status: 'pending' }
    });

    res.status(200).json({ count });

  } catch (error) {
    console.error("Get pending reports count error:", error);
    res.status(500).json({ 
      message: "Error fetching pending reports count",
      error: error.message
    });
  }
};

// ✅ ADMIN: Update report status
const updateReportStatus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const reportId = req.params.id;
    const { status, adminRemarks } = req.body;

    // Validate status
    const validStatuses = ['pending', 'under_review', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Use: pending, under_review, resolved, or dismissed" 
      });
    }

    const report = await Report.findByPk(reportId, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'username']
        },
        {
          model: User,
          as: 'reportedRider',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update the report
    report.status = status;
    report.reviewedBy = adminId;
    report.adminRemarks = adminRemarks || report.adminRemarks;
    report.reviewedAt = new Date();

    await report.save();

    // Notify the reporter about the status update
    let notificationMessage = '';
    switch (status) {
      case 'under_review':
        notificationMessage = `Your report against ${report.reportedRider.username} is now under review.`;
        break;
      case 'resolved':
        notificationMessage = `Your report against ${report.reportedRider.username} has been resolved. ${adminRemarks ? `Admin notes: ${adminRemarks}` : ''}`;
        break;
      case 'dismissed':
        notificationMessage = `Your report against ${report.reportedRider.username} has been reviewed. ${adminRemarks ? `Admin notes: ${adminRemarks}` : ''}`;
        break;
    }

    if (notificationMessage) {
      await Notification.create({
        userId: report.reporterId,
        type: 'report_update',
        title: 'Report Status Update',
        message: notificationMessage,
        relatedId: report.id
      });
    }

    console.log(`📋 Report ${reportId} updated to ${status} by admin ${adminId}`);

    res.status(200).json({
      message: "Report status updated successfully",
      report
    });

  } catch (error) {
    console.error("Update report status error:", error);
    res.status(500).json({ 
      message: "Error updating report status",
      error: error.message
    });
  }
};

// ✅ ADMIN: Delete a report
const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.destroy();

    console.log(`🗑️ Report ${reportId} deleted`);

    res.status(200).json({
      message: "Report deleted successfully"
    });

  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({ 
      message: "Error deleting report",
      error: error.message
    });
  }
};

module.exports = {
  submitReport,
  getMyReports,
  getAllReports,
  getPendingReportsCount,
  updateReportStatus,
  deleteReport
};
