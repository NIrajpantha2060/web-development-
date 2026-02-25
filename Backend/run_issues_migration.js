// run_issues_migration.js
// Run this script to create the issues table

const sequelize = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🚀 Starting Issues table migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'migrations', 'add_issues_table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolons and filter out empty statements and comments
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`\n📝 Executing: ${statement.substring(0, 50)}...`);
        await sequelize.query(statement);
        console.log('✅ Success');
      }
    }
    
    console.log('\n✅ Issues migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // If table already exists, that's okay
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Table already exists, skipping...');
      process.exit(0);
    }
    
    process.exit(1);
  }
}

runMigration();
