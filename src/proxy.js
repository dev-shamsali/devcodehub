import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

/**
 * Optimistic gate: reads only the session cookie, never the database. The
 * real checks live in the pages and route handlers (see requireUser).
 */
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  if ((pathname.startsWith('/media') || pathname.startsWith('/editor')) && !req.auth) {
    const url = new URL('/login', req.nextUrl.origin);
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }
  // Logged-in users have no business on the auth forms.
  if (req.auth && ['/', '/login', '/signup', '/forgot-password'].includes(pathname)) {
    return NextResponse.redirect(new URL('/editor', req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/', '/media/:path*', '/editor/:path*', '/login', '/signup', '/forgot-password'],
};
