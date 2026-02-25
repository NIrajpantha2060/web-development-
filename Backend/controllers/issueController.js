const Issue = require("../models/Issue");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { Op } = require('sequelize');

// ✅ Valid issue types
const VALID_ISSUE_TYPES = ['booking', 'verification', 'payment', 'ride_experience', 'technical', 'account', 'other'];

// ✅ Submit a new issue
const submitIssue = async (req, res) => {
  try {
    const userId = req.user.id;
    const { issueType, subject, description } = req.body;
    
    // Get photo path if uploaded
    const photo = req.file ? `/uploads/issues/${req.file.filename}` : null;

    // Validate required fields
    if (!issueType || !subject || !description) {
      return res.status(400).json({ 
        message: "Issue type, subject, and description are required" 
      });
    }

    // Validate issue type
    if (!VALID_ISSUE_TYPES.includes(issueType)) {
      return res.status(400).json({ 
        message: "Invalid issue type" 
      });
    }

    // Validate subject length
    if (subject.length < 10) {
      return res.status(400).json({ 
        message: "Subject must be at least 10 characters" 
      });
    }

    // Validate description length
    if (description.length < 20) {
      return res.status(400).json({ 
        message: "Please provide a more detailed description (at least 20 characters)" 
      });
    }

    // Create the issue
    const issue = await Issue.create({
      userId,
      issueType,
      subject,
      description,
      photo,
      status: 'open'
    });

    console.log(`📝 New issue submitted: ID ${issue.id} by user ${userId}`);

    res.status(201).json({
      message: "Issue submitted successfully. Our team will review it shortly.",
      issue: {
        id: issue.id,
        issueType: issue.issueType,
        subject: issue.subject,
        status: issue.status,
        createdAt: issue.createdAt
      }
    });

  } catch (error) {
    console.error("Submit issue error:", error);
    res.status(500).json({ 
      message: "Error submitting issue",
      error: error.message
    });
  }
};

// ✅ Get user's own issues
const getMyIssues = async (req, res) => {
  try {
    const userId = req.user.id;

    const issues = await Issue.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'assignedAdmin',
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(200).json({
      count: issues.length,
      issues
    });

  } catch (error) {
    console.error("Get my issues error:", error);
    res.status(500).json({ 
      message: "Error fetching your issues",
      error: error.message
    });
  }
};

// ✅ Get single issue details (for user)
const getIssueDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const issue = await Issue.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          as: 'assignedAdmin',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ issue });

  } catch (error) {
    console.error("Get issue details error:", error);
    res.status(500).json({ 
      message: "Error fetching issue details",
      error: error.message
    });
  }
};

// ============= ADMIN FUNCTIONS =============

// ✅ ADMIN: Get all issues
const getAllIssues = async (req, res) => {
  try {
    const { status } = req.query;
    
    const whereClause = status ? { status } : {};

    const issues = await Issue.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture']
        },
        {
          model: User,
          as: 'assignedAdmin',
          attributes: ['id', 'username']
        }
      ],
      order: [
        ['status', 'ASC'], // Open issues first
        ['createdAt', 'DESC']
      ]
    });

    res.status(200).json({
      count: issues.length,
      issues
    });

  } catch (error) {
    console.error("Get all issues error:", error);
    res.status(500).json({ 
      message: "Error fetching issues",
      error: error.message
    });
  }
};

// ✅ ADMIN: Get open issues count (for badge)
const getOpenIssuesCount = async (req, res) => {
  try {
    const count = await Issue.count({
      where: { 
        status: {
          [Op.in]: ['open', 'in_progress']
        }
      }
    });

    res.status(200).json({ count });

  } catch (error) {
    console.error("Get open issues count error:", error);
    res.status(500).json({ 
      message: "Error fetching issues count",
      error: error.message
    });
  }
};

// ✅ ADMIN: Get single issue details
const getIssueDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'isVerifiedUser', 'isVerifiedRider']
        },
        {
          model: User,
          as: 'assignedAdmin',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ issue });

  } catch (error) {
    console.error("Get issue details (admin) error:", error);
    res.status(500).json({ 
      message: "Error fetching issue details",
      error: error.message
    });
  }
};

// ✅ ADMIN: Update issue status
const updateIssueStatus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be: open, in_progress, resolved, or closed" 
      });
    }

    const issue = await Issue.findByPk(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const updateData = { 
      status,
      assignedTo: adminId
    };

    // Set resolved timestamp if resolving/closing
    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
    }

    await issue.update(updateData);

    // Notify the user about status change
    await Notification.create({
      userId: issue.userId,
      type: 'issue_update',
      title: 'Issue Status Updated',
      message: `Your issue "${issue.subject}" has been marked as ${status.replace('_', ' ')}.`,
      isRead: false
    });

    res.status(200).json({
      message: `Issue status updated to ${status}`,
      issue: {
        id: issue.id,
        status: issue.status,
        assignedTo: adminId
      }
    });

  } catch (error) {
    console.error("Update issue status error:", error);
    res.status(500).json({ 
      message: "Error updating issue status",
      error: error.message
    });
  }
};

// ✅ ADMIN: Respond to issue
const respondToIssue = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const { response, status } = req.body;

    if (!response || response.trim().length < 10) {
      return res.status(400).json({ 
        message: "Please provide a response (at least 10 characters)" 
      });
    }

    const issue = await Issue.findByPk(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const updateData = {
      adminResponse: response,
      respondedAt: new Date(),
      assignedTo: adminId
    };

    // Optionally update status
    if (status && ['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      updateData.status = status;
      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = new Date();
      }
    } else {
      // Default to in_progress if not specified
      if (issue.status === 'open') {
        updateData.status = 'in_progress';
      }
    }

    await issue.update(updateData);

    // Notify the user about the response
    await Notification.create({
      userId: issue.userId,
      type: 'issue_response',
      title: 'Response to Your Issue',
      message: `An admin has responded to your issue: "${issue.subject}". Check your issues for details.`,
      isRead: false
    });

    res.status(200).json({
      message: "Response sent successfully",
      issue: {
        id: issue.id,
        status: issue.status,
        adminResponse: issue.adminResponse,
        respondedAt: issue.respondedAt
      }
    });

  } catch (error) {
    console.error("Respond to issue error:", error);
    res.status(500).json({ 
      message: "Error responding to issue",
      error: error.message
    });
  }
};

// ✅ ADMIN: Delete an issue
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByPk(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await issue.destroy();

    res.status(200).json({
      message: "Issue deleted successfully"
    });

  } catch (error) {
    console.error("Delete issue error:", error);
    res.status(500).json({ 
      message: "Error deleting issue",
      error: error.message
    });
  }
};

module.exports = {
  submitIssue,
  getMyIssues,
  getIssueDetails,
  getAllIssues,
  getOpenIssuesCount,
  getIssueDetailsAdmin,
  updateIssueStatus,
  respondToIssue,
  deleteIssue
};
