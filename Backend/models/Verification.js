const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Verification = sequelize.define("Verification", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  citizenshipFront: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  citizenshipBack: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  citizenshipNumber: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  drivingLicenseFront: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  drivingLicenseBack: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  drivingLicenseNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null
  },
  verificationType: {
    type: DataTypes.ENUM('user_only', 'rider', 'both'),
    allowNull: false,
    comment: 'user_only = only citizenship, rider/both = citizenship + license'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved_user', 'approved_rider', 'approved_both', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'
  },
  adminRemarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Admin user ID who reviewed this verification'
  }
}, {
  timestamps: true,
  tableName: 'verifications'
});

// ✅ IMPORTANT: Define association method
Verification.associate = (models) => {
  Verification.belongsTo(models.User, { 
    foreignKey: 'userId',
    as: 'user' // This creates the alias for includes
  });
};

module.exports = Verification;