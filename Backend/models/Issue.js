const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Issue = sequelize.define("Issue", {
  // User who raised the issue
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  // Issue category
  issueType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['booking', 'verification', 'payment', 'ride_experience', 'technical', 'account', 'other']]
    },
    comment: 'Category of the issue'
  },
  // Brief subject/title
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [10, 100]
    },
    comment: 'Brief subject of the issue (min 10 chars)'
  },
  // Detailed description
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Detailed description of the issue'
  },
  // Photo/screenshot (optional)
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Path to uploaded photo/screenshot'
  },
  // Issue status
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'open',
    validate: {
      isIn: [['open', 'in_progress', 'resolved', 'closed']]
    },
    comment: 'Status of the issue'
  },
  // Admin who is handling the issue
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Admin assigned to handle this issue'
  },
  // Admin response
  adminResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Admin response to the issue'
  },
  // When the admin responded
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When admin responded to the issue'
  },
  // When the issue was resolved/closed
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the issue was resolved'
  }
}, {
  timestamps: true,
  tableName: 'issues'
});

// Associations
Issue.associate = (models) => {
  // Issue belongs to User (who raised it)
  Issue.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  // Issue may be assigned to an Admin
  Issue.belongsTo(models.User, {
    foreignKey: 'assignedTo',
    as: 'assignedAdmin'
  });
};

module.exports = Issue;
