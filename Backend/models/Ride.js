const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ride = sequelize.define("Ride", {
  from: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  to: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  pickupLocation: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  vehicleNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  vehiclePhoto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Path to vehicle photo'
  },
  vehicleType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['bike', 'car']]
    }
  },
  description: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Price per seat in NPR'
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'cancelled', 'completed', 'taken']]
    },
    comment: 'active = ride available, cancelled = rider cancelled, completed = ride finished, taken = all seats booked'
  },
  bookedSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of seats already booked'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  timestamps: true,
  tableName: 'rides'
});

// ✅ Define association method
Ride.associate = (models) => {
  Ride.belongsTo(models.User, { 
    foreignKey: 'userId',
    as: 'rider'
  });
  // ✅ NEW: RideBooking association
  Ride.hasMany(models.RideBooking, { 
    foreignKey: 'rideId',
    as: 'bookings'
  });
};

module.exports = Ride;