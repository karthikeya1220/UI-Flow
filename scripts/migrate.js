#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Running database migrations...');

// Run drizzle-kit push to sync schema with database
const command = 'npx drizzle-kit push --config drizzle.config.ts';

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  if (stderr) {
    console.error('⚠️ Migration warnings:', stderr);
  }

  console.log('✅ Migration completed successfully!');
  console.log(stdout);
});
