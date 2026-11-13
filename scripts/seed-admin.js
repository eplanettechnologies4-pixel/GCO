/**
 * Seed Admin User Script
 *
 * Usage:
 *   node scripts/seed-admin.js <username> <password>
 * Example:
 *   node scripts/seed-admin.js admin MySecurePass123!
 */

const bcrypt = require('bcryptjs');

const username = process.argv[2] || 'admin';
const password = process.argv[3] || 'AdminPassword123!';

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log('==================================================');
  console.log('GCO Foundation - Admin User Generator');
  console.log('==================================================');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log(`Bcrypt Hash: ${hash}\n`);
  console.log('Run this SQL in your Supabase SQL Editor:');
  console.log('--------------------------------------------------');
  console.log(`INSERT INTO admins (username, password)`);
  console.log(`VALUES ('${username.replace(/'/g, "''")}', '${hash}')`);
  console.log(`ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;`);
  console.log('--------------------------------------------------');
}

main().catch((err) => {
  console.error('Error generating admin seed:', err);
  process.exit(1);
});

