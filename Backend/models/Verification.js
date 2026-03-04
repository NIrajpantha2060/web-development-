
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
    allowNull: true,
    defaultValue: null
  },
  citizenshipBack: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null
  },
  citizenshipNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null
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
  // ✅ CRITICAL FIX: Use lowercase to match PostgreSQL column
  licenseExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
    field: 'licenseexpirydate',  // ✅ Map camelCase to lowercase column name
    comment: 'Driving license expiry date'
  },
  verificationType: {
    type: DataTypes.ENUM('user_only', 'rider', 'both'),
    allowNull: false,
    comment: 'user_only = citizenship only, rider = license only, both = both (legacy)'
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

// ✅ Define association method
Verification.associate = (models) => {
  Verification.belongsTo(models.User, { 
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Verification;