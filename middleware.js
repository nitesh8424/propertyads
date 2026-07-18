import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifyAdminToken } from './lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Login page itself must stay reachable.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  if (pathname.startsWith('/admin') && !session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
