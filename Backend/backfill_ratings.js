// Backfill script to calculate average ratings from existing bookings
require('dotenv').config();
const sequelize = require('./config/db');

async function backfillRatings() {
  try {
    console.log('🔄 Backfilling rider average ratings from existing bookings...');
    
    // Get all riders who have received ratings
    const [results] = await sequelize.query(`
      SELECT 
        r."userId" as rider_id,
        AVG(rb."riderRating") as avg_rating,
        COUNT(rb."riderRating") as total_ratings
      FROM ride_bookings rb
      JOIN rides r ON rb."rideId" = r.id
      WHERE rb."riderRating" IS NOT NULL
      GROUP BY r."userId"
    `);
    
    console.log(`Found ${results.length} riders with ratings to update`);
    
    for (const row of results) {
      const avgRating = Math.round(parseFloat(row.avg_rating) * 10) / 10;
      const totalRatings = parseInt(row.total_ratings);
      
      await sequelize.query(`
        UPDATE users 
        SET "riderAverageRating" = :avgRating, 
            "totalRatingsReceived" = :totalRatings
        WHERE id = :riderId
      `, {
        replacements: { 
          avgRating, 
          totalRatings, 
          riderId: row.rider_id 
        }
      });
      
      console.log(`✅ Updated rider ${row.rider_id}: ${avgRating} avg (${totalRatings} ratings)`);
    }
    
    console.log('✅ Backfill completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Backfill failed:', error.message);
    process.exit(1);
  }
}

backfillRatings();
