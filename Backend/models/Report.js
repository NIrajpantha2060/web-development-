const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Report = sequelize.define("Report", {
  // Reference to the booking
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ride_bookings',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  // Reference to the ride
  rideId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rides',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  // User who is reporting (passenger)
  reporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  // Rider being reported
  reportedRiderId: {
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
      isIn: [['safety', 'behavior', 'vehicle_condition', 'route_deviation', 'overcharging', 'late_arrival', 'other']]
    },
    comment: 'Category of the reported issue'
  },
  // Detailed remarks from the user
  remarks: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Detailed description of the issue'
  },
  // Report status
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'under_review', 'resolved', 'dismissed']]
    },
    comment: 'Status of the report'
  },
  // Admin who reviewed the report
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Admin who reviewed the report'
  },
  // Admin remarks/action taken
  adminRemarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Admin notes or action taken'
  },
  // When the report was reviewed
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the report was reviewed by admin'
  }
}, {
  timestamps: true,
  tableName: 'reports'
});

// Define associations
Report.associate = (models) => {
  Report.belongsTo(models.RideBooking, { 
    foreignKey: 'bookingId',
    as: 'booking'
  });
  Report.belongsTo(models.Ride, { 
    foreignKey: 'rideId',
    as: 'ride'
  });
  Report.belongsTo(models.User, { 
    foreignKey: 'reporterId',
    as: 'reporter'
  });
  Report.belongsTo(models.User, { 
    foreignKey: 'reportedRiderId',
    as: 'reportedRider'
  });
  Report.belongsTo(models.User, { 
    foreignKey: 'reviewedBy',
    as: 'reviewer'
  });
};

module.exports = Report;
