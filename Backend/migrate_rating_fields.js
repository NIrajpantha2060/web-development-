require('dotenv').config();
const sequelize = require('./config/db');

async function migrateRatingFields() {
  try {
    console.log('🔄 Starting migration for rating fields...');
    
    // Add riderRating column
    await sequelize.query('ALTER TABLE ride_bookings ADD COLUMN IF NOT EXISTS "riderRating" INTEGER DEFAULT NULL');
    console.log('✅ riderRating column added');
    
    // Add riderReview column
    await sequelize.query('ALTER TABLE ride_bookings ADD COLUMN IF NOT EXISTS "riderReview" VARCHAR(500) DEFAULT NULL');
    console.log('✅ riderReview column added');
    
    // Add ratedAt column
    await sequelize.query('ALTER TABLE ride_bookings ADD COLUMN IF NOT EXISTS "ratedAt" TIMESTAMP DEFAULT NULL');
    console.log('✅ ratedAt column added');
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Migration Error:', e.message);
    process.exit(1);
  }
}

migrateRatingFields();
