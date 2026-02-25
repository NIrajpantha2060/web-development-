// Run migration to fix notification type column
require('dotenv').config();
const sequelize = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Running notification type migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', 'fix_notification_type.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolons and run each statement
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
        await sequelize.query(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
