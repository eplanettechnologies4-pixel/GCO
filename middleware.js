import { NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(sessionCookie);
  const isAuthenticated = Boolean(session);

  // 1. Admin UI Pages (/admin/*)
  if (pathname.startsWith('/admin')) {
    // Login page: allow through, or redirect to dashboard if already logged in
    if (pathname === '/admin/login') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Root /admin -> redirect to dashboard (or login if not authenticated)
    if (pathname === '/admin') {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // All other /admin routes require authentication
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. API Routes (/api/*)
  if (pathname.startsWith('/api')) {
    // Explicitly public API routes:
    if (pathname === '/api/admin/login' && method === 'POST') {
      return NextResponse.next();
    }
    if (pathname === '/api/contact' && method === 'POST') {
      return NextResponse.next();
    }
    if (pathname === '/api/projects' && method === 'GET') {
      return NextResponse.next();
    }
    if (pathname.startsWith('/api/projects/') && method === 'GET') {
      return NextResponse.next();
    }

    // All other API routes are protected (admin only)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};

