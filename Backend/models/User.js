

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      is: /^(97|98)\d{8}$/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'admin']]
    }
  },
  profilePicture: {  
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  isVerifiedUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if user has verified citizenship (green tick)'
  },
  isVerifiedRider: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if user has verified driving license (purple tick)'
  },
  // ✅ NEW: Payment and MPIN fields
  mpin: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Hashed 4-digit MPIN for payment verification'
  },
  hasMpinSetup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if user has set up MPIN'
  },
  paymentMethod: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: 'debit_card',
    comment: 'Payment method - debit card only'
  },
  hasPaymentSetup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if user has set up payment info'
  },
  // Debit Card fields
  cardLastFour: {
    type: DataTypes.STRING(4),
    allowNull: true,
    comment: 'Last 4 digits of debit card'
  },
  cardHolderName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Name on the debit card'
  },
  cardExpiry: {
    type: DataTypes.STRING(5),
    allowNull: true,
    comment: 'Card expiry in MM/YY format'
  },
  cardBrand: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Card brand (Visa, Mastercard, etc.)'
  },
  // ✅ Rider Rating fields
  riderAverageRating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    defaultValue: null,
    comment: 'Average rating received as a rider (1.0 - 5.0)'
  },
  totalRatingsReceived: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total number of ratings received as a rider'
  },
  // ✅ Suspension fields for admin user management
  isSuspended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if user account is suspended by admin'
  },
  suspensionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason for account suspension'
  },
  suspendedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the account was suspended'
  },
  suspendedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Admin ID who suspended the account'
  }
}, {
  timestamps: true,
  tableName: 'users'
});

// ✅ UPDATED: Define association method with Ride, Vehicle, and RideBooking models
User.associate = (models) => {
  User.hasMany(models.Verification, { 
    foreignKey: 'userId',
    as: 'verifications'
  });
  User.hasMany(models.Notification, { 
    foreignKey: 'userId',
    as: 'notifications'
  });
  User.hasMany(models.Ride, { 
    foreignKey: 'userId',
    as: 'rides'
  });
  // ✅ Vehicle association (one-to-one)
  User.hasOne(models.Vehicle, { 
    foreignKey: 'userId',
    as: 'vehicle'
  });
  // ✅ NEW: RideBooking association (as passenger)
  User.hasMany(models.RideBooking, { 
    foreignKey: 'passengerId',
    as: 'bookings'
  });
};

module.exports = User;