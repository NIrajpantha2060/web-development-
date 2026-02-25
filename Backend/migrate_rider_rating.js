// Run migration to add rider rating fields to users table
require('dotenv').config();
const sequelize = require('./config/db');

async function migrate() {
  try {
    console.log('🔄 Adding rider rating fields to users table...');
    
    // Add riderAverageRating column
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "riderAverageRating" DECIMAL(2,1) DEFAULT NULL
    `);
    console.log('✅ Added riderAverageRating column');
    
    // Add totalRatingsReceived column
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "totalRatingsReceived" INTEGER DEFAULT 0 NOT NULL
    `);
    console.log('✅ Added totalRatingsReceived column');
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
