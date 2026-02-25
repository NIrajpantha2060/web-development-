// Check rating data in database
require('dotenv').config();
const sequelize = require('./config/db');

async function check() {
  const [rows] = await sequelize.query(`
    SELECT id, username, "riderAverageRating", "totalRatingsReceived" 
    FROM users 
    WHERE id = 7
  `);
  console.log('User 7 rating data:', rows);
  process.exit(0);
}

check();
