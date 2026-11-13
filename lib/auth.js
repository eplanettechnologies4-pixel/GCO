import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const COOKIE_NAME = 'admin_session';
const DEFAULT_SECRET = 'gco_foundation_admin_jwt_secret_key_2026_super_secure_32char';

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT token for an admin user (valid for 7 days)
 * @param {{ id: string, username: string }} admin
 * @returns {Promise<string>}
 */
export async function createSessionToken(admin) {
  const secretKey = getJwtSecretKey();
  const token = await new SignJWT({
    id: admin.id,
    username: admin.username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  return token;
}

/**
 * Verifies a JWT token and returns the payload, or null if invalid/expired
 * @param {string} token
 * @returns {Promise<{ id: string, username: string }|null>}
 */
export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Helper to get cookie options for the admin session
 */
export function getSessionCookieOptions(maxAge = 7 * 24 * 60 * 60) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}

export { COOKIE_NAME };

/**
 * Extracts and verifies the admin session from a NextRequest or cookies
 * @param {import('next/server').NextRequest} request
 * @returns {Promise<{ id: string, username: string }|null>}
 */
export async function getAuthenticatedAdmin(request) {
  const cookie = request?.cookies?.get?.(COOKIE_NAME);
  const token = cookie?.value;
  return verifySessionToken(token);
}

/**
 * Hashes a plaintext password using bcrypt (rounds = 10)
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password against a stored bcrypt hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hash) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

