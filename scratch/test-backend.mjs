import { hashPassword, comparePassword, createSessionToken, verifySessionToken } from '../lib/auth.js';
import { getProjects } from '../lib/db-projects.js';

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');

  // Test 1: Auth & Bcrypt
  const pass = 'AdminPassword123!';
  const hash = await hashPassword(pass);
  const match = await comparePassword(pass, hash);
  const wrongMatch = await comparePassword('WrongPassword', hash);
  if (match && !wrongMatch) {
    console.log('✔ Test 1 Passed: Bcrypt hashing & password verification working properly.');
  } else {
    throw new Error('Test 1 Failed: Bcrypt comparison mismatch');
  }

  // Test 2: JWT Session Token creation & verification
  const token = await createSessionToken({ id: 'test-admin-id', username: 'admin' });
  const verified = await verifySessionToken(token);
  if (verified && verified.username === 'admin' && verified.id === 'test-admin-id') {
    console.log('✔ Test 2 Passed: Signed JWT session token with jose created and verified successfully.');
  } else {
    throw new Error('Test 2 Failed: JWT verification mismatch');
  }

  // Test 3: db-projects fallback
  const projects = await getProjects();
  if (Array.isArray(projects) && projects.length >= 5) {
    console.log(`✔ Test 3 Passed: getProjects() returned ${projects.length} projects successfully with fallback support.`);
  } else {
    throw new Error('Test 3 Failed: getProjects returned empty or invalid structure');
  }

  // Test 4: db-projects with limit
  const limited = await getProjects({ limit: 4 });
  if (Array.isArray(limited) && limited.length === 4) {
    console.log(`✔ Test 4 Passed: getProjects({ limit: 4 }) returned ${limited.length} projects.`);
  } else {
    throw new Error('Test 4 Failed: getProjects limit mismatch');
  }

  console.log('--- ALL VERIFICATION TESTS PASSED ---');
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
