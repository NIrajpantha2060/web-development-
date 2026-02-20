const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vehicle = sequelize.define("Vehicle", {
  vehicleNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  vehicleType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['bike', 'car']]
    }
  },
  vehiclePhoto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Path to vehicle photo'
  },
  vehicleBrand: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  vehicleModel: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // ✅ ONE vehicle per user
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  timestamps: true,
  tableName: 'vehicles'
});

// ✅ Define association method
Vehicle.associate = (models) => {
  Vehicle.belongsTo(models.User, { 
    foreignKey: 'userId',
    as: 'owner'
  });
};

module.exports = Vehicle;