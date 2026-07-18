import { SignJWT, jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET || 'insecure-dev-secret-change-me';
const encodedSecret = new TextEncoder().encode(rawSecret);

export const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

if (!process.env.JWT_SECRET) {
  console.warn(
    'WARNING: JWT_SECRET is not set. Copy .env.example to .env.local and set a real secret.'
  );
}

export async function signAdminToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(encodedSecret);
}

export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS
};

// Reads and verifies the admin session from a Next.js Request object (API routes).
export async function getAdminFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// Reads and verifies the admin session from next/headers cookies() (server components).
export async function getAdminFromCookieStore(cookieStore) {
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
