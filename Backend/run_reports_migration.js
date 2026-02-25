/**
 * Migration Script: Add Reports Table
 * Run this script to create the reports table in the database
 * 
 * Usage: node run_reports_migration.js
 */

const sequelize = require('./config/db');
const Report = require('./models/Report');

const runMigration = async () => {
  try {
    console.log('Starting reports table migration...');
    
    // Sync only the Report model
    await Report.sync({ force: false, alter: true });
    
    console.log('✅ Reports table created/updated successfully!');
    
    // Verify table exists (PostgreSQL syntax)
    const [results] = await sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'reports'
    `);
    if (results.length > 0) {
      console.log('✅ Reports table verified in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
