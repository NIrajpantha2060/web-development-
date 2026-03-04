const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RideBooking = sequelize.define("RideBooking", {
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
  passengerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  seatsBooked: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Total payment amount in NPR'
  },
  paymentMethod: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['esewa', 'khalti', 'connectips', 'card', 'debit_card']]
    },
    comment: 'Payment method used'
  },
  paymentStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'completed',
    validate: {
      isIn: [['pending', 'completed', 'failed', 'refunded']]
    }
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Payment gateway transaction ID'
  },
  bookingStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'confirmed',
    validate: {
      isIn: [['confirmed', 'cancelled', 'completed']]
    },
    comment: 'confirmed = booking active, cancelled = user cancelled, completed = ride completed'
  },
  // ✅ NEW: Rating fields for passenger to rate the rider
  riderRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'Rating given by passenger to rider (1-5 stars)'
  },
  riderReview: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Optional review text from passenger'
  },
  ratedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the rating was submitted'
  },
  hiddenFromHistory: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'When true, this booking is hidden from passenger history view'
  }
}, {
  timestamps: true,
  tableName: 'ride_bookings'
});

// Define associations
RideBooking.associate = (models) => {
  RideBooking.belongsTo(models.Ride, { 
    foreignKey: 'rideId',
    as: 'ride'
  });
  RideBooking.belongsTo(models.User, { 
    foreignKey: 'passengerId',
    as: 'passenger'
  });
};

module.exports = RideBooking;
