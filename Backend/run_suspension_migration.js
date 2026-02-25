// Migration script to add suspension fields to users table
// Run with: node run_suspension_migration.js

const sequelize = require('./config/db');

const runMigration = async () => {
  try {
    console.log('Starting suspension fields migration...');

    // Check if isSuspended column already exists (PostgreSQL syntax)
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'isSuspended'
    `);

    if (results.length > 0) {
      console.log('✓ Suspension fields already exist. Migration skipped.');
      process.exit(0);
    }

    console.log('Adding suspension fields to users table...');

    // Add isSuspended column (PostgreSQL syntax)
    await sequelize.query(`
      ALTER TABLE users
      ADD COLUMN "isSuspended" BOOLEAN NOT NULL DEFAULT FALSE
    `);
    console.log('✓ Added isSuspended column');

    // Add suspensionReason column
    await sequelize.query(`
      ALTER TABLE users
      ADD COLUMN "suspensionReason" TEXT NULL
    `);
    console.log('✓ Added suspensionReason column');

    // Add suspendedAt column
    await sequelize.query(`
      ALTER TABLE users
      ADD COLUMN "suspendedAt" TIMESTAMP WITH TIME ZONE NULL
    `);
    console.log('✓ Added suspendedAt column');

    // Add suspendedBy column
    await sequelize.query(`
      ALTER TABLE users
      ADD COLUMN "suspendedBy" INTEGER NULL
    `);
    console.log('✓ Added suspendedBy column');

    // Add index for faster queries
    await sequelize.query(`
      CREATE INDEX idx_users_suspended ON users("isSuspended")
    `);
    console.log('✓ Added index on isSuspended');

    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

runMigration();
