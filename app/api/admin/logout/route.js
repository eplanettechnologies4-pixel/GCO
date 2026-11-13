import { NextResponse } from 'next/server';
import { getSessionCookieOptions, COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully.',
  });

  const cookieOptions = getSessionCookieOptions(0);
  response.cookies.set(COOKIE_NAME, '', cookieOptions);

  return response;
}

