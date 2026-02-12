

// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const User = sequelize.define("User", {
//   username: {
//     type: DataTypes.STRING(30),
//     allowNull: false,
//   },
//   phone: {
//     type: DataTypes.STRING(10),
//     allowNull: false,
//     unique: true,
//     validate: {
//       is: /^(97|98)\d{8}$/
//     }
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true
//     }
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.STRING(20),
//     allowNull: false,
//     defaultValue: 'user',
//     validate: {
//       isIn: [['user', 'admin']]
//     }
//   },
//   profilePicture: {  
//     type: DataTypes.STRING(255),
//     allowNull: true,
//     defaultValue: null
//   },
//   isVerifiedUser: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//     comment: 'True if user has verified citizenship (green tick)'
//   },
//   isVerifiedRider: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//     comment: 'True if user has verified driving license (purple tick)'
//   }
// }, {
//   timestamps: true,
//   tableName: 'users'
// });

// // ✅ IMPORTANT: Define association method
// User.associate = (models) => {
//   User.hasMany(models.Verification, { 
//     foreignKey: 'userId',
//     as: 'verifications'
//   });
//   User.hasMany(models.Notification, { 
//     foreignKey: 'userId',
//     as: 'notifications'
//   });
// };

// module.exports = User;


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
  }
}, {
  timestamps: true,
  tableName: 'users'
});

// ✅ UPDATED: Define association method with Ride model
User.associate = (models) => {
  User.hasMany(models.Verification, { 
    foreignKey: 'userId',
    as: 'verifications'
  });
  User.hasMany(models.Notification, { 
    foreignKey: 'userId',
    as: 'notifications'
  });
  // ✅ ADDED: Ride association
  User.hasMany(models.Ride, { 
    foreignKey: 'userId',
    as: 'rides'
  });
};

module.exports = User;