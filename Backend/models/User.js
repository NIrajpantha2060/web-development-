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
//   }
// }, {
//   timestamps: true, // Adds createdAt and updatedAt
//   tableName: 'users'
// });

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
  }
}, {
  timestamps: true,
  tableName: 'users'
});

module.exports = User;