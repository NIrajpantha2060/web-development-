

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Notification = sequelize.define("Notification", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g., verification_approved, verification_rejected, ride_request, etc.'
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of related entity (verification, ride, etc.)'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: true,
  tableName: 'notifications'
});

// ✅ IMPORTANT: Define association method
Notification.associate = (models) => {
  Notification.belongsTo(models.User, { 
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Notification;